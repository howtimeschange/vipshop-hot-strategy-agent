---
name: vipshop-hot-strategy-agent
description: Use when exporting Vipshop hot-strategy reports, analyzing the 5-report workbook, or producing data insights and strategy recommendations from Vipshop sales, ads, gift, and coupon reports through the local vipshop-hot-strategy CLI.
---

# Vipshop Hot Strategy Agent

Use this skill when the user asks for 唯品会爆款策略追踪、5 份报表导出、T-max 商品打爆、唯直达投放效果、中台礼金、购物车/跨品类券分析，或需要从这些报表生成数据、洞察和 strategy 建议。

## Operating Contract

- Work from the independent project root: `/Users/xingyicheng/Documents/vipshop-hot-strategy-agent`.
- Use the local CLI first: `vipshop-hot-strategy`.
- Browser collection is read-only and must use the user's existing `http://127.0.0.1:9222` Chrome/CDP session.
- Prefer the page-owned API path already encoded in `assets/hot-strategy-tracking-report.js`.
- When multiple Chrome tabs are open, pass `--tab-id` or `--url-prefix` so the CLI selects the intended tab explicitly.
- Do not extract cookies, tokens, localStorage, sessionStorage, QR codes, payment data, or personal sensitive data.
- Do not submit, save, publish, delete, change budgets, change bids, or modify marketing configuration unless the user gives explicit authorization for that exact side effect.

## Commands

Analyze an existing workbook:

```bash
cd /Users/xingyicheng/Documents/vipshop-hot-strategy-agent
python3 -m vipshop_hot_strategy_agent.cli analyze /Users/xingyicheng/Downloads/唯品会爆款策略追踪报表_20260803-171542.xlsx --out-dir /Users/xingyicheng/Downloads
```

Collect the 5 reports into Excel:

```bash
cd /Users/xingyicheng/Documents/vipshop-hot-strategy-agent
python3 -m vipshop_hot_strategy_agent.cli collect --cdp-url http://127.0.0.1:9222 --out-dir /Users/xingyicheng/Downloads
```

Collect and analyze in one pass:

```bash
cd /Users/xingyicheng/Documents/vipshop-hot-strategy-agent
python3 -m vipshop_hot_strategy_agent.cli run \
  --cdp-url http://127.0.0.1:9222 \
  --compass-start-date 2026-08-02 \
  --compass-end-date 2026-08-02 \
  --vipdirect-start-date 2026-08-02 \
  --vipdirect-end-date 2026-08-02 \
  --tmax-start-date 2026-08-02 \
  --tmax-end-date 2026-08-02 \
  --bct-gift-activity-start 2026-07-29 \
  --bct-gift-activity-end 2026-08-06 \
  --bct-scene-activity-start 2026-07-29 \
  --bct-scene-activity-end 2026-08-06 \
  --bct-product-export-type summary \
  --out-dir /Users/xingyicheng/Downloads
```

Write the requirement understanding:

```bash
cd /Users/xingyicheng/Documents/vipshop-hot-strategy-agent
python3 -m vipshop_hot_strategy_agent.cli doc-summary --out-dir /Users/xingyicheng/Downloads
```

## Output Expectations

For `collect`, report:

- workbook path
- total rows
- per-sheet row counts
- any permission or page-owned API failure

For `analyze` or `run`, report:

- `analysis_json`
- `strategy_markdown`
- major row counts
- high-signal strategy conclusions

Do not stop at file paths. In the assistant reply, also summarize the generated
report for the user in Chinese:

- collection date ranges and sheet row counts
- top 3-5 business conclusions
- recommended actions: 保留、放大、回滚、继续观察 or 补数据
- key confidence reasons and data gaps

## Analysis Rules

Read `references/metrics-and-rules.md` before making business claims. The minimum report must include:

- data coverage
- core process metrics
- auxiliary confidence checks
- terminal commercial metrics
- effect labels
- confidence reasons
- strategy recommendations

If action records, product basics, reference groups, touch/open/click/claim, gross margin, or aftersales data are missing, call that out as a data gap instead of overstating attribution.

When a report column or page-owned API field is absent, render it as `未返回` or `不可算` in the Markdown and assistant summary. Only render `0` when the source field was actually returned with an explicit zero value.

BCT 礼金、购物车/跨品类券采集应使用策略效果页右上角「批量导出商品效果」路径（下载中心配置 `toolTaskMidSummary` / `toolTaskMidDaily`），不要把 `/bcc/toolbox_task/list` 的活动效果列表当作商品明细。

魔方罗盘商品明细默认走页面同款后台下载导出任务（`/product/detail/asyncExportGoodsList` -> `/report/asyncdownload/queryTaskList` -> `/report/asyncdownload/getOutputFile`），避开页面表格接口 `10000` 条上限；默认 `filter` 按商品明细页「自定义指标」全选口径生成，最终 sheet 字段名和顺序应与页面指标一致。解析附件时只保留巴拉巴拉口径。后台导出失败时不要默认降级写入页面表格；只有排查接口时才使用 `--compass-table-api` 或显式 `--compass-table-fallback`，并在回复里说明这可能受 10000 条上限影响。若下载中心旧任务的 `filter` 不覆盖当前全选指标，应跳过旧任务或使用 `--compass-force-new-export` 强制新建。

唯直达默认使用 `推广 > 站内广告 > 唯直达 > 广告`（`#/promotion/insite/search/advertisement`）的广告商品明细口径，输出商品ID/MID、广告名称和广告指标；不要把旧 `ck/report/table` 汇总数据当作用户要的商品广告明细。商品洞察口径必须提供 `--vipdirect-mid`；不要用空 MID 降级到 `/product/insight/ad/list`，否则会用 `1001` 无效参数掩盖广告页商品明细接口问题。若临时使用 `--vipdirect-summary-api` 或商品洞察降级，应在回复里明确口径。

如果 BCT 或魔方下载中心任务已经返回下载链接，CLI 必须自动下载并解析该文件；不要把“请去下载中心手动下载”作为完成状态。

## Safety Reference

Read `references/safety.md` before live collection. The collection path is read-only; it should not alter ads, gifts, coupons, goods, budgets, bids, campaign state, or activity configuration.
