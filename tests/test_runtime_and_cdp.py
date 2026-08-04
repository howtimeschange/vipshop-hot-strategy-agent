from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from vipshop_hot_strategy_agent import cdp_browser
from vipshop_hot_strategy_agent.cdp_browser import CdpBrowserError, ensure_cdp_browser
from vipshop_hot_strategy_agent.collect import load_runtime, runtime_candidates


class RuntimeAndCdpTest(unittest.TestCase):
    def test_default_runtime_loads_from_vendored_package(self) -> None:
        browser_executor, phase_runner = load_runtime()

        self.assertTrue(browser_executor.__name__.endswith(".crawshrimp_runtime.browser_executor"))
        self.assertTrue(phase_runner.__name__.endswith(".crawshrimp_runtime.phase_runner"))
        self.assertTrue(hasattr(browser_executor, "ChromeCDPBackend"))
        self.assertTrue(hasattr(phase_runner, "WebPhaseRunner"))

    def test_runtime_candidates_are_project_local_only(self) -> None:
        candidates = [str(path) for path in runtime_candidates()]

        self.assertEqual(candidates, [str(ROOT / "vendor" / "crawshrimp-skill" / "scripts")])
        self.assertFalse(any("/.codex/plugins/" in item or "/Documents/crawshrimp/" in item for item in candidates))

    def test_explicit_runtime_root_is_still_supported(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            scripts = Path(tmp)
            (scripts / "browser_executor.py").write_text("MARKER = 'explicit'\nclass ChromeCDPBackend: pass\n", encoding="utf-8")
            (scripts / "phase_runner.py").write_text(
                "from browser_executor import MARKER\nclass WebPhaseRunner: pass\n",
                encoding="utf-8",
            )

            browser_executor, phase_runner = load_runtime(scripts)

            self.assertEqual(browser_executor.MARKER, "explicit")
            self.assertEqual(phase_runner.MARKER, "explicit")

    def test_existing_cdp_target_is_reused_without_launch(self) -> None:
        launched: list[list[str]] = []
        tabs = [{"type": "page", "id": "tab-1", "url": cdp_browser.COMPASS_PAGE_URL}]

        session = ensure_cdp_browser(
            get_json=lambda path: tabs,
            launcher=lambda command: launched.append(command),
        )

        self.assertEqual(session.tab_id, "tab-1")
        self.assertFalse(session.launched)
        self.assertEqual(launched, [])

    def test_multiple_tabs_without_selector_creates_target_tab(self) -> None:
        created: list[str] = []
        tabs = [
            {"type": "page", "id": "tab-1", "url": "https://example.com"},
            {"type": "page", "id": "tab-2", "url": "https://other.example.com"},
        ]

        session = ensure_cdp_browser(
            get_json=lambda path: tabs,
            create_tab=lambda url: created.append(url) or {"type": "page", "id": "tab-3", "url": url},
        )

        self.assertEqual(session.tab_id, "tab-3")
        self.assertEqual(created, [cdp_browser.COMPASS_PAGE_URL])

    def test_missing_cdp_auto_launches_local_chrome(self) -> None:
        state = {"launched": False}
        launched: list[list[str]] = []

        def get_json(path: str) -> list[dict[str, str]]:
            if not state["launched"]:
                raise CdpBrowserError("connection refused")
            return [{"type": "page", "id": "tab-launched", "url": cdp_browser.COMPASS_PAGE_URL}]

        def launch(command: list[str]) -> None:
            launched.append(command)
            state["launched"] = True

        session = ensure_cdp_browser(
            cdp_url="http://127.0.0.1:9222",
            chrome_path="/tmp/fake-chrome",
            profile_dir="/tmp/vipshop-profile",
            get_json=get_json,
            launcher=launch,
            sleep=lambda seconds: None,
        )

        self.assertTrue(session.launched)
        self.assertEqual(session.tab_id, "tab-launched")
        self.assertEqual(launched[0][0], "/tmp/fake-chrome")
        self.assertIn("--remote-debugging-port=9222", launched[0])
        self.assertIn("--user-data-dir=/tmp/vipshop-profile", launched[0])
        self.assertEqual(launched[0][-1], cdp_browser.COMPASS_PAGE_URL)

    def test_no_auto_cdp_reports_missing_endpoint(self) -> None:
        with self.assertRaises(CdpBrowserError) as captured:
            ensure_cdp_browser(
                auto_launch=False,
                get_json=lambda path: (_ for _ in ()).throw(CdpBrowserError("connection refused")),
            )

        self.assertIn("Cannot connect to Chrome CDP", str(captured.exception))

    def test_default_entry_url_follows_first_report_scope(self) -> None:
        self.assertEqual(cdp_browser.default_entry_url({"report_scope": ["vipdirect_ads"]}), cdp_browser.VIPDIRECT_PAGE_URL)
        self.assertEqual(cdp_browser.default_entry_url({"report_scope": ["bct_scene"]}), cdp_browser.BCT_PAGE_URL)


if __name__ == "__main__":
    unittest.main()

