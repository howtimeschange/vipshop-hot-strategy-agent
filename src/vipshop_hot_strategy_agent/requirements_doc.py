from __future__ import annotations

from pathlib import Path

from .paths import paths


SUMMARY = """# 爆款策略追踪 Agent 需求理解

## 一句话目标

把爆款运营动作、商品销售、广告投放、礼金和购物车/跨品类券数据串起来，判断动作是否带来机制改善、商业增量和健康经营结果，并给出保留、放大、回滚、继续观察或补数据建议。

## 当前 CLI+skill 覆盖

- 只读导出 5 个已验证报表：魔方罗盘销售明细、唯直达投放效果、T-max 商品打爆效果、中台礼金、中台购物车/跨品类券。
- 标准化字段和 Excel sheet，保留页面 API 来源和执行摘要。
- 从工作簿生成数据概览、投放/权益效率、商品结构、辅助指标风险和策略建议。
- 输出 `analysis.json` 和 `strategy.md`，便于继续进入周报、复盘或业务评审。

## 需求文档中的完整业务闭环

1. 按任务编号聚合动作，识别优化日期、动作类型、调整范围和商品清单。
2. 按动作类型选择实验组粒度：款号、货号、商品 ID/MID 或活动 ID。
3. 生成参考组：同品类未优化款、同款未优化货号、未投放/低投放商品或自身前后对照。
4. 计算核心过程指标、辅助指标、终端指标、净效应、成本和 ROI。
5. 用曝光、点击绝对量、价格、库存、广告、权益、售后等辅助指标解释置信度。
6. 输出效果标签、置信度原因和运营建议。

## 当前数据缺口

- 动作记录、产品基础信息、实验组/参考组尚未纳入这个独立 CLI 的默认采集。
- 分日广告明细、触达人数、打开率、点击率、领取人数、毛利、售后质量仍需要后续数据源增强。
- 礼金和购物车挽回的活动周期解析已在需求中定义，但需要更完整的活动名称样本做稳定规则。
"""


def write_summary(out_dir: str | Path) -> Path:
    out_dir = Path(out_dir).expanduser()
    out_dir.mkdir(parents=True, exist_ok=True)
    target = out_dir / "requirements-understanding.md"
    target.write_text(SUMMARY, encoding="utf-8")
    return target


def source_docx() -> Path:
    return paths().docs / "爆款策略追踪agent-需求文档.docx"


def extracted_text() -> Path:
    return paths().docs / "requirements-extracted.txt"
