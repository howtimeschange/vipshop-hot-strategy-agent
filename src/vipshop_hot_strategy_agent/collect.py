from __future__ import annotations

import asyncio
import importlib.util
import json
import sys
from collections import Counter
from dataclasses import replace
from pathlib import Path
from typing import Any, Callable

from .excel_export import export_workbook
from .paths import paths


DEFAULT_SCOPE = ["compass_sales_detail", "vipdirect_ads", "tmax_goods", "bct_gift", "bct_scene"]


def runtime_candidates() -> list[Path]:
    return [
        Path("/Users/xingyicheng/.codex/plugins/cache/personal/crawshrimp-skill/0.1.0+codex.20260622090512/skills/crawshrimp-skill/scripts"),
        Path("/Users/xingyicheng/Documents/crawshrimp/skills/crawshrimp-skill/scripts"),
        paths().root / "vendor" / "crawshrimp-skill" / "scripts",
    ]


def locate_runtime_scripts(runtime_root: str | Path | None = None) -> Path:
    candidates = [Path(runtime_root).expanduser()] if runtime_root else runtime_candidates()
    for candidate in candidates:
        if (candidate / "browser_executor.py").is_file() and (candidate / "phase_runner.py").is_file():
            return candidate
    searched = "\n".join(str(item) for item in candidates)
    raise FileNotFoundError(f"Cannot locate crawshrimp-skill scripts. Searched:\n{searched}")


def _load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Cannot load {name} from {path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


def load_runtime(runtime_root: str | Path | None = None):
    scripts = locate_runtime_scripts(runtime_root)
    if str(scripts) not in sys.path:
        sys.path.insert(0, str(scripts))
    browser_executor = _load_module("browser_executor", scripts / "browser_executor.py")
    phase_runner = _load_module("phase_runner", scripts / "phase_runner.py")
    return browser_executor, phase_runner


def build_params(args: Any) -> dict[str, Any]:
    params: dict[str, Any] = {
        "report_scope": list(DEFAULT_SCOPE),
        "page_size": args.page_size,
        "bct_page_size": args.bct_page_size,
        "max_pages": args.max_pages,
    }
    for key in [
        "brand_keyword",
        "compass_start_date",
        "compass_end_date",
        "vipdirect_start_date",
        "vipdirect_end_date",
        "tmax_start_date",
        "tmax_end_date",
        "bct_activity_start",
        "bct_activity_end",
        "bct_gift_activity_start",
        "bct_gift_activity_end",
        "bct_scene_activity_start",
        "bct_scene_activity_end",
    ]:
        value = getattr(args, key, None)
        if value:
            params[key] = value
    return params


async def collect_reports_async(
    *,
    cdp_url: str = "http://127.0.0.1:9222",
    tab_id: str = "",
    url_prefix: str = "",
    runtime_root: str | Path | None = None,
    params: dict[str, Any] | None = None,
    out_dir: str | Path = "~/Downloads",
    progress: Callable[[dict[str, Any]], None] | None = None,
) -> dict[str, Any]:
    browser_executor, phase_runner = load_runtime(runtime_root)

    class LongEvalBackend(browser_executor.ChromeCDPBackend):
        async def execute_async(self, action):
            if action.kind == "eval":
                action = replace(action, timeout_ms=300000)
            return await super().execute_async(action)

    script_path = paths().assets / "hot-strategy-tracking-report.js"
    script = script_path.read_text(encoding="utf-8")
    backend = LongEvalBackend(cdp_url=cdp_url, tab_id=tab_id, url_prefix=url_prefix)
    runner = phase_runner.WebPhaseRunner(backend=backend, artifact_dir=paths().root / "artifacts")

    async def hook(event: dict[str, Any]) -> None:
        if progress:
            progress(event)

    result = await runner.run_script(script, params=params or {}, control_hook=hook)
    rows = result.data
    if not rows:
        raise RuntimeError("collection returned no rows")
    workbook = export_workbook(rows, Path(out_dir).expanduser())
    counts = Counter(str(row.get("__sheet_name") or "Sheet1") for row in rows)
    return {
        "workbook": str(workbook),
        "rows": len(rows),
        "sheet_counts": dict(counts),
        "shared": result.shared,
    }


def collect_reports(**kwargs: Any) -> dict[str, Any]:
    return asyncio.run(collect_reports_async(**kwargs))


def print_json(payload: dict[str, Any]) -> None:
    print(json.dumps(payload, ensure_ascii=False, indent=2))
