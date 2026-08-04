#!/usr/bin/env python3
from __future__ import annotations

import re
import sys
from pathlib import Path


REQUIRED = [
    "pyproject.toml",
    "README.md",
    "assets/hot-strategy-tracking-report.js",
    "docs/爆款策略追踪agent-需求文档.docx",
    "docs/requirements-extracted.txt",
    "src/vipshop_hot_strategy_agent/cli.py",
    "src/vipshop_hot_strategy_agent/collect.py",
    "src/vipshop_hot_strategy_agent/analysis.py",
    "skills/vipshop-hot-strategy-agent/SKILL.md",
    "references/metrics-and-rules.md",
    "references/safety.md",
]


def validate(root: Path) -> list[str]:
    errors: list[str] = []
    for item in REQUIRED:
        if not (root / item).is_file():
            errors.append(f"missing {item}")
    skill = root / "skills/vipshop-hot-strategy-agent/SKILL.md"
    if skill.is_file():
        text = skill.read_text(encoding="utf-8")
        if not re.search(r"^---\n.*?^---", text, re.M | re.S):
            errors.append("skill front matter missing")
        for term in ["9222", "page-owned API", "read-only", "collect", "analyze", "strategy", "assistant reply"]:
            if term not in text:
                errors.append(f"skill missing term: {term}")
    asset = root / "assets/hot-strategy-tracking-report.js"
    if asset.is_file():
        text = asset.read_text(encoding="utf-8")
        for term in ["bct_gift_activity_start", "bct_gift_activity_end", "bct_scene_activity_start", "bct_scene_activity_end", "活动过滤"]:
            if term not in text:
                errors.append(f"asset missing term: {term}")
        for term in ["toolTaskMidSummary", "toolTaskMidDaily", "/bcc/vendorBrand/downCenter/add", "批量导出商品效果", "/bcc/file_common/fileSecurityDown"]:
            if term not in text:
                errors.append(f"asset missing BCT product export term: {term}")
        for term in ["/product/detail/asyncExportGoodsList", "/report/asyncdownload/queryTaskList", "/report/asyncdownload/getOutputFile", "compass_export_wait_seconds", "compass_table_fallback", "COMPASS_FULL_EXPORT_FIELDS", "compass_force_new_export", "后台下载导出", "执行成功"]:
            if term not in text:
                errors.append(f"asset missing Compass export term: {term}")
        if "/pc/mms/v1/item/export" in text:
            errors.append("asset still references stale Compass /pc/mms export endpoint")
        for term in ["/promotion/insite/search/advertisement", "/ad/list/v2", "/product/insight/ad/list", "vipdirect_detail_source", "vipdirect_mid", "kind === 'vipdirect' ? 100", "pauseCodes", "wakeupContent?.destId", "空 MID 返回 1001", "推广 > 站内广告 > 唯直达 > 广告"]:
            if term not in text:
                errors.append(f"asset missing VipDirect detail term: {term}")
        if "#/promotion/insite/search/adList" in text:
            errors.append("asset still references stale VipDirect adList route")
        for term in ["impressionUv", "pageMerDetailConvRate", "brandUserStrategyRoi", "wxkStrategyCostAmt", "impressionNum", "addUserNum", "addItemNum", "merchandiseLikeUserNum", "useUser"]:
            if term not in text:
                errors.append(f"asset missing live metric mapping: {term}")
    return errors


def main() -> int:
    root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()
    errors = validate(root)
    if errors:
        for error in errors:
            print(f"FAIL: {error}")
        return 1
    print(f"OK: {root}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
