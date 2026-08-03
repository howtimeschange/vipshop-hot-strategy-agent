from __future__ import annotations

import json
import math
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from openpyxl import load_workbook


SHEETS = {
    "compass": "魔方罗盘销售明细",
    "vipdirect": "唯直达投放效果",
    "tmax": "T-max效果",
    "gift": "中台礼金",
    "scene": "中台购物车跨品类券",
}


def as_number(value: Any) -> float:
    if value is None:
        return 0.0
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        if math.isnan(float(value)):
            return 0.0
        return float(value)
    text = str(value).strip().replace(",", "")
    if not text or text in {"--", "-", "None", "null"}:
        return 0.0
    if text.endswith("%"):
        try:
            return float(text[:-1]) / 100
        except ValueError:
            return 0.0
    match = re.search(r"-?\d+(?:\.\d+)?", text)
    if not match:
        return 0.0
    return float(match.group(0))


def fmt_money(value: float) -> str:
    return f"{value:,.2f}"


def fmt_int(value: float) -> str:
    return f"{int(round(value)):,}"


def fmt_pct(value: float) -> str:
    return f"{value * 100:.2f}%"


def safe_ratio(numerator: float, denominator: float) -> float:
    return numerator / denominator if denominator else 0.0


def has_cell(value: Any) -> bool:
    if value is None:
        return False
    text = str(value).strip()
    return text not in {"", "--", "-", "None", "null"}


def first_cell(row: dict[str, Any], *keys: str) -> Any:
    for key in keys:
        value = row.get(key)
        if has_cell(value):
            return value
    return None


def sum_first(rows: list[dict[str, Any]], *keys: str) -> float:
    return sum(as_number(first_cell(row, *keys)) for row in rows)


def average_first(rows: list[dict[str, Any]], *keys: str) -> float:
    values = [as_number(value) for row in rows if (value := first_cell(row, *keys)) is not None]
    return safe_ratio(sum(values), len(values))


def has_any(rows: list[dict[str, Any]], *keys: str) -> bool:
    return any(first_cell(row, *keys) is not None for row in rows)


def as_rate(value: Any) -> float:
    number = as_number(value)
    if not has_cell(value):
        return 0.0
    text = str(value).strip()
    if text.endswith("%"):
        return number
    return number / 100 if number > 1 else number


def average_rate_first(rows: list[dict[str, Any]], *keys: str) -> float:
    values = [as_rate(value) for row in rows if (value := first_cell(row, *keys)) is not None]
    return safe_ratio(sum(values), len(values))


def fmt_metric(item: dict[str, Any], key: str, formatter, missing: str = "未返回") -> str:
    if item.get(f"{key}_returned") is False:
        return missing
    return formatter(float(item.get(key, 0) or 0))


def fmt_int_metric(item: dict[str, Any], key: str, missing: str = "未返回") -> str:
    return fmt_metric(item, key, fmt_int, missing)


def fmt_money_metric(item: dict[str, Any], key: str, missing: str = "未返回") -> str:
    return fmt_metric(item, key, fmt_money, missing)


def fmt_pct_metric(item: dict[str, Any], key: str, missing: str = "不可算") -> str:
    return fmt_metric(item, key, fmt_pct, missing)


def fmt_roi_metric(item: dict[str, Any], missing: str = "不可算") -> str:
    if item.get("roi_returned") is False:
        return missing
    return f"{float(item.get('roi', 0) or 0):.2f}"


def text_bounds(rows: list[dict[str, Any]], *keys: str) -> tuple[str, str]:
    values = sorted({str(value).strip() for row in rows if (value := first_cell(row, *keys)) is not None})
    if not values:
        return "", ""
    return values[0], values[-1]


def read_sheet(workbook: Path | str, sheet_name: str) -> list[dict[str, Any]]:
    wb = load_workbook(Path(workbook), read_only=True, data_only=True)
    if sheet_name not in wb.sheetnames:
        return []
    ws = wb[sheet_name]
    rows = list(ws.iter_rows(values_only=True))
    if not rows:
        return []
    headers = [str(cell or "").strip() for cell in rows[0]]
    data: list[dict[str, Any]] = []
    for raw in rows[1:]:
        row = {headers[index]: raw[index] if index < len(raw) else "" for index in range(len(headers)) if headers[index]}
        if any(value not in (None, "") for value in row.values()):
            data.append(row)
    return data


def read_workbook(workbook: Path | str) -> dict[str, list[dict[str, Any]]]:
    wb = load_workbook(Path(workbook), read_only=True, data_only=True)
    return {sheet: read_sheet(workbook, sheet) for sheet in wb.sheetnames}


def top_by(rows: list[dict[str, Any]], key: str, value_key: str, limit: int = 8) -> list[dict[str, Any]]:
    totals: dict[str, float] = defaultdict(float)
    for row in rows:
        label = str(row.get(key) or "未填").strip() or "未填"
        totals[label] += as_number(row.get(value_key))
    return [
        {"name": name, "value": value}
        for name, value in sorted(totals.items(), key=lambda item: item[1], reverse=True)[:limit]
    ]


def summarize_compass(rows: list[dict[str, Any]]) -> dict[str, Any]:
    sales_returned = has_any(rows, "销售额")
    customers_returned = has_any(rows, "客户数")
    detail_uv_returned = has_any(rows, "商详UV")
    exposures_returned = has_any(rows, "曝光人数")
    impression_count_returned = has_any(rows, "曝光次数")
    clicks_returned = has_any(rows, "点击人数")
    reported_click_rate_returned = has_any(rows, "商品点击率")
    addcarts_returned = has_any(rows, "加购数")
    orders_returned = has_any(rows, "下单客户数")
    sales = sum(as_number(row.get("销售额")) for row in rows)
    quantity = sum(as_number(row.get("销售数量")) for row in rows)
    customers = sum(as_number(row.get("客户数")) for row in rows)
    detail_uv = sum(as_number(row.get("商详UV")) for row in rows)
    exposures = sum(as_number(row.get("曝光人数")) for row in rows)
    impression_count = sum(as_number(row.get("曝光次数")) for row in rows)
    clicks = sum(as_number(row.get("点击人数")) for row in rows)
    addcarts = sum(as_number(row.get("加购数")) for row in rows)
    orders = sum(as_number(row.get("下单客户数")) for row in rows)
    reported_click_rate = average_rate_first(rows, "商品点击率")
    if exposures_returned and exposures > 0 and clicks_returned:
        click_rate = safe_ratio(clicks, exposures)
        click_rate_returned = True
    elif reported_click_rate_returned:
        click_rate = reported_click_rate
        click_rate_returned = True
    else:
        click_rate = 0.0
        click_rate_returned = False
    conversion_rate_returned = customers_returned and detail_uv_returned and detail_uv > 0
    addcart_rate_returned = addcarts_returned and detail_uv_returned and detail_uv > 0
    order_customer_rate_returned = orders_returned and detail_uv_returned and detail_uv > 0
    stock_risk = [
        row for row in rows
        if as_number(row.get("在售库存")) > 0 and as_number(row.get("库存天数")) > 0 and as_number(row.get("库存天数")) < 7
    ]
    price_values = [
        as_number(first_cell(row, "到手价", "唯品价", "市场价"))
        for row in rows
        if first_cell(row, "到手价", "唯品价", "市场价") is not None
    ]
    stock_days = [as_number(row.get("库存天数")) for row in rows if has_cell(row.get("库存天数"))]
    return {
        "rows": len(rows),
        "sales": sales,
        "sales_returned": sales_returned,
        "quantity": quantity,
        "customers": customers,
        "customers_returned": customers_returned,
        "detail_uv": detail_uv,
        "detail_uv_returned": detail_uv_returned,
        "exposures": exposures,
        "exposures_returned": exposures_returned,
        "impression_count": impression_count,
        "impression_count_returned": impression_count_returned,
        "clicks": clicks,
        "clicks_returned": clicks_returned,
        "reported_click_rate": reported_click_rate,
        "reported_click_rate_returned": reported_click_rate_returned,
        "click_rate": click_rate,
        "click_rate_returned": click_rate_returned,
        "conversion_rate": safe_ratio(customers, detail_uv) if conversion_rate_returned else 0.0,
        "conversion_rate_returned": conversion_rate_returned,
        "addcarts": addcarts,
        "addcarts_returned": addcarts_returned,
        "addcart_rate": safe_ratio(addcarts, detail_uv) if addcart_rate_returned else 0.0,
        "addcart_rate_returned": addcart_rate_returned,
        "orders": orders,
        "orders_returned": orders_returned,
        "order_customer_rate": safe_ratio(orders, detail_uv) if order_customer_rate_returned else 0.0,
        "order_customer_rate_returned": order_customer_rate_returned,
        "distinct_styles": len({row.get("款号") for row in rows if row.get("款号")}),
        "distinct_goods": len({row.get("货号") for row in rows if row.get("货号")}),
        "distinct_products": len({row.get("商品ID") for row in rows if row.get("商品ID")}),
        "top_categories": top_by(rows, "三级品类", "销售额", 8),
        "top_styles": top_by(rows, "款号", "销售额", 8),
        "stock_risk_count": len(stock_risk),
        "avg_price": safe_ratio(sum(price_values), len(price_values)),
        "avg_stock_days": safe_ratio(sum(stock_days), len(stock_days)),
    }


def summarize_ads(rows: list[dict[str, Any]], source: str) -> dict[str, Any]:
    cost = sum_first(rows, "花费", "活动成本")
    impressions = sum_first(rows, "曝光量", "曝光人数")
    clicks = sum_first(rows, "点击量", "点击人数")
    sales = sum_first(rows, "24小时销售额(商家)", "24小时销售额(商品)", "销售额")
    book_sales = sum_first(rows, "24小时订单额(商家)", "24小时订单额(商品)", "订单额", "销售额")
    addcarts = sum_first(rows, "24小时加购数(商家)", "24小时加购数(商品)", "加购数")
    likes = sum_first(rows, "24小时收藏数(商家)", "24小时收藏数(商品)", "收藏数")
    dates = sorted({str(row.get("统计日期") or "").strip() for row in rows if row.get("统计日期")})
    reported_roi = average_first(rows, "24小时成交ROI(商家)", "24小时成交ROI(商品)", "24小时下单ROI(商家)", "ROI")
    computed_roi = safe_ratio(sales or book_sales, cost)
    return {
        "source": source,
        "rows": len(rows),
        "cost": cost,
        "impressions": impressions,
        "clicks": clicks,
        "ctr": safe_ratio(clicks, impressions),
        "cpc": safe_ratio(cost, clicks),
        "book_sales": book_sales,
        "sales": sales or book_sales,
        "roi": computed_roi or reported_roi,
        "reported_roi": reported_roi,
        "addcarts": addcarts,
        "likes": likes,
        "date_start": dates[0] if dates else "",
        "date_end": dates[-1] if dates else "",
    }


def summarize_bct(rows: list[dict[str, Any]], source: str) -> dict[str, Any]:
    sales_returned = has_any(rows, "使用销售额", "用券销售额", "销售额")
    cost_returned = has_any(rows, "活动成本")
    orders_returned = has_any(rows, "使用订单数", "用券订单数", "订单数")
    used_people_returned = has_any(rows, "已使用人数", "使用人数", "客户数")
    touch_users_returned = has_any(rows, "触达用户数")
    exposures_returned = has_any(rows, "曝光人数")
    visitors_returned = has_any(rows, "访问人数")
    usage_quantity_returned = has_any(rows, "使用量", "用券量", "用券销售量")
    reported_roi_returned = has_any(rows, "ROI")
    sales = sum_first(rows, "使用销售额", "用券销售额", "销售额")
    cost = sum_first(rows, "活动成本")
    orders = sum_first(rows, "使用订单数", "用券订单数", "订单数")
    customers = sum_first(rows, "已使用人数", "使用人数", "客户数")
    touch_users = sum_first(rows, "触达用户数")
    exposures = sum_first(rows, "曝光人数")
    visitors = sum_first(rows, "访问人数")
    usage_quantity = sum_first(rows, "使用量", "用券量", "用券销售量")
    status_counts = Counter(str(row.get("活动状态") or "未填") for row in rows)
    mode_totals = top_by(rows, "运营方式", "销售额", 8)
    reported_roi = average_first(rows, "ROI")
    computed_roi_returned = sales_returned and cost_returned and cost > 0
    computed_roi = safe_ratio(sales, cost) if computed_roi_returned else 0.0
    roi_returned = computed_roi_returned or reported_roi_returned
    roi = computed_roi if computed_roi_returned else (reported_roi if reported_roi_returned else 0.0)
    date_start, _ = text_bounds(rows, "计划开始", "活动开始", "开始时间")
    _, date_end = text_bounds(rows, "计划结束", "活动结束", "结束时间")
    fallback_start, _ = text_bounds(rows, "创建时间")
    _, fallback_end = text_bounds(rows, "下线时间")
    missing_period_count = sum(
        1
        for row in rows
        if first_cell(row, "计划开始", "活动开始", "开始时间") is None
        or first_cell(row, "计划结束", "活动结束", "结束时间") is None
    )
    return {
        "source": source,
        "rows": len(rows),
        "sales": sales,
        "sales_returned": sales_returned,
        "cost": cost,
        "cost_returned": cost_returned,
        "orders": orders,
        "orders_returned": orders_returned,
        "customers": customers,
        "used_people": customers,
        "used_people_returned": used_people_returned,
        "touch_users": touch_users,
        "touch_users_returned": touch_users_returned,
        "exposures": exposures,
        "exposures_returned": exposures_returned,
        "visitors": visitors,
        "visitors_returned": visitors_returned,
        "usage_quantity": usage_quantity,
        "usage_quantity_returned": usage_quantity_returned,
        "roi": roi,
        "roi_returned": roi_returned,
        "reported_roi": reported_roi,
        "reported_roi_returned": reported_roi_returned,
        "computed_roi_returned": computed_roi_returned,
        "date_start": date_start or fallback_start,
        "date_end": date_end or fallback_end,
        "missing_period_count": missing_period_count,
        "status_counts": dict(status_counts),
        "top_modes": mode_totals,
    }


def effectiveness_label(
    roi: float,
    volume: float = 0,
    cost: float = 0,
    *,
    cost_returned: bool = True,
    roi_returned: bool = True,
) -> tuple[str, str]:
    if volume > 0 and not cost_returned:
        return "成交可见，成本未返回", "低"
    if volume > 0 and cost <= 0 and not roi_returned:
        return "成交可见，成本为0待核对", "低"
    if volume > 0 and cost <= 0:
        return "成交可见，成本待补", "低"
    if cost > 0 and volume <= 0:
        return "有成本无成交产出", "中"
    if volume <= 0 and roi <= 0:
        return "暂无法判断", "低"
    if roi >= 8:
        return "商业效率健康", "高"
    if roi >= 3:
        return "可继续观察/局部放大", "中"
    if roi > 0:
        return "效率偏弱", "中"
    return "无正向商业结果", "低"


def compass_label(compass: dict[str, Any]) -> tuple[str, str, str]:
    if compass["rows"] <= 0:
        return "暂无法判断", "低", "魔方罗盘无销售明细行，无法建立商品过程和终端指标基线。"
    missing = []
    if not compass.get("exposures_returned"):
        missing.append("曝光人数")
    if not compass.get("clicks_returned"):
        missing.append("点击人数")
    if not compass.get("addcarts_returned"):
        missing.append("加购数")
    reason = (
        f"已覆盖曝光、点击、商详 UV、转化、销售和库存；当前未接入动作编号、优化前后窗口和参考组，"
        f"只能作为主图/详情页/颜色词等动作的过程基线。"
    )
    if missing:
        reason += f" 当前仍缺 {', '.join(missing)} 等过程口径，相关比率需降级。"
    confidence = "中" if compass.get("exposures_returned") and compass["exposures"] and compass["detail_uv"] and compass["sales"] else "低"
    return "商品过程基线可用，单动作待归因", confidence, reason


def confidence_reason(item: dict[str, Any], kind: str) -> str:
    if item["rows"] <= 0:
        return f"{item['source']}无有效明细行，需先补齐报表后再判断。"

    reasons: list[str] = []
    sales = item.get("sales", 0) or item.get("book_sales", 0) or 0
    cost = item.get("cost", 0) or 0
    roi = item.get("roi", 0) or 0
    cost_returned = item.get("cost_returned", True)
    roi_returned = item.get("roi_returned", True)
    if cost and sales and roi_returned:
        reasons.append(f"可按成本 {fmt_money(cost)} 与成交/销售 {fmt_money(sales)} 计算 ROI {roi:.2f}")
    elif cost and not sales:
        reasons.append(f"有成本 {fmt_money(cost)} 但成交/销售缺失")
    elif sales and not cost_returned:
        reasons.append(f"有成交/销售 {fmt_money(sales)}，但当前接口未返回活动成本和可计算 ROI")
    elif sales and not roi_returned:
        reasons.append(f"有成交/销售 {fmt_money(sales)}，但活动成本为 0 或缺失，ROI 不可算")
    elif sales and not cost:
        reasons.append(f"有成交/销售 {fmt_money(sales)}，但成本口径缺失")
    else:
        reasons.append("成交/成本口径不足")

    if kind == "ad":
        if item.get("impressions") and item.get("clicks"):
            reasons.append(f"曝光 {fmt_int(item['impressions'])}、点击 {fmt_int(item['clicks'])} 可校验 CTR/CPC")
        else:
            reasons.append("曝光或点击绝对量不足，无法完整校验流量质量")
        if not item.get("date_start"):
            reasons.append("缺少日期或分日明细，无法做投放前后趋势")
    elif kind == "benefit":
        if item.get("touch_users_returned") is False:
            reasons.append("当前接口未返回触达用户数、打开、点击或领取链路，权益归因需要降级")
        elif item.get("touch_users"):
            reasons.append(f"触达用户数 {fmt_int(item['touch_users'])} 可作为权益触达辅助校验")
        else:
            reasons.append("触达用户数字段返回 0，需核对是否真实未触达或统计延迟")
        if item.get("used_people_returned") is False:
            reasons.append("当前接口未返回已使用人数")
        elif not item.get("used_people"):
            reasons.append("已使用人数字段返回 0")
        if item.get("usage_quantity_returned") is False:
            reasons.append("当前接口未返回使用量/用券量")
        if item.get("missing_period_count"):
            reasons.append(f"{fmt_int(item['missing_period_count'])} 行缺活动开始或结束时间，周期复盘需补充")
        reasons.append("毛利和售后质量未接入，不能完整判断利润健康")

    return "；".join(reasons) + "。"


def build_coverage_gaps(metrics: dict[str, Any]) -> list[str]:
    gaps = [
        "动作记录、任务编号、负责人、调整范围和商品清单未进入当前工作簿，报告按五报表维度输出，不能自动生成单任务实验组/参考组净效应。",
        "产品基础信息、同品类参考组和同款未优化货号未接入，主图、详情页、颜色词、搭配购动作只能给过程基线和补数建议。",
        "分日广告、触达、打开、点击、领取、毛利和售后质量未完整接入，投放/权益结论按当前成本与成交口径保守判断。",
    ]
    compass = metrics["compass"]
    if compass["rows"] > 0:
        missing = []
        if not compass.get("exposures_returned"):
            missing.append("曝光人数")
        if not compass.get("clicks_returned"):
            missing.append("点击人数")
        if not compass.get("addcarts_returned"):
            missing.append("加购数")
        if missing:
            missing_text = "、".join(missing)
            gaps.append(f"魔方罗盘当前明细未返回{missing_text}；相关点击率/加购率按不可算或降级处理，不把空口径当业务 0。")
    if metrics["vipdirect"]["rows"] <= 0:
        gaps.append("唯直达当前无商品/广告明细行，仅能提示补充登录后导出或页面 API 权限。")
    if metrics["tmax"]["rows"] <= 0:
        gaps.append("T-max 当前无商品粒度明细行，无法校验商品打爆花费、曝光、点击、加购和 ROI。")
    for key, name in [("bct_gift", "中台礼金"), ("bct_scene", "中台购物车/跨品类券")]:
        item = metrics[key]
        if item["rows"] <= 0:
            continue
        missing = []
        if not item.get("touch_users_returned"):
            missing.append("触达用户数")
        if not item.get("usage_quantity_returned"):
            missing.append("使用量/用券量")
        if not item.get("orders_returned"):
            missing.append("订单数")
        if not item.get("cost_returned"):
            missing.append("活动成本")
        if not item.get("roi_returned"):
            missing.append("ROI")
        if missing:
            missing_text = "、".join(missing)
            gaps.append(f"{name}当前列表接口未返回{missing_text}；报告按“未返回/不可算”展示，避免把空口径误判为业务 0。")
    return gaps


@dataclass
class AnalysisResult:
    workbook: str
    metrics: dict[str, Any]
    insights: list[str]
    recommendations: list[str]
    markdown: str

    def to_json(self) -> dict[str, Any]:
        return {
            "workbook": self.workbook,
            "metrics": self.metrics,
            "insights": self.insights,
            "recommendations": self.recommendations,
        }


def analyze_workbook(workbook: Path | str) -> AnalysisResult:
    workbook = Path(workbook)
    sheets = read_workbook(workbook)
    compass = summarize_compass(sheets.get(SHEETS["compass"], []))
    vipdirect = summarize_ads(sheets.get(SHEETS["vipdirect"], []), "唯直达")
    tmax = summarize_ads(sheets.get(SHEETS["tmax"], []), "T-max")
    gift = summarize_bct(sheets.get(SHEETS["gift"], []), "中台礼金")
    scene = summarize_bct(sheets.get(SHEETS["scene"], []), "中台购物车跨品类券")

    label_compass, confidence_compass, reason_compass = compass_label(compass)
    label_vip, confidence_vip = effectiveness_label(vipdirect["roi"], vipdirect["sales"], vipdirect["cost"])
    label_tmax, confidence_tmax = effectiveness_label(tmax["roi"], tmax["sales"], tmax["cost"])
    label_gift, confidence_gift = effectiveness_label(
        gift["roi"],
        gift["sales"],
        gift["cost"],
        cost_returned=gift["cost_returned"],
        roi_returned=gift["roi_returned"],
    )
    label_scene, confidence_scene = effectiveness_label(
        scene["roi"],
        scene["sales"],
        scene["cost"],
        cost_returned=scene["cost_returned"],
        roi_returned=scene["roi_returned"],
    )

    metrics = {
        "sheet_rows": {name: len(rows) for name, rows in sheets.items()},
        "compass": compass | {
            "source": "魔方罗盘销售明细",
            "effect_label": label_compass,
            "confidence": confidence_compass,
            "confidence_reason": reason_compass,
        },
        "vipdirect": vipdirect | {
            "effect_label": label_vip,
            "confidence": confidence_vip,
            "confidence_reason": confidence_reason(vipdirect, "ad"),
        },
        "tmax": tmax | {
            "effect_label": label_tmax,
            "confidence": confidence_tmax,
            "confidence_reason": confidence_reason(tmax, "ad"),
        },
        "bct_gift": gift | {
            "effect_label": label_gift,
            "confidence": confidence_gift,
            "confidence_reason": confidence_reason(gift, "benefit"),
        },
        "bct_scene": scene | {
            "effect_label": label_scene,
            "confidence": confidence_scene,
            "confidence_reason": confidence_reason(scene, "benefit"),
        },
    }
    metrics["coverage_gaps"] = build_coverage_gaps(metrics)

    insights = build_insights(metrics)
    recommendations = build_recommendations(metrics)
    markdown = render_markdown(workbook, metrics, insights, recommendations)
    return AnalysisResult(str(workbook), metrics, insights, recommendations, markdown)


def build_insights(metrics: dict[str, Any]) -> list[str]:
    compass = metrics["compass"]
    vipdirect = metrics["vipdirect"]
    tmax = metrics["tmax"]
    gift = metrics["bct_gift"]
    scene = metrics["bct_scene"]
    insights = [
        f"销售明细覆盖 {fmt_int(compass['rows'])} 行，涉及 {fmt_int(compass['distinct_styles'])} 个款号、{fmt_int(compass['distinct_goods'])} 个货号，销售额 {fmt_money(compass['sales'])}。",
        f"罗盘口径点击率 {fmt_pct_metric(compass, 'click_rate')}、商详转化率 {fmt_pct_metric(compass, 'conversion_rate')}，可作为主图/详情页/颜色词动作的过程指标基线。",
        f"唯直达覆盖 {fmt_int(vipdirect['rows'])} 行，花费 {fmt_money(vipdirect['cost'])}、24小时销售额 {fmt_money(vipdirect['sales'])}、24小时订单额 {fmt_money(vipdirect['book_sales'])}、ROI {vipdirect['roi']:.2f}，标签：{vipdirect['effect_label']}。",
        f"T-max 覆盖 {fmt_int(tmax['rows'])} 行，花费 {fmt_money(tmax['cost'])}、加购 {fmt_int(tmax['addcarts'])}、销售额 {fmt_money(tmax['sales'])}、ROI {tmax['roi']:.2f}，标签：{tmax['effect_label']}。",
        f"中台礼金覆盖 {fmt_int(gift['rows'])} 行，销售额 {fmt_money_metric(gift, 'sales')}、活动成本 {fmt_money_metric(gift, 'cost')}、ROI {fmt_roi_metric(gift)}，标签：{gift['effect_label']}。",
        f"购物车/跨品类券覆盖 {fmt_int(scene['rows'])} 行，销售额 {fmt_money_metric(scene, 'sales')}、活动成本 {fmt_money_metric(scene, 'cost')}、ROI {fmt_roi_metric(scene)}，标签：{scene['effect_label']}。",
    ]
    if compass["stock_risk_count"]:
        insights.append(f"罗盘中有 {fmt_int(compass['stock_risk_count'])} 行库存天数低于 7 天，放大动作前需要先排除断货导致的转化和销售失真。")
    if vipdirect["ctr"] and vipdirect["ctr"] < 0.01:
        insights.append("唯直达 CTR 低于 1%，当前更像曝光铺量，需要优先优化关键词/广告创意或收窄流量。")
    if tmax["roi"] < vipdirect["roi"] and vipdirect["roi"] > 0:
        insights.append("T-max ROI 低于唯直达，预算放大时应先看商品粒度加购成本和库存承接，避免单纯追求曝光。")
    return insights


def build_recommendations(metrics: dict[str, Any]) -> list[str]:
    vipdirect = metrics["vipdirect"]
    tmax = metrics["tmax"]
    gift = metrics["bct_gift"]
    scene = metrics["bct_scene"]
    compass = metrics["compass"]
    recs = []
    if vipdirect["roi"] >= 8:
        recs.append("唯直达：保留当前 VSM/RTB 投放，优先把预算放到 ROI 高且商品库存稳定的日期/商品组合；同步沉淀关键词和广告名称，作为后续搜索流量模板。")
    elif vipdirect["roi"] > 0:
        recs.append("唯直达：暂不大幅放量，先按关键词/广告层级拆分 CTR、点击均价和 24 小时订单额，剔除低效流量后再追加预算。")
    else:
        recs.append("唯直达：当前数据不足以判断有效，先补广告/关键词粒度数据，再进入放量决策。")

    if tmax["roi"] >= 8:
        recs.append("T-max：保留商品打爆池，优先放大 ROI 高且加购成本低的商品；对低 ROI 商品设置预算上限或降出价。")
    elif tmax["roi"] > 0:
        recs.append("T-max：以商品为单位做分层，ROI 健康商品继续投，ROI 低且点击高的商品回查主图、价格和库存承接。")
    elif tmax["cost"] > 0 and tmax["sales"] <= 0:
        recs.append("T-max：当前有花费和加购但无成交销售，先回查商品粒度成交窗口、落地页承接和库存价格；在成交口径补齐前不建议继续放大商品打爆预算。")
    else:
        recs.append("T-max：先停留在观察态，避免把销售波动直接归因于广告。")

    if gift["roi"] >= 8:
        recs.append("礼金：保留高 ROI 礼金玩法，优先复用到同品类、同生命周期人群；继续监控是否替代自然成交。")
    elif gift["sales"] > 0 and not gift.get("cost_returned"):
        recs.append("礼金：已有用后销售额，但当前接口未返回活动成本和可计算 ROI；先补触达、领取、成本、毛利，再判断是否健康放大。")
    elif gift["sales"] > 0 and gift["cost"] <= 0:
        recs.append("礼金：已有用后销售额，但活动成本为 0 或 ROI 口径待核对；先确认成本口径，再判断是否健康放大。")
    else:
        recs.append("礼金：需要补触达/领取/毛利数据，当前只能判断用后成交效率，不能完整判断利润健康。")

    if scene["roi"] >= 8:
        recs.append("购物车/跨品类券：可继续保留，对高销售额活动做活动名称周期解析，形成可复盘活动库。")
    elif scene["sales"] > 0 and not scene.get("cost_returned"):
        recs.append("购物车/跨品类券：已有用券相关销售额，但当前接口未返回活动成本和 ROI；先识别自然成交替代、补成本口径和活动周期，再决定券力度是否放大。")
    elif scene["sales"] > 0 and scene["cost"] <= 0:
        recs.append("购物车/跨品类券：已有用券相关销售额，但活动成本为 0 或 ROI 口径待核对；先确认成本口径，再决定券力度是否放大。")
    else:
        recs.append("购物车/跨品类券：谨慎放大，重点识别用券销售是否来自自然成交替代。")

    if compass["stock_risk_count"]:
        recs.append("商品承接：库存天数不足的款先补货或降低推广强度，否则广告/权益动作的效果判断会被断货干扰。")
    recs.append("复盘机制：下一版接入动作记录、产品基础信息和活动周期解析后，按任务编号输出实验组、参考组、净效应、置信度和保留/放大/回滚建议。")
    return recs


def render_markdown(workbook: Path, metrics: dict[str, Any], insights: list[str], recommendations: list[str]) -> str:
    compass = metrics["compass"]
    vipdirect = metrics["vipdirect"]
    tmax = metrics["tmax"]
    gift = metrics["bct_gift"]
    scene = metrics["bct_scene"]
    top_categories = metrics["compass"]["top_categories"][:5]
    top_styles = metrics["compass"]["top_styles"][:5]

    def period_text(item: dict[str, Any]) -> str:
        start = item.get("date_start") or ""
        end = item.get("date_end") or ""
        if start and end:
            return f"{start} 至 {end}"
        if start or end:
            return str(start or end)
        return "未解析"

    def ad_line(item: dict[str, Any]) -> str:
        return (
            f"- {item['source']}: 花费 {fmt_money(item['cost'])}，曝光 {fmt_int(item['impressions'])}，"
            f"点击 {fmt_int(item['clicks'])}，CTR {fmt_pct(item['ctr'])}，CPC {fmt_money(item['cpc'])}，"
            f"收藏 {fmt_int(item['likes'])}，加购 {fmt_int(item['addcarts'])}，"
            f"24小时成交/销售 {fmt_money(item['sales'])}，ROI {item['roi']:.2f}。"
        )

    def benefit_line(item: dict[str, Any]) -> str:
        return (
            f"- {item['source']}: 活动周期 {period_text(item)}，触达 {fmt_int_metric(item, 'touch_users')}，"
            f"使用人数 {fmt_int_metric(item, 'used_people')}，使用量/用券量 {fmt_int_metric(item, 'usage_quantity')}，"
            f"订单 {fmt_int_metric(item, 'orders')}，使用销售额 {fmt_money_metric(item, 'sales')}，"
            f"活动成本 {fmt_money_metric(item, 'cost')}，ROI {fmt_roi_metric(item)}。"
        )

    total_rows = sum(metrics["sheet_rows"].values())
    lines = [
        "# 爆款策略追踪数据洞察与策略建议",
        "",
        f"工作簿：`{workbook}`",
        "",
        "## 数据覆盖",
        "",
    ]
    for sheet, count in metrics["sheet_rows"].items():
        lines.append(f"- {sheet}: {fmt_int(count)} 行")
    lines.extend([
        "",
        "## 结论摘要",
        "",
        f"- 当前工作簿覆盖 {fmt_int(total_rows)} 行。商品侧标签为「{compass['effect_label']}」，置信度 {compass['confidence']}；投放和权益按 ROI、成本、成交量做保守判断。",
        f"- 投放侧：唯直达「{vipdirect['effect_label']}」；T-max「{tmax['effect_label']}」。权益侧：礼金「{gift['effect_label']}」；购物车/跨品类券「{scene['effect_label']}」。",
        "- 当前版本不把报表周期内的销售波动直接归因到单个运营动作；动作记录、实验组、参考组和活动周期完整后，才能输出完全有效/回滚等单任务结论。",
        "",
        "## 动作信息与覆盖边界",
        "",
        "- 已覆盖：魔方罗盘销售明细、唯直达投放效果、T-max 商品打爆效果、中台礼金、中台购物车/跨品类券。",
        "- 未覆盖：任务编号、优化日期、动作类型、调整范围、负责人和商品清单。报告会保留数据缺口，不生成虚假的单动作归因。",
        "- 周期口径：商品销售按工作簿统计日期聚合；唯直达和 T-max 优先读取统计日期；礼金和购物车/跨品类券优先读取计划开始/结束，缺失时提示补充。",
        "",
        "## 核心指标对比",
        "",
        f"- 商品过程指标：曝光 {fmt_int_metric(compass, 'exposures')}，点击 {fmt_int_metric(compass, 'clicks')}，商品点击率 {fmt_pct_metric(compass, 'click_rate')}，商详 UV {fmt_int_metric(compass, 'detail_uv')}，购买转化率 {fmt_pct_metric(compass, 'conversion_rate')}，加购率 {fmt_pct_metric(compass, 'addcart_rate')}。",
        f"- 投放过程指标：唯直达曝光 {fmt_int(vipdirect['impressions'])}、点击 {fmt_int(vipdirect['clicks'])}、CTR {fmt_pct(vipdirect['ctr'])}、CPC {fmt_money(vipdirect['cpc'])}；T-max曝光 {fmt_int(tmax['impressions'])}、点击 {fmt_int(tmax['clicks'])}、CTR {fmt_pct(tmax['ctr'])}、CPC {fmt_money(tmax['cpc'])}。",
        f"- 权益过程指标：礼金触达 {fmt_int_metric(gift, 'touch_users')}、使用人数 {fmt_int_metric(gift, 'used_people')}、使用量 {fmt_int_metric(gift, 'usage_quantity')}；购物车/跨品类券触达 {fmt_int_metric(scene, 'touch_users')}、使用人数 {fmt_int_metric(scene, 'used_people')}、用券量 {fmt_int_metric(scene, 'usage_quantity')}。",
        "- 净效应：当前缺实验组/参考组和动作前后窗口，净效应不可计算，需补数据后再判断单动作机制是否起效。",
        "",
        "## 辅助指标校验",
        "",
        f"- 曝光和点击绝对量：商品侧曝光 {fmt_int_metric(compass, 'exposures')}、点击 {fmt_int_metric(compass, 'clicks')}；唯直达/T-max 可校验广告曝光、点击、CTR 和 CPC。",
        f"- 价格和库存：平均价格 {fmt_money(compass['avg_price'])}；库存天数低于 7 天的明细 {fmt_int(compass['stock_risk_count'])} 行，放大动作前需排除断货干扰。",
        f"- 投放干扰：唯直达花费 {fmt_money(vipdirect['cost'])}，T-max 活动成本 {fmt_money(tmax['cost'])}；其他商品动作复盘时需把广告加码作为辅助解释。",
        f"- 权益成本：礼金成本 {fmt_money_metric(gift, 'cost')}，购物车/跨品类券成本 {fmt_money_metric(scene, 'cost')}；缺触达、领取、成本或毛利时不能直接判定利润健康。",
        "- 售后质量：当前工作簿没有退拒换、评价、投诉或毛利字段，经营质量结论需要降级。",
        "",
        "## 终端商业指标",
        "",
        f"- 商品销售：销售额 {fmt_money(compass['sales'])}，销售数量 {fmt_int(compass['quantity'])}，客户数 {fmt_int_metric(compass, 'customers')}，下单客户/商详 UV {fmt_pct_metric(compass, 'order_customer_rate')}。",
        f"- 投放成交：唯直达 24小时成交/销售 {fmt_money(vipdirect['sales'])}、ROI {vipdirect['roi']:.2f}；T-max 24小时成交/销售 {fmt_money(tmax['sales'])}、ROI {tmax['roi']:.2f}。",
        f"- 权益成交：礼金订单 {fmt_int_metric(gift, 'orders')}、销售额 {fmt_money_metric(gift, 'sales')}、ROI {fmt_roi_metric(gift)}；购物车/跨品类券订单 {fmt_int_metric(scene, 'orders')}、销售额 {fmt_money_metric(scene, 'sales')}、ROI {fmt_roi_metric(scene)}。",
        "",
        "## 投放明细校验",
        "",
        ad_line(vipdirect),
        ad_line(tmax),
        "",
        "## 权益使用效果",
        "",
        benefit_line(gift),
        benefit_line(scene),
        "",
        "## 核心洞察",
        "",
    ])
    lines.extend([f"- {item}" for item in insights])
    lines.extend(["", "## 效果标签与置信度解释", ""])
    for key in ["compass", "vipdirect", "tmax", "bct_gift", "bct_scene"]:
        item = metrics[key]
        lines.append(f"- {item['source']}: 效果标签「{item['effect_label']}」，置信度 {item['confidence']}。{item['confidence_reason']}")
    lines.extend(["", "## 商品结构参考", ""])
    if top_categories:
        lines.append("三级品类销售 Top:")
        lines.extend([f"- {item['name']}: {fmt_money(item['value'])}" for item in top_categories])
    if top_styles:
        lines.append("")
        lines.append("款号销售 Top:")
        lines.extend([f"- {item['name']}: {fmt_money(item['value'])}" for item in top_styles])
    lines.extend(["", "## 后续建议", ""])
    lines.extend([f"- {item}" for item in recommendations])
    lines.extend(["", "## 数据缺口与补数提示", ""])
    lines.extend([f"- {item}" for item in metrics["coverage_gaps"]])
    return "\n".join(lines) + "\n"


def write_analysis(result: AnalysisResult, out_dir: Path | str) -> dict[str, str]:
    out_dir = Path(out_dir).expanduser()
    out_dir.mkdir(parents=True, exist_ok=True)
    stem = Path(result.workbook).stem
    json_path = out_dir / f"{stem}_analysis.json"
    md_path = out_dir / f"{stem}_strategy.md"
    json_path.write_text(json.dumps(result.to_json(), ensure_ascii=False, indent=2), encoding="utf-8")
    md_path.write_text(result.markdown, encoding="utf-8")
    return {"analysis_json": str(json_path), "strategy_markdown": str(md_path)}
