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
    parser.add_argument("--compass-brand-store-sn", default="", help="魔方罗盘 brandStoreSn；默认 all，并在导出解析时只保留品牌关键词。")
    parser.add_argument("--compass-table-api", action="store_true", help="魔方改用页面商品表格接口；该接口可能只返回前 10000 条。")
    parser.add_argument("--compass-table-fallback", action="store_true", help="魔方后台导出失败后允许降级页面表格接口；默认不降级，避免 10000 条上限误导。")
    parser.add_argument("--compass-export-required", action="store_true", help="魔方后台导出失败时直接失败，不降级到页面表格接口。")
    parser.add_argument("--compass-force-new-export", action="store_true", help="魔方强制新建后台导出任务，避免复用旧字段口径的下载中心文件。")
    parser.add_argument("--compass-export-wait-seconds", type=int, default=180, help="等待魔方后台导出生成的秒数；设为 0 只提交任务。")
    parser.add_argument("--compass-export-poll-seconds", type=int, default=5, help="轮询魔方后台导出任务的间隔秒数。")
    parser.add_argument("--compass-export-submit-url", default="", help="魔方后台导出提交接口覆盖，用于页面接口变更时调试。")
    parser.add_argument("--compass-export-task-list-url", default="", help="魔方后台导出任务列表接口覆盖，用于页面接口变更时调试。")
    parser.add_argument("--vipdirect-start-date", default="")
    parser.add_argument("--vipdirect-end-date", default="")
    parser.add_argument("--vipdirect-summary-api", action="store_true", help="唯直达改用旧的报表汇总接口；默认采集广告页商品 ID 明细。")
    parser.add_argument(
        "--vipdirect-detail-source",
        choices=["ad_list", "product_insight"],
        default="ad_list",
        help="唯直达明细来源：ad_list=广告页按广告展开商品，product_insight=商品洞察 MID x 广告明细。",
    )
    parser.add_argument("--vipdirect-mid", default="", help="商品洞察降级/调试使用的 MID；默认广告页商品明细不需要。")
    parser.add_argument("--vipdirect-no-product-insight-fallback", action="store_true", help="广告页接口失败时不降级商品洞察接口。")
    parser.add_argument("--tmax-start-date", default="")
    parser.add_argument("--tmax-end-date", default="")
    parser.add_argument("--bct-activity-start", default="", help="Common BCT activity start fallback for gift and scene reports.")
    parser.add_argument("--bct-activity-end", default="", help="Common BCT activity end fallback for gift and scene reports.")
    parser.add_argument("--bct-gift-activity-start", default="", help="Activity start filter for 中台礼金.")
    parser.add_argument("--bct-gift-activity-end", default="", help="Activity end filter for 中台礼金.")
    parser.add_argument("--bct-scene-activity-start", default="", help="Activity start filter for 中台购物车/跨品类券.")
    parser.add_argument("--bct-scene-activity-end", default="", help="Activity end filter for 中台购物车/跨品类券.")
    parser.add_argument(
        "--bct-product-export-type",
        choices=["summary", "daily"],
        default="summary",
        help="BCT 商品效果导出类型：summary=商品汇总效果数据，daily=商品每日新增效果数据明细。",
    )
    parser.add_argument("--bct-download-wait-seconds", type=int, default=120, help="Wait seconds for BCT download-center product export.")
    parser.add_argument("--bct-download-poll-seconds", type=int, default=5, help="Poll interval seconds for BCT download-center product export.")
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
