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

## Safety Reference

Read `references/safety.md` before live collection. The collection path is read-only; it should not alter ads, gifts, coupons, goods, budgets, bids, campaign state, or activity configuration.
