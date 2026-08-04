from __future__ import annotations

import json
import os
import shutil
import subprocess
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable


DEFAULT_CDP_URL = "http://127.0.0.1:9222"
DEFAULT_CHROME_PROFILE_DIR = Path.home() / ".vipshop-hot-strategy-agent" / "chrome-cdp-profile"
COMPASS_PAGE_URL = "https://compass.vip.com/frontend/index.html#/product/details"
BCT_PAGE_URL = "https://bct.vip.com/vendor_new_v2/index.html#/frontend/strategyEffect/list?tab=userLifecycle"
VIPDIRECT_PAGE_URL = "https://e.vip.com/upgrade.html#/promotion/insite/search/advertisement"
TMAX_PAGE_URL = "https://e.vip.com/upgrade.html#/promotion/tmax/sptg/report-goods"


class CdpBrowserError(RuntimeError):
    """Raised when the CLI cannot prepare a usable CDP browser session."""


@dataclass(frozen=True)
class CdpBrowserSession:
    cdp_url: str
    tab_id: str = ""
    url_prefix: str = ""
    entry_url: str = COMPASS_PAGE_URL
    launched: bool = False
    chrome_path: str = ""
    profile_dir: str = ""
    command: list[str] = field(default_factory=list)


JsonGetter = Callable[[str], Any]
TabCreator = Callable[[str], dict[str, Any]]
Launcher = Callable[[list[str]], Any]


def default_entry_url(params: dict[str, Any] | None = None) -> str:
    scope = _normalize_scope((params or {}).get("report_scope"))
    if "compass_sales_detail" in scope:
        return COMPASS_PAGE_URL
    if "bct_gift" in scope or "bct_scene" in scope:
        return BCT_PAGE_URL
    if "vipdirect_ads" in scope:
        return VIPDIRECT_PAGE_URL
    if "tmax_goods" in scope:
        return TMAX_PAGE_URL
    return COMPASS_PAGE_URL


def ensure_cdp_browser(
    *,
    cdp_url: str = DEFAULT_CDP_URL,
    entry_url: str = COMPASS_PAGE_URL,
    tab_id: str = "",
    url_prefix: str = "",
    auto_launch: bool = True,
    chrome_path: str = "",
    profile_dir: str | Path = "",
    startup_timeout_seconds: float = 20,
    get_json: JsonGetter | None = None,
    create_tab: TabCreator | None = None,
    launcher: Launcher | None = None,
    sleep: Callable[[float], None] = time.sleep,
    monotonic: Callable[[], float] = time.monotonic,
) -> CdpBrowserSession:
    """Prepare a CDP endpoint and return the exact tab for collection.

    The function only inspects Chrome's public CDP target list. It never reads
    cookies, storage, request headers, or page credentials.
    """

    cdp_url = (cdp_url or DEFAULT_CDP_URL).rstrip("/")
    entry_url = entry_url or COMPASS_PAGE_URL
    profile = Path(profile_dir).expanduser() if profile_dir else DEFAULT_CHROME_PROFILE_DIR

    try:
        tabs = _list_tabs(cdp_url, get_json=get_json)
    except CdpBrowserError as first_error:
        if not auto_launch:
            raise CdpBrowserError(
                f"Cannot connect to Chrome CDP at {cdp_url}. Start Chrome with remote debugging or omit --no-auto-cdp."
            ) from first_error
        command = _build_launch_command(cdp_url=cdp_url, chrome_path=chrome_path, profile_dir=profile, entry_url=entry_url)
        launch = launcher or _launch_process
        launch(command)
        deadline = monotonic() + max(float(startup_timeout_seconds), 1)
        last_error: Exception | None = first_error
        while monotonic() < deadline:
            try:
                tabs = _list_tabs(cdp_url, get_json=get_json)
                break
            except CdpBrowserError as error:
                last_error = error
                sleep(0.25)
        else:
            raise CdpBrowserError(f"Chrome CDP did not become ready at {cdp_url}: {last_error}") from last_error
        selected = _select_or_create_tab(
            cdp_url=cdp_url,
            tabs=tabs,
            entry_url=entry_url,
            tab_id=tab_id,
            url_prefix=url_prefix,
            auto_create=True,
            create_tab=create_tab,
        )
        return CdpBrowserSession(
            cdp_url=cdp_url,
            tab_id=str(selected.get("id") or ""),
            entry_url=entry_url,
            launched=True,
            chrome_path=_command_chrome_path(command),
            profile_dir=str(profile),
            command=command,
        )

    selected = _select_or_create_tab(
        cdp_url=cdp_url,
        tabs=tabs,
        entry_url=entry_url,
        tab_id=tab_id,
        url_prefix=url_prefix,
        auto_create=auto_launch and not (tab_id or url_prefix),
        create_tab=create_tab,
    )
    return CdpBrowserSession(
        cdp_url=cdp_url,
        tab_id=str(selected.get("id") or ""),
        url_prefix=url_prefix if url_prefix else "",
        entry_url=entry_url,
        launched=False,
        profile_dir=str(profile),
    )


def _normalize_scope(raw_scope: Any) -> list[str]:
    if isinstance(raw_scope, list):
        values = [str(item).strip() for item in raw_scope if str(item).strip()]
    elif isinstance(raw_scope, tuple):
        values = [str(item).strip() for item in raw_scope if str(item).strip()]
    else:
        text = str(raw_scope or "").strip()
        values = [item for item in text.replace("，", ",").replace("、", ",").split(",") if item.strip()]
    return values or ["compass_sales_detail", "vipdirect_ads", "tmax_goods", "bct_gift", "bct_scene"]


def _json_request(url: str, *, method: str = "GET", timeout: float = 5) -> Any:
    request = urllib.request.Request(url, method=method)
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    try:
        with opener.open(request, timeout=timeout) as response:
            body = response.read().decode("utf-8")
            return json.loads(body) if body else None
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", "ignore")
        raise CdpBrowserError(f"Chrome CDP HTTP {error.code}: {body or error.reason}") from error
    except urllib.error.URLError as error:
        raise CdpBrowserError(str(error.reason)) from error
    except TimeoutError as error:
        raise CdpBrowserError(str(error)) from error


def _list_tabs(cdp_url: str, *, get_json: JsonGetter | None = None) -> list[dict[str, Any]]:
    payload = get_json("/json") if get_json else _json_request(f"{cdp_url}/json")
    if not isinstance(payload, list):
        raise CdpBrowserError("Chrome CDP /json did not return a target list.")
    return [tab for tab in payload if isinstance(tab, dict) and tab.get("type") == "page"]


def _create_tab(cdp_url: str, entry_url: str, *, create_tab: TabCreator | None = None) -> dict[str, Any]:
    if create_tab:
        tab = create_tab(entry_url)
    else:
        encoded = urllib.parse.quote(entry_url, safe="")
        tab = _json_request(f"{cdp_url}/json/new?{encoded}", method="PUT")
    if not isinstance(tab, dict) or not str(tab.get("id") or "").strip():
        raise CdpBrowserError("Chrome CDP /json/new did not return a page tab.")
    return tab


def _select_or_create_tab(
    *,
    cdp_url: str,
    tabs: list[dict[str, Any]],
    entry_url: str,
    tab_id: str,
    url_prefix: str,
    auto_create: bool,
    create_tab: TabCreator | None,
) -> dict[str, Any]:
    explicit = _select_explicit_tab(tabs, tab_id=tab_id, url_prefix=url_prefix)
    if explicit is not None:
        return explicit
    if tab_id or url_prefix:
        raise CdpBrowserError(f"No Chrome tab matches the requested selector: tab_id={tab_id!r}, url_prefix={url_prefix!r}")

    target_matches = [tab for tab in tabs if _tab_matches_entry(tab, entry_url)]
    if len(target_matches) == 1:
        return target_matches[0]
    if len(tabs) == 1 and not _is_devtools_or_blank(tabs[0]):
        return tabs[0]
    if auto_create:
        return _create_tab(cdp_url, entry_url, create_tab=create_tab)
    if not tabs:
        raise CdpBrowserError("Chrome CDP has no page tabs. Enable auto CDP or open a Vipshop page.")
    raise CdpBrowserError("Specify --tab-id or --url-prefix when multiple Chrome tabs are open, or enable auto CDP.")


def _select_explicit_tab(tabs: list[dict[str, Any]], *, tab_id: str = "", url_prefix: str = "") -> dict[str, Any] | None:
    if tab_id:
        for tab in tabs:
            if str(tab.get("id") or "") == str(tab_id):
                return tab
        return None
    if url_prefix:
        candidates = [tab for tab in tabs if str(tab.get("url") or "").startswith(url_prefix)]
        if len(candidates) == 1:
            return candidates[0]
        if len(candidates) > 1:
            raise CdpBrowserError(f"Multiple Chrome tabs match URL prefix: {url_prefix}")
    return None


def _tab_matches_entry(tab: dict[str, Any], entry_url: str) -> bool:
    url = str(tab.get("url") or "")
    if not url:
        return False
    if url.startswith(entry_url):
        return True
    try:
        current = urllib.parse.urlparse(url)
        target = urllib.parse.urlparse(entry_url)
    except Exception:
        return False
    if current.scheme != target.scheme or current.netloc != target.netloc:
        return False
    if target.netloc == "compass.vip.com":
        return "#/product/details" in url or current.path.startswith("/frontend/")
    if target.netloc == "e.vip.com":
        return current.path.startswith("/upgrade.html")
    if target.netloc == "bct.vip.com":
        return True
    return True


def _is_devtools_or_blank(tab: dict[str, Any]) -> bool:
    url = str(tab.get("url") or "")
    return not url or url == "about:blank" or url.startswith("devtools://")


def _build_launch_command(*, cdp_url: str, chrome_path: str, profile_dir: Path, entry_url: str) -> list[str]:
    parsed = urllib.parse.urlparse(cdp_url)
    host = parsed.hostname or "127.0.0.1"
    if host not in {"127.0.0.1", "localhost", "::1"}:
        raise CdpBrowserError(f"Auto CDP launch only supports local Chrome endpoints, got {cdp_url}.")
    port = parsed.port or 9222
    resolved_chrome = chrome_path or find_chrome_executable()
    profile_dir.mkdir(parents=True, exist_ok=True)
    return [
        resolved_chrome,
        f"--remote-debugging-port={port}",
        f"--user-data-dir={profile_dir}",
        "--no-first-run",
        "--no-default-browser-check",
        "--remote-allow-origins=*",
        entry_url,
    ]


def find_chrome_executable() -> str:
    candidates = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
        "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ]
    for candidate in candidates:
        if Path(candidate).is_file():
            return candidate
    for name in ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "chrome"]:
        resolved = shutil.which(name)
        if resolved:
            return resolved
    raise CdpBrowserError("Cannot find Chrome. Pass --chrome-path with a Chrome/Chromium executable.")


def _launch_process(command: list[str]) -> subprocess.Popen[Any]:
    env = {**os.environ, "NO_PROXY": "127.0.0.1,localhost,::1"}
    return subprocess.Popen(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True, env=env)


def _command_chrome_path(command: list[str]) -> str:
    return command[0] if command else ""

