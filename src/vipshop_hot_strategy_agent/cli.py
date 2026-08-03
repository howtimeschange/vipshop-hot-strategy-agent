from __future__ import annotations

import argparse
import json
from pathlib import Path

from .analysis import analyze_workbook, write_analysis
from .collect import build_params, collect_reports
from .requirements_doc import extracted_text, source_docx, write_summary


def add_collect_args(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--cdp-url", default="http://127.0.0.1:9222")
    parser.add_argument("--tab-id", default="")
    parser.add_argument("--url-prefix", default="", help="Select the Chrome tab whose URL starts with this prefix.")
    parser.add_argument("--runtime-root", default="", help="Path to crawshrimp-skill/scripts.")
    parser.add_argument("--out-dir", default="~/Downloads")
    parser.add_argument("--brand-keyword", default="巴拉巴拉")
    parser.add_argument("--compass-start-date", default="")
    parser.add_argument("--compass-end-date", default="")
    parser.add_argument("--vipdirect-start-date", default="")
    parser.add_argument("--vipdirect-end-date", default="")
    parser.add_argument("--tmax-start-date", default="")
    parser.add_argument("--tmax-end-date", default="")
    parser.add_argument("--bct-activity-start", default="", help="Common BCT activity start fallback for gift and scene reports.")
    parser.add_argument("--bct-activity-end", default="", help="Common BCT activity end fallback for gift and scene reports.")
    parser.add_argument("--bct-gift-activity-start", default="", help="Activity start filter for 中台礼金.")
    parser.add_argument("--bct-gift-activity-end", default="", help="Activity end filter for 中台礼金.")
    parser.add_argument("--bct-scene-activity-start", default="", help="Activity start filter for 中台购物车/跨品类券.")
    parser.add_argument("--bct-scene-activity-end", default="", help="Activity end filter for 中台购物车/跨品类券.")
    parser.add_argument("--page-size", type=int, default=300)
    parser.add_argument("--bct-page-size", type=int, default=50)
    parser.add_argument("--max-pages", type=int, default=300)


def command_collect(args: argparse.Namespace) -> int:
    params = build_params(args)

    def progress(event: dict) -> None:
        if event.get("kind") == "before_phase":
            print(f"phase={event.get('phase')} records={event.get('records')}", flush=True)

    result = collect_reports(
        cdp_url=args.cdp_url,
        tab_id=args.tab_id,
        url_prefix=args.url_prefix,
        runtime_root=args.runtime_root or None,
        params=params,
        out_dir=args.out_dir,
        progress=progress,
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


def command_analyze(args: argparse.Namespace) -> int:
    result = analyze_workbook(args.workbook)
    outputs = write_analysis(result, args.out_dir)
    print(json.dumps({"workbook": str(args.workbook), **outputs}, ensure_ascii=False, indent=2))
    return 0


def command_run(args: argparse.Namespace) -> int:
    params = build_params(args)

    def progress(event: dict) -> None:
        if event.get("kind") == "before_phase":
            print(f"phase={event.get('phase')} records={event.get('records')}", flush=True)

    collection = collect_reports(
        cdp_url=args.cdp_url,
        tab_id=args.tab_id,
        url_prefix=args.url_prefix,
        runtime_root=args.runtime_root or None,
        params=params,
        out_dir=args.out_dir,
        progress=progress,
    )
    analysis = analyze_workbook(collection["workbook"])
    outputs = write_analysis(analysis, args.out_dir)
    print(json.dumps({"collection": collection, "analysis": outputs}, ensure_ascii=False, indent=2))
    return 0


def command_doc_summary(args: argparse.Namespace) -> int:
    target = write_summary(args.out_dir)
    payload = {
        "source_docx": str(source_docx()),
        "extracted_text": str(extracted_text()),
        "summary": str(target),
    }
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="vipshop-hot-strategy",
        description="Vipshop hot strategy report collector, insight analyzer, and strategy recommender.",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    collect = sub.add_parser("collect", help="Read-only collect 5 verified Vipshop reports into Excel.")
    add_collect_args(collect)
    collect.set_defaults(func=command_collect)

    analyze = sub.add_parser("analyze", help="Analyze an exported workbook and write JSON + Markdown strategy output.")
    analyze.add_argument("workbook", type=Path)
    analyze.add_argument("--out-dir", default="~/Downloads")
    analyze.set_defaults(func=command_analyze)

    run = sub.add_parser("run", help="Collect reports, then analyze the resulting workbook.")
    add_collect_args(run)
    run.set_defaults(func=command_run)

    doc_summary = sub.add_parser("doc-summary", help="Write a concise understanding of the bundled requirement doc.")
    doc_summary.add_argument("--out-dir", default="~/Downloads")
    doc_summary.set_defaults(func=command_doc_summary)

    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    return int(args.func(args) or 0)


if __name__ == "__main__":
    raise SystemExit(main())
