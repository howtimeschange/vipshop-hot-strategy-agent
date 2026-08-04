;(async () => {
  const params = window.__CRAWSHRIMP_PARAMS__ || {}
  const shared = window.__CRAWSHRIMP_SHARED__ || {}
  const phase = window.__CRAWSHRIMP_PHASE__ || 'main'
  const testExports = window.__CRAWSHRIMP_EXPORTS__ || null

  const SUMMARY_SHEET = '执行摘要'
  const COMPASS_SHEET = '魔方罗盘销售明细'
  const VZD_SHEET = '唯直达投放效果'
  const TMAX_SHEET = 'T-max效果'
  const BCT_GIFT_SHEET = '中台礼金'
  const BCT_SCENE_SHEET = '中台购物车跨品类券'

  const COMPASS_PAGE_URL = 'https://compass.vip.com/frontend/index.html#/product/details'
  const BCT_PAGE_URL = 'https://bct.vip.com/vendor_new_v2/index.html#/frontend/strategyEffect/list?tab=userLifecycle'
  const VIPDIRECT_PAGE_URL = 'https://e.vip.com/upgrade.html#/promotion/insite/search/advertisement'
  const VIPDIRECT_SUMMARY_PAGE_URL = 'https://e.vip.com/upgrade.html#/promotion/insite/search/report'
  const TMAX_PAGE_URL = 'https://e.vip.com/upgrade.html#/promotion/tmax/sptg/report-goods'
  const GOODS_DETAIL_URL = '/product/detail/getGoodsList'
  const COMPASS_EXPORT_SUBMIT_URL = '/product/detail/asyncExportGoodsList'
  const COMPASS_EXPORT_TASK_LIST_URL = '/report/asyncdownload/queryTaskList'
  const COMPASS_EXPORT_FILE_URL = '/report/asyncdownload/getOutputFile'
  const BCT_AVAILABLE_BRAND_URL = '/bcc/authority/available_brand?_check_empty=1'
  const BCT_TOOLBOX_LIST_URL = '/bcc/toolbox_task/list'
  const BCT_DOWNLOAD_CENTER_ADD_URL = '/bcc/vendorBrand/downCenter/add'
  const BCT_DOWNLOAD_CENTER_PAGE_URL = '/bcc/vendorBrand/downCenter/page'
  const BCT_FILE_SECURITY_DOWN_URL = '/bcc/file_common/fileSecurityDown'
  const MARKETING_CURRENT_USER_URL = '/user/current'
  const VIPDIRECT_AD_LIST_URL = '/ad/list/v2'
  const VIPDIRECT_PRODUCT_INSIGHT_AD_LIST_URL = '/product/insight/ad/list'
  const VIPDIRECT_REPORT_TABLE_URL = '/ck/report/table'
  const TMAX_GOODS_REPORT_URL = '/spugoods/report/table'
  const TMAX_HOT_GOODS_PERMISSION = 'vip:tmax:hot:goods:whitelist'
  const VIPDIRECT_DEFAULT_COLUMNS = [
    'COST',
    'IMPRESSION_COUNT',
    'CLICK_COUNT',
    'CLICK_RATE',
    'COST_PER_MILLE',
    'COST_PER_CLICK',
    'APP_UV',
    'MINIAPP_UV',
    'DETAIL_UV_1D',
    'BRAND_UV',
    'LIKE_CNT_1D',
    'ADDCART_CNT_1D',
    'COST_PER_ADDCART_1D',
    'BOOK_CUSTOMER_IN_24HOUR',
    'BOOK_ORDERS_24HOUR',
    'COST_PER_ORDER_1D',
    'BOOK_SALES_24HOUR',
    'BOOK_ROI_IN_24HOUR',
    'CUSTOMER_IN_24HOUR',
    'SALES_24HOUR',
    'ROI_IN_24HOUR',
    'GOODS_LIKE_CNT_1D',
    'GOODS_ADDCART_CNT_1D',
    'GOODS_COST_PER_ADDCART_1D',
    'GOODS_BOOK_CUSTOMER_IN_24HOUR',
    'GOODS_BOOK_ORDERS_24HOUR',
    'GOODS_COST_PER_ORDER_1D',
    'GOODS_BOOK_SALES_24HOUR',
    'GOODS_BOOK_ROI_IN_24HOUR',
    'GOODS_CUSTOMER_IN_24HOUR',
    'GOODS_SALES_24HOUR',
    'GOODS_ROI_IN_24HOUR',
  ]
  const VIPDIRECT_DEFAULT_REPORT_CHANNEL_TYPES = ['VSM']
  const VIPDIRECT_DEFAULT_DEAL_TYPES = ['RTB']
  const TMAX_DEFAULT_COLUMNS = '1,2,3,4,73'
  const TMAX_DEFAULT_MARKETING_SCENES = '3,4,5'
  const CHINA_TIMEZONE_OFFSET_HOURS = 8
  const DEFAULT_PAGE_SIZE = 300
  const DEFAULT_MAX_PAGES = 80
  const DEFAULT_DELAY_MS = 80
  const SUCCESS_CODES = ['0', '1', '200']
  const COMPASS_BASE_EXPORT_FIELDS = [
    'merchandiseNo',
    'dt',
    'goodsName',
    'goodsNo',
    'osn',
    'prodSpuId',
    'imgUrl',
    'brandStoreSn',
    'brandStoreName',
  ]
  const COMPASS_CUSTOM_METRIC_FIELDS = [
    'thirdCateName',
    'productSellAge',
    'merTypeList',
    'suitSeason',
    'minVipshopPrice',
    'minPayPrice',
    'minMarketPrice',
    'discountRangeName',
    'firstShelfTime',
    'mainStyleName',
    'status',
    'impressionUv',
    'uv',
    'impressionClickRate',
    'ctr',
    'valueOfUv',
    'valueOfImpressionUv',
    'merchandiseLikeUserNum',
    'merchandiseLikeRate',
    'addUserNum',
    'addRate',
    'interestedUserNum',
    'interestedUserMerNum',
    'goodsActureAmt',
    'goodsActureNum',
    'userNum',
    'bctNewUser',
    'pageMerDetailConvRate',
    'couponAmt',
    'resultGoodsActureAmt',
    'resultGoodsActureNum',
    'itemUnitPrice',
    'userUnitPrice',
    'svipGoodsActureAmt',
    'svipGoodsActureNum',
    'svipUserNum',
    'brandGoodsActureAmt',
    'brandGoodsActureNum',
    'brandUserNum',
    'returnItemNum',
    'rejectItemNum',
    'rejectAndReturnItemNum',
    'exchangeItemNum',
    'returnGoodsAmt',
    'rejectGoodsAmt',
    'rejectAndReturnGoodsAmt',
    'exchangeGoodsAmt',
    'returnItemRate',
    'rejectItemRate',
    'rejectAndReturnItemRate',
    'exchangeItemRate',
    'onSellLeavingNum',
    'leavingNum',
    'onSellValueOfVipshop',
    'onSellValueOfPay',
    'salesRateOfNum',
    'userStrategyRoi',
    'userStrategyGoodsActureAmt',
    'userStrategyCostAmt',
    'brandUserStrategyRoi',
    'brandUserStrategyGoodsActureAmt',
    'brandUserStrategyCostAmt',
    'wxkStrategyRoi',
    'wxkStrategyGoodsActureAmt',
    'wxkStrategyCostAmt',
  ]
  const COMPASS_FULL_EXPORT_FIELDS = [
    ...COMPASS_BASE_EXPORT_FIELDS,
    ...COMPASS_CUSTOM_METRIC_FIELDS,
  ]

  const DEFAULT_REPORT_SCOPE = [
    'compass_sales_detail',
    'vipdirect_ads',
    'tmax_goods',
    'bct_gift',
    'bct_scene',
  ]

  const BCT_LIFECYCLE_TASK_TYPES = [13, 14, 15, 16, 17, 18, 19, 20, 23, 25, 32, 34, 35, 36]
  const BCT_SCENE_TASK_TYPES = [21, 22, 24, 26, 27, 28, 29, 30, 33, 37]
  const BCT_PRODUCT_EFFECT_EXPORTS = {
    summary: { exportType: 0, configKey: 'toolTaskMidSummary', label: '商品汇总效果数据' },
    daily: { exportType: 1, configKey: 'toolTaskMidDaily', label: '商品每日新增效果数据明细' },
  }
  const BCT_DOWNLOAD_STATUS_LABELS = {
    0: '待执行',
    1: '生成中',
    2: '生成成功',
    3: '生成失败',
    4: '已失效',
  }

  const BCT_TASK_TYPE_LABELS = {
    13: '首单礼金',
    14: '二单礼金',
    15: '首单买赠',
    16: '二单买赠',
    17: '老客买赠',
    18: '首单品牌券',
    19: '二单品牌券',
    20: '老客品牌券',
    21: '惊喜品牌券',
    22: '购物车挽回',
    23: '二单复购营销',
    24: '跨品类营销',
    25: '老友品牌券',
    26: '周期购',
    27: '机会人群营销',
    28: '分享裂变',
    29: '试用派券',
    30: '特卖团',
    31: '营销快车-品牌券',
    32: '重逢礼金',
    33: '营销快车',
    34: '老友礼金',
    35: '惊喜码',
    36: '复购无忧',
    37: '实时营销',
    38: '智能优惠',
  }

  const BCT_STATUS_LABELS = {
    0: '草稿',
    1: '未开始',
    2: '进行中',
    3: '已结束',
    4: '已下线',
    5: '系统审核中',
    6: '审核不通过',
    7: '审核失败',
  }

  const RAW_PREFIX = '源字段/'

  function compact(value) {
    return String(value ?? '').replace(/\s+/g, ' ').trim()
  }

  function hasText(value) {
    return compact(value) !== ''
  }

  function normalizeCode(value) {
    return compact(value).replace(/[\s"'`]+/g, '').toUpperCase()
  }

  function normalizeDateValue(value) {
    const text = compact(value)
    if (!text) return ''
    const match = text.match(/(20\d{2})[-/.年]?\s*(\d{1,2})[-/.月]?\s*(\d{1,2})/)
    if (!match) return ''
    const [, year, month, day] = match
    return `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`
  }

  function formatDate(value) {
    const ymd = normalizeDateValue(value)
    if (!ymd) return compact(value)
    return `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`
  }

  function normalizeDateTime(value, endOfDay = false) {
    const text = compact(value)
    const ymd = normalizeDateValue(text)
    if (!ymd) return ''
    const dateText = `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`
    const timeMatch = text.match(/\b(\d{1,2}:\d{2}(?::\d{2})?)\b/)
    if (timeMatch) {
      const parts = timeMatch[1].split(':')
      const hour = String(parts[0]).padStart(2, '0')
      const minute = String(parts[1] || '00').padStart(2, '0')
      const second = String(parts[2] || '00').padStart(2, '0')
      return `${dateText} ${hour}:${minute}:${second}`
    }
    return `${dateText} ${endOfDay ? '23:59:59' : '00:00:00'}`
  }

  function firstNonEmpty(...values) {
    for (const value of values) {
      if (hasText(value)) return compact(value)
    }
    return ''
  }

  function normalizeScope(rawScope = params.report_scope) {
    if (Array.isArray(rawScope)) {
      const values = rawScope.map(compact).filter(Boolean)
      return values.length ? values : DEFAULT_REPORT_SCOPE
    }
    const text = compact(rawScope)
    if (!text) return DEFAULT_REPORT_SCOPE
    return text.split(/[,，、\s]+/).map(compact).filter(Boolean)
  }

  function hasScope(scope, key) {
    return normalizeScope(scope).includes(key)
  }

  function wantsAny(scope, keys) {
    return keys.some(key => hasScope(scope, key))
  }

  function parseList(value) {
    if (Array.isArray(value)) return value.map(compact).filter(Boolean)
    return compact(value).split(/[\n,，、\s]+/).map(compact).filter(Boolean)
  }

  function parseNumberList(value) {
    return parseList(value).map(item => Number(item)).filter(item => Number.isFinite(item))
  }

  function getPageSize(kind = 'default', rawParams = params) {
    const max = kind === 'bct' ? 300 : (kind === 'vipdirect' ? 100 : 500)
    const min = kind === 'bct' ? 10 : 20
    const specificKey = `${kind}_page_size`
    const raw = Number(rawParams[specificKey] || rawParams.page_size || DEFAULT_PAGE_SIZE) || DEFAULT_PAGE_SIZE
    return Math.max(min, Math.min(max, raw))
  }

  function getMaxPages(rawParams = params) {
    return Math.max(1, Math.min(1000, Number(rawParams.max_pages || DEFAULT_MAX_PAGES) || DEFAULT_MAX_PAGES))
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  function currentHref() {
    return String(location?.href || '')
  }

  function isCompassPage(href = currentHref()) {
    return /^https:\/\/compass\.vip\.com\/.*#\/product\/details/i.test(String(href || ''))
  }

  function isBctPage(href = currentHref()) {
    return /^https:\/\/bct\.vip\.com\//i.test(String(href || ''))
  }

  function isMarketingLoggedInPage(href = currentHref(), bodyText = document?.body?.innerText || '') {
    const text = compact(bodyText)
    const url = String(href || '')
    const looksLikeMarketingShell = /^https:\/\/e\.vip\.com\/upgrade\.html/i.test(url)
    return /^https:\/\/e\.vip\.com\//i.test(String(href || ''))
      && !/passport\.vip\.com|登录|扫码登录|账号登录/i.test(`${href} ${text}`)
      && (looksLikeMarketingShell || /唯直达|Target-Max|T-max|广告|投放|商品打爆|营销平台|账户/i.test(text))
  }

  function complete(data = [], nextShared = shared) {
    return {
      success: true,
      data,
      meta: {
        action: 'complete',
        has_more: false,
        shared: nextShared,
      },
    }
  }

  function nextPhase(nextPhaseName, data = [], nextShared = shared, sleepMs = 600) {
    return {
      success: true,
      data,
      meta: {
        action: 'next_phase',
        next_phase: nextPhaseName,
        sleep_ms: sleepMs,
        shared: nextShared,
      },
    }
  }

  function describeApiError(json, fallback = '接口失败') {
    const error = json?.error || {}
    const status = compact(error.statusCode)
    const message = compact(error.message || error.rawMessage || json?.message || json?.msg || fallback)
    return status ? `${status}：${message}` : message
  }

  async function postJson(url, payload, extraHeaders = {}) {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        ...extraHeaders,
      },
      body: JSON.stringify(payload),
    })
    const text = await response.text()
    let json
    try {
      json = JSON.parse(text)
    } catch (error) {
      throw new Error(`${url} 返回非 JSON：${text.slice(0, 160)}`)
    }
    if (!response.ok) throw new Error(`${url} HTTP ${response.status}：${describeApiError(json, text.slice(0, 160))}`)
    if (json?.error) throw new Error(`${url} 返回错误：${describeApiError(json)}`)
    if (json && json.success === false) throw new Error(`${url} 返回失败：${describeApiError(json)}`)
    if (json && json.code != null && !SUCCESS_CODES.includes(String(json.code))) {
      throw new Error(`${url} 返回 code=${json.code}：${describeApiError(json)}`)
    }
    return json
  }

  async function postBlob(url, payload, extraHeaders = {}) {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        ...extraHeaders,
      },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      const text = await response.text().catch(() => '')
      throw new Error(`${url} HTTP ${response.status}：${text.slice(0, 160)}`)
    }
    const contentType = response.headers.get('content-type') || ''
    const arrayBuffer = await response.arrayBuffer()
    throwIfDownloadLooksLikeError(url, contentType, arrayBuffer)
    return {
      base64: arrayBufferToBase64(arrayBuffer),
      contentType,
      fileName: filenameFromContentDisposition(response.headers.get('content-disposition') || ''),
      byteLength: arrayBuffer.byteLength,
    }
  }

  function payloadToFormData(payload = {}) {
    const formData = new FormData()
    for (const [key, value] of Object.entries(payload || {})) {
      if (Array.isArray(value)) {
        value.forEach(item => formData.append(key, rawValue(item)))
      } else if (value != null) {
        formData.append(key, rawValue(value))
      }
    }
    return formData
  }

  async function postFormBlob(url, payload, extraHeaders = {}) {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'X-Requested-With': 'XMLHttpRequest', ...extraHeaders },
      body: payloadToFormData(payload),
    })
    if (!response.ok) {
      const text = await response.text().catch(() => '')
      throw new Error(`${url} HTTP ${response.status}：${text.slice(0, 160)}`)
    }
    const contentType = response.headers.get('content-type') || ''
    const arrayBuffer = await response.arrayBuffer()
    throwIfDownloadLooksLikeError(url, contentType, arrayBuffer)
    return {
      base64: arrayBufferToBase64(arrayBuffer),
      contentType,
      fileName: filenameFromContentDisposition(response.headers.get('content-disposition') || ''),
      byteLength: arrayBuffer.byteLength,
    }
  }

  async function getJson(url, extraHeaders = {}) {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: { 'X-Requested-With': 'XMLHttpRequest', ...extraHeaders },
    })
    const text = await response.text()
    let json
    try {
      json = JSON.parse(text)
    } catch (error) {
      throw new Error(`${url} 返回非 JSON：${text.slice(0, 160)}`)
    }
    if (!response.ok) throw new Error(`${url} HTTP ${response.status}：${describeApiError(json, text.slice(0, 160))}`)
    if (json?.error) throw new Error(`${url} 返回错误：${describeApiError(json)}`)
    if (json && json.success === false) throw new Error(`${url} 返回失败：${describeApiError(json)}`)
    if (json && json.code != null && !SUCCESS_CODES.includes(String(json.code))) {
      throw new Error(`${url} 返回 code=${json.code}：${describeApiError(json)}`)
    }
    return json
  }

  async function getBlob(url, extraHeaders = {}) {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: { 'X-Requested-With': 'XMLHttpRequest', ...extraHeaders },
    })
    if (!response.ok) {
      const text = await response.text().catch(() => '')
      throw new Error(`${url} HTTP ${response.status}：${text.slice(0, 160)}`)
    }
    const contentType = response.headers.get('content-type') || ''
    const arrayBuffer = await response.arrayBuffer()
    throwIfDownloadLooksLikeError(url, contentType, arrayBuffer)
    return {
      base64: arrayBufferToBase64(arrayBuffer),
      contentType,
      fileName: filenameFromContentDisposition(response.headers.get('content-disposition') || ''),
      byteLength: arrayBuffer.byteLength,
    }
  }

  function throwIfDownloadLooksLikeError(url, contentType, arrayBuffer) {
    const lowered = compact(contentType).toLowerCase()
    if (!/json|html/.test(lowered)) return
    const preview = new TextDecoder('utf-8').decode(arrayBuffer.slice(0, 240)).trim()
    throw new Error(`${url} 返回的不是可解析报表文件：${preview}`)
  }

  function withQuery(url, payload = {}) {
    const query = new URLSearchParams()
    for (const [key, value] of Object.entries(payload || {})) {
      if (Array.isArray(value)) value.forEach(item => query.append(key, rawValue(item)))
      else if (value != null) query.append(key, rawValue(value))
    }
    const text = query.toString()
    if (!text) return url
    return `${url}${String(url).includes('?') ? '&' : '?'}${text}`
  }

  function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer)
    const chunkSize = 0x8000
    let binary = ''
    for (let index = 0; index < bytes.length; index += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize))
    }
    return btoa(binary)
  }

  function filenameFromContentDisposition(value) {
    const text = compact(value)
    if (!text) return ''
    const starMatch = text.match(/filename\*=UTF-8''([^;]+)/i)
    if (starMatch) {
      try {
        return decodeURIComponent(starMatch[1])
      } catch (error) {
        return compact(starMatch[1])
      }
    }
    const match = text.match(/filename="?([^";]+)"?/i)
    return match ? compact(match[1]) : ''
  }

  async function getTmaxJson(url, advertiserId) {
    if (!hasText(advertiserId)) throw new Error('营销平台当前用户未返回 advertiserId，无法读取 T-max 商品打爆报表。')
    return getJson(url, { advid: advertiserId })
  }

  async function collectPagedRows(options) {
    const rows = []
    let total = null
    let pages = 0
    for (let pageNo = 1; pageNo <= options.maxPages; pageNo += 1) {
      const json = await postJson(options.url, options.buildPayload(pageNo, options.pageSize))
      const pageRows = options.extractRows(json)
      const reportedTotal = Number(options.extractTotal(json))
      if (Number.isFinite(reportedTotal) && reportedTotal > 0 && total == null) total = reportedTotal
      pages = pageNo
      rows.push(...pageRows)
      if (!pageRows.length) break
      if (total && rows.length >= total) break
      if (pageRows.length < options.pageSize) break
      await sleep(DEFAULT_DELAY_MS)
    }
    return { rows, total: total || rows.length, pages }
  }

  function ymdToOffsetMidnightMs(ymd, offsetHours = CHINA_TIMEZONE_OFFSET_HOURS) {
    const text = normalizeDateValue(ymd)
    if (!text) return 0
    const year = Number(text.slice(0, 4))
    const month = Number(text.slice(4, 6))
    const day = Number(text.slice(6, 8))
    return Date.UTC(year, month - 1, day) - offsetHours * 60 * 60 * 1000
  }

  function ymdFromOffsetMs(ms, offsetHours = CHINA_TIMEZONE_OFFSET_HOURS) {
    const date = new Date(Number(ms) + offsetHours * 60 * 60 * 1000)
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    return `${year}${month}${day}`
  }

  function shiftYmd(ymd, days) {
    return ymdFromOffsetMs(ymdToOffsetMidnightMs(ymd) + Number(days || 0) * 24 * 60 * 60 * 1000)
  }

  function extractTmaxDateRange(rawParams = params, nowMs = Date.now()) {
    const explicitStart = normalizeDateValue(
      rawParams.tmax_start_date || rawParams.marketing_start_date || rawParams.start_date,
    )
    const explicitEnd = normalizeDateValue(
      rawParams.tmax_end_date || rawParams.marketing_end_date || rawParams.end_date,
    )
    const startYmd = explicitStart || explicitEnd
    const endYmd = explicitEnd || explicitStart
    if (startYmd) {
      return {
        startYmd,
        endYmd,
        startMs: ymdToOffsetMidnightMs(startYmd),
        endMs: ymdToOffsetMidnightMs(endYmd),
        endOfDayMs: dateRangeEndOfDayMs(endYmd),
        source: '参数',
      }
    }

    const yesterday = shiftYmd(ymdFromOffsetMs(nowMs), -1)
    const start = shiftYmd(yesterday, -14)
    return {
      startYmd: start,
      endYmd: yesterday,
      startMs: ymdToOffsetMidnightMs(start),
      endMs: ymdToOffsetMidnightMs(yesterday),
      endOfDayMs: dateRangeEndOfDayMs(yesterday),
      source: '默认近15天',
    }
  }

  function extractVipDirectDateRange(rawParams = params, nowMs = Date.now()) {
    const explicitStart = normalizeDateValue(
      rawParams.vipdirect_start_date || rawParams.marketing_start_date || rawParams.tmax_start_date || rawParams.start_date,
    )
    const explicitEnd = normalizeDateValue(
      rawParams.vipdirect_end_date || rawParams.marketing_end_date || rawParams.tmax_end_date || rawParams.end_date,
    )
    const startYmd = explicitStart || explicitEnd
    const endYmd = explicitEnd || explicitStart
    if (startYmd) {
      return {
        startYmd,
        endYmd,
        startMs: ymdToOffsetMidnightMs(startYmd),
        endMs: ymdToOffsetMidnightMs(endYmd),
        endOfDayMs: dateRangeEndOfDayMs(endYmd),
        source: '参数',
      }
    }

    const yesterday = shiftYmd(ymdFromOffsetMs(nowMs), -1)
    const start = shiftYmd(yesterday, -14)
    return {
      startYmd: start,
      endYmd: yesterday,
      startMs: ymdToOffsetMidnightMs(start),
      endMs: ymdToOffsetMidnightMs(yesterday),
      endOfDayMs: dateRangeEndOfDayMs(yesterday),
      source: '默认近15天',
    }
  }

  function parseBooleanFlag(value, fallback = false) {
    if (value == null || value === '') return fallback
    if (typeof value === 'boolean') return value
    return /^(1|true|yes|y|是)$/i.test(compact(value))
  }

  function vipDirectColumnList(rawParams = params) {
    const provided = parseList(rawParams.vipdirect_columns || rawParams.marketing_columns)
    return provided.length ? provided : VIPDIRECT_DEFAULT_COLUMNS
  }

  function buildVipDirectReportPayload(pageNo, pageSize, dateRange, user = {}, rawParams = params) {
    const advertiserIds = parseList(rawParams.vipdirect_advertiser_ids || rawParams.advertiser_ids)
    const reportChannelTypes = parseList(rawParams.vipdirect_report_channel_types || rawParams.report_channel_types)
    const dealTypes = parseList(rawParams.vipdirect_deal_type || rawParams.deal_type)
    const payload = {
      layer: compact(rawParams.vipdirect_layer || rawParams.marketing_layer || 'ALL') || 'ALL',
      startDate: dateRange.startMs,
      endDate: dateRange.endMs,
      columnList: vipDirectColumnList(rawParams),
      reportChannelTypes: reportChannelTypes.length ? reportChannelTypes : VIPDIRECT_DEFAULT_REPORT_CHANNEL_TYPES,
      advertiserIds: advertiserIds.length ? advertiserIds : [user.advertiserId].filter(Boolean),
      showHour: parseBooleanFlag(rawParams.vipdirect_show_hour || rawParams.show_hour, false),
      unionLayer: compact(rawParams.vipdirect_union_layer || rawParams.union_layer || 'NONE') || 'NONE',
      dealType: dealTypes.length ? dealTypes : VIPDIRECT_DEFAULT_DEAL_TYPES,
      pageIndex: pageNo,
      pageCount: pageSize,
    }

    const passthrough = {
      sort: rawParams.vipdirect_sort || rawParams.marketing_sort,
      orderBy: rawParams.vipdirect_orderby || rawParams.vipdirect_order_by || rawParams.marketing_orderby,
      campaignTitle: rawParams.vipdirect_campaign_title || rawParams.campaign_title,
      adTitle: rawParams.vipdirect_ad_title || rawParams.ad_title,
      keywordTitle: rawParams.vipdirect_keyword_title || rawParams.keyword_title,
      brandCategoryIds: rawParams.vipdirect_brand_category_ids || rawParams.brand_category_ids,
    }
    for (const [key, value] of Object.entries(passthrough)) {
      if (hasText(value)) payload[key] = value
    }
    return payload
  }

  function buildQueryString(fields) {
    return Object.entries(fields)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value ?? '')}`)
      .join('&')
  }

  function parseJsonObject(value) {
    if (!hasText(value)) return {}
    if (value && typeof value === 'object' && !Array.isArray(value)) return value
    try {
      const parsed = JSON.parse(String(value))
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
    } catch (error) {
      return {}
    }
  }

  function dateRangeEndOfDayMs(ymd) {
    const start = ymdToOffsetMidnightMs(ymd)
    return start ? start + 24 * 60 * 60 * 1000 - 1 : 0
  }

  function buildTmaxGoodsReportUrl(pageNo, pageSize, dateRange, rawParams = params) {
    return `${TMAX_GOODS_REPORT_URL}?${buildQueryString({
      sd: dateRange.startMs,
      ed: dateRange.endMs,
      advid: '',
      pi: pageNo,
      pc: pageSize,
      sort: rawParams.tmax_sort ?? 1,
      orderby: rawParams.tmax_orderby ?? 0,
      spuId: rawParams.tmax_spu_id || rawParams.spu_id || '',
      goodsName: rawParams.tmax_goods_name || rawParams.goods_name || '',
      adsTitle: rawParams.tmax_ads_title || rawParams.ads_title || '',
      reportType: rawParams.tmax_report_type ?? 0,
      columns: rawParams.tmax_columns || TMAX_DEFAULT_COLUMNS,
      msList: rawParams.tmax_ms_list || TMAX_DEFAULT_MARKETING_SCENES,
    })}`
  }

  function extractCompassDateRange(rawParams = params) {
    const explicitStart = normalizeDateValue(rawParams.start_date || rawParams.compass_start_date || rawParams.startDt)
    const explicitEnd = normalizeDateValue(rawParams.end_date || rawParams.compass_end_date || rawParams.endDt)
    if (explicitStart) return { startDt: explicitStart, endDt: explicitEnd || explicitStart, source: '参数' }

    const bodyText = compact(document?.body?.innerText || '')
    const statMatch = bodyText.match(/统计日期[\s\S]{0,120}?(20\d{2}[-/.年]\s*\d{1,2}[-/.月]\s*\d{1,2})/)
    const pageDate = normalizeDateValue(statMatch?.[1] || '')
    if (pageDate) return { startDt: pageDate, endDt: pageDate, source: '页面统计日期' }

    const firstDate = normalizeDateValue(bodyText)
    if (firstDate) return { startDt: firstDate, endDt: firstDate, source: '页面首个日期' }
    throw new Error('未能从当前罗盘页读取统计日期，请填写「数据开始日期」。')
  }

  function buildGoodsDetailPayload(pageNo, pageSize, dateRange, rawParams = params) {
    return {
      brandStoreSn: compact(rawParams.compass_brand_store_sn || rawParams.brand_store_sn || rawParams.brandStoreSn || 'all') || 'all',
      dtType: 0,
      calType: 1,
      startDt: dateRange.startDt,
      endDt: dateRange.endDt,
      queryHll: false,
      pageNo,
      pageSize,
      dimType: 0,
      channelType: 1,
    }
  }

  function deriveStyleFromSku(value) {
    const sku = normalizeCode(value)
    if (!sku) return ''
    if (/^[A-Z0-9]{8,}\d{3}$/.test(sku)) return sku.slice(0, -3)
    return sku
  }

  function inferStyleCode(row) {
    for (const value of [row?.osn, row?.styleCode, row?.style_code, row?.styleNo, row?.大货款号, row?.款号]) {
      const normalized = normalizeCode(value)
      if (normalized) return normalized
    }
    for (const value of [row?.msn, row?.goodsNo, row?.货号]) {
      const derived = deriveStyleFromSku(value)
      if (derived) return derived
    }
    return ''
  }

  function joinList(value) {
    if (Array.isArray(value)) return value.map(compact).filter(Boolean).join('、')
    if (value && typeof value === 'object') {
      return Object.entries(value)
        .filter(([, enabled]) => Boolean(enabled))
        .map(([key]) => key)
        .join('、')
    }
    return compact(value)
  }

  function formatSellChannel(value) {
    const text = compact(value)
    if (text === '1000' || text === '1') return '特卖会主站'
    return text
  }

  function normalizeStatus(value) {
    const text = compact(value)
    if (text === '0') return '可售'
    if (text === '1') return '在售'
    return text
  }

  function rawValue(value) {
    if (value == null) return ''
    if (Array.isArray(value)) return value.map(rawValue).filter(Boolean).join('、')
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value)
      } catch (error) {
        return compact(value)
      }
    }
    return compact(value)
  }

  function formatCents(value) {
    if (!hasText(value)) return ''
    const number = Number(value)
    if (!Number.isFinite(number)) return compact(value)
    return (number / 100).toFixed(2)
  }

  function formatRatio(value) {
    if (!hasText(value)) return ''
    const number = Number(value)
    if (!Number.isFinite(number)) return compact(value)
    return String(number)
  }

  function formatPercent(value) {
    if (!hasText(value)) return ''
    const number = Number(value)
    if (!Number.isFinite(number)) return compact(value)
    return `${(number * 100).toFixed(2)}%`
  }

  function appendRawFields(output, row, knownKeys, prefix = RAW_PREFIX) {
    const known = new Set(knownKeys || [])
    for (const key of Object.keys(row || {}).sort()) {
      if (known.has(key)) continue
      const value = rawValue(row[key])
      if (!value) continue
      output[`${prefix}${key}`] = value
    }
    return output
  }

  function normalizeCompassSalesRow(row) {
    const knownKeys = [
      ...COMPASS_FULL_EXPORT_FIELDS,
      'actureAmt', 'actureNum', 'channelName', 'channelType', 'discountRange',
      'firstCateName', 'secCateName', 'visitorNum', 'exposureUserNum', 'clickUserNum',
      'collectNum', 'cartNum', 'impressionNum', 'addItemNum', 'orderUserNum', 'orderAmt',
      'roi', 'canSellStockDay', 'salesAmt', 'saleAmt', 'payAmt', 'salesNum', 'saleNum',
    ]
    const output = {
      __sheet_name: COMPASS_SHEET,
      报表来源: '魔方罗盘销售明细',
      数据分组: '商品明细',
      品牌编码: compact(row.brandStoreSn),
      品牌名称: compact(row.brandStoreName),
      统计日期: formatDate(row.dt),
      商品ID: compact(row.merchandiseNo),
      商品名称: compact(row.goodsName),
      货号: compact(row.goodsNo || row.msn),
      款号: inferStyleCode(row),
      P_SPU_ID: compact(row.prodSpuId),
      商品图片: compact(row.imgUrl),
      三级品类: compact(row.thirdCateName),
      售龄: compact(row.productSellAge),
      货品类型: joinList(row.merTypeList),
      适用季节: compact(row.suitSeason),
      唯品价: compact(row.minVipshopPrice),
      到手价: compact(row.minPayPrice),
      市场价: compact(row.minMarketPrice),
      折扣: firstNonEmpty(row.discountRangeName, row.discountRange),
      首次上架时间: compact(row.firstShelfTime),
      主款式: compact(row.mainStyleName),
      是否上架: normalizeStatus(row.status),
      曝光UV: firstNonEmpty(row.impressionUv, row.exposureUserNum, row.exposeUserNum),
      商详UV: firstNonEmpty(row.uv, row.detailUv, row.goodsUv),
      '曝光-点击率': firstNonEmpty(row.impressionClickRate),
      CTR: firstNonEmpty(row.ctr),
      商详UV价值: firstNonEmpty(row.valueOfUv),
      曝光UV价值: firstNonEmpty(row.valueOfImpressionUv),
      收藏人数: firstNonEmpty(row.merchandiseLikeUserNum, row.collectNum, row.favNum, row.favoriteNum),
      收藏率: firstNonEmpty(row.merchandiseLikeRate),
      加购人数: firstNonEmpty(row.addUserNum, row.cartNum, row.addCartNum, row.addToCartNum),
      加购率: firstNonEmpty(row.addRate),
      兴趣人数: firstNonEmpty(row.interestedUserNum),
      兴趣人次: firstNonEmpty(row.interestedUserMerNum),
      销售额: firstNonEmpty(row.goodsActureAmt, row.actureAmt, row.salesAmt, row.saleAmt, row.payAmt),
      销售量: firstNonEmpty(row.goodsActureNum, row.actureNum, row.salesNum, row.saleNum),
      客户数: firstNonEmpty(row.userNum, row.customNum, row.customerNum),
      品牌新客数: firstNonEmpty(row.bctNewUser),
      购买转化率: firstNonEmpty(row.pageMerDetailConvRate),
      优惠券金额: firstNonEmpty(row.couponAmt),
      '销售额(不含拒退)': firstNonEmpty(row.resultGoodsActureAmt),
      '销售量(不含拒退)': firstNonEmpty(row.resultGoodsActureNum),
      件单价: firstNonEmpty(row.itemUnitPrice),
      ARPU: firstNonEmpty(row.userUnitPrice),
      超V销售额: firstNonEmpty(row.svipGoodsActureAmt),
      超V销售量: firstNonEmpty(row.svipGoodsActureNum),
      超V客户数: firstNonEmpty(row.svipUserNum),
      品牌会员销售额: firstNonEmpty(row.brandGoodsActureAmt),
      品牌会员销售量: firstNonEmpty(row.brandGoodsActureNum),
      品牌会员客户数: firstNonEmpty(row.brandUserNum),
      退货件数: firstNonEmpty(row.returnItemNum),
      拒收件数: firstNonEmpty(row.rejectItemNum),
      拒退件数: firstNonEmpty(row.rejectAndReturnItemNum),
      换货件数: firstNonEmpty(row.exchangeItemNum),
      退货金额: firstNonEmpty(row.returnGoodsAmt),
      拒收金额: firstNonEmpty(row.rejectGoodsAmt),
      拒退金额: firstNonEmpty(row.rejectAndReturnGoodsAmt),
      换货金额: firstNonEmpty(row.exchangeGoodsAmt),
      退货率: firstNonEmpty(row.returnItemRate),
      拒收率: firstNonEmpty(row.rejectItemRate),
      拒退率: firstNonEmpty(row.rejectAndReturnItemRate),
      换货率: firstNonEmpty(row.exchangeItemRate),
      在售库存: firstNonEmpty(row.onSellLeavingNum),
      可售库存: firstNonEmpty(row.leavingNum),
      在售唯品价货值: firstNonEmpty(row.onSellValueOfVipshop),
      在售到手价货值: firstNonEmpty(row.onSellValueOfPay),
      售卖比: firstNonEmpty(row.salesRateOfNum),
      用户策略ROI: firstNonEmpty(row.userStrategyRoi),
      用户策略销售额: firstNonEmpty(row.userStrategyGoodsActureAmt),
      用户策略成本: firstNonEmpty(row.userStrategyCostAmt),
      会员权益ROI: firstNonEmpty(row.brandUserStrategyRoi),
      会员权益销售额: firstNonEmpty(row.brandUserStrategyGoodsActureAmt),
      会员权益成本: firstNonEmpty(row.brandUserStrategyCostAmt),
      唯享客ROI: firstNonEmpty(row.wxkStrategyRoi),
      唯享客销售额: firstNonEmpty(row.wxkStrategyGoodsActureAmt),
      唯享客成本: firstNonEmpty(row.wxkStrategyCostAmt),
      数据来源接口: GOODS_DETAIL_URL,
      执行结果: '已抓取',
      备注: '',
    }
    return appendRawFields(output, row, knownKeys)
  }

  function compassBrandKeyword(rawParams = params) {
    return compact(rawParams.compass_brand_keyword || rawParams.brand_keyword || '巴拉巴拉')
  }

  function compassBalaOnly(rawParams = params) {
    return !parseBooleanFlag(rawParams.compass_all_brands || rawParams.all_brands, false)
  }

  function compassRowMatchesBrand(row, rawParams = params) {
    if (!compassBalaOnly(rawParams)) return true
    const keyword = compassBrandKeyword(rawParams)
    if (!keyword) return true
    const haystack = [
      row?.brandStoreName,
      row?.brandName,
      row?.brandStoreSn,
      row?.vendorName,
      row?.goodsName,
      row?.品牌名称,
      row?.品牌,
    ].map(compact).join(' ')
    return !haystack || haystack.includes(keyword) || /巴拉巴拉|Balabala/i.test(haystack)
  }

  function compassDownloadWaitMs(rawParams = params) {
    const seconds = Number(rawParams.compass_export_wait_seconds ?? rawParams.export_wait_seconds ?? 180)
    if (!Number.isFinite(seconds) || seconds <= 0) return 0
    return Math.max(0, Math.min(900, seconds)) * 1000
  }

  function compassDownloadPollMs(rawParams = params) {
    const seconds = Number(rawParams.compass_export_poll_seconds ?? rawParams.export_poll_seconds ?? 5)
    if (!Number.isFinite(seconds) || seconds <= 0) return 5000
    return Math.max(1000, Math.min(30000, seconds * 1000))
  }

  function compassExportSubmitUrl(rawParams = params) {
    return compact(rawParams.compass_export_submit_url || COMPASS_EXPORT_SUBMIT_URL) || COMPASS_EXPORT_SUBMIT_URL
  }

  function compassExportTaskListUrl(rawParams = params) {
    return compact(rawParams.compass_export_task_list_url || COMPASS_EXPORT_TASK_LIST_URL) || COMPASS_EXPORT_TASK_LIST_URL
  }

  function compassExportFileUrl(rawParams = params) {
    return compact(rawParams.compass_export_file_url || COMPASS_EXPORT_FILE_URL) || COMPASS_EXPORT_FILE_URL
  }

  function deferredDownloadFile({
    url = '',
    method = 'GET',
    payload = null,
    fileName = '',
    contentType = '',
    downType = '',
    fetchError = '',
  } = {}) {
    const absoluteUrl = (() => {
      const text = compact(url)
      if (!text) return ''
      try {
        return new URL(text, location.origin).href
      } catch (error) {
        return text
      }
    })()
    return {
      base64: '',
      contentType: compact(contentType),
      fileName: compact(fileName),
      byteLength: '',
      downType: compact(downType),
      downloadUrl: absoluteUrl,
      downloadMethod: compact(method || 'GET').toUpperCase(),
      downloadPayload: payload == null ? '' : safeJson(payload),
      deferredDownload: true,
      fetchError: compact(fetchError),
    }
  }

  async function firstSuccessfulBlobDownload(candidates) {
    const errors = []
    for (const candidate of candidates) {
      if (!candidate || typeof candidate.fetcher !== 'function') continue
      try {
        return await candidate.fetcher()
      } catch (error) {
        errors.push(`${candidate.label || 'download'}：${error.message || error}`)
      }
    }
    throw new Error(errors.join('；') || '没有可用下载方式。')
  }

  function stableClientKey(prefix, payload) {
    const text = safeJson(payload)
    let hash = 0
    for (let index = 0; index < text.length; index += 1) {
      hash = ((hash << 5) - hash + text.charCodeAt(index)) | 0
    }
    return `${prefix}_${Math.abs(hash)}_${Date.now()}`
  }

  function buildCompassExportPayload(dateRange, rawParams = params) {
    const explicit = parseJsonObject(rawParams.compass_export_payload)
    if (Object.keys(explicit).length) return explicit
    const query = buildGoodsDetailPayload(1, getPageSize('compass', rawParams), dateRange, rawParams)
    const brandStoreSn = compact(rawParams.compass_brand_store_sn || rawParams.brand_store_sn || rawParams.brandStoreSn || 'all') || 'all'
    const exportFilter = compact(rawParams.compass_export_filter)
      || COMPASS_FULL_EXPORT_FIELDS.join(',')
    const payload = {
      brandStoreSnSet: brandStoreSn === 'all' ? ['all'] : [brandStoreSn],
      calType: query.calType,
      channelType: query.channelType,
      dimType: Number(rawParams.compass_export_dim_type ?? rawParams.compass_dim_type ?? 0),
      dtType: query.dtType,
      startDt: dateRange.startDt,
      endDt: dateRange.endDt,
      filter: exportFilter,
      queryExtendMetric: parseBooleanFlag(rawParams.compass_query_extend_metric, true),
      queryHll: parseBooleanFlag(rawParams.compass_query_hll, false),
      specialMenusUser: parseBooleanFlag(rawParams.compass_special_menus_user, false),
    }
    return payload
  }

  function compassDownloadTaskType(rawParams = params) {
    const value = Number(rawParams.compass_download_task_type || rawParams.compass_task_type || 1)
    return Number.isFinite(value) && value > 0 ? value : 1
  }

  function compassDownloadCreateDate(rawParams = params) {
    return compact(rawParams.compass_download_create_date || rawParams.compass_export_create_date || ymdFromOffsetMs(Date.now()))
  }

  function buildCompassTaskListPayload(rawParams = params, extra = {}) {
    const payload = {
      taskType: compassDownloadTaskType(rawParams),
      createDate: compassDownloadCreateDate(rawParams),
      ...extra,
    }
    Object.keys(payload).forEach(key => {
      if (!hasText(payload[key])) delete payload[key]
    })
    return payload
  }

  function extractTaskId(json) {
    const candidates = [
      json?.data?.taskId,
      json?.data?.id,
      json?.data?.taskNo,
      json?.data?.downloadTaskId,
      json?.taskId,
      json?.id,
      json?.taskNo,
    ]
    for (const candidate of candidates) {
      if (['string', 'number'].includes(typeof candidate) && hasText(candidate)) return compact(candidate)
    }
    return ''
  }

  function extractTaskRows(json) {
    const data = json?.data || {}
    for (const value of [data.taskList, data.taskModelList, data.records, data.list, data.rows, data.items, json?.list, json?.rows]) {
      if (Array.isArray(value)) return value
    }
    return []
  }

  async function snapshotCompassExportTasks(rawParams = params, extra = {}) {
    const url = compassExportTaskListUrl(rawParams)
    return postJson(url, buildCompassTaskListPayload(rawParams, extra))
  }

  function exportTaskStatus(task) {
    return compact(task?.status ?? task?.taskStatus ?? task?.state ?? task?.executeStatus ?? task?.downloadStatus)
  }

  function exportTaskDone(task) {
    const status = exportTaskStatus(task)
    return ['2', '3', '5', 'SUCCESS', 'SUCCESSFUL', 'FINISHED', 'DONE', 'COMPLETED', '生成成功', '执行成功'].includes(status)
      || hasText(task?.downloadUrl || task?.downUrl || task?.fileUrl || task?.url || task?.fileLink || task?.outputFileVosKey)
  }

  function exportTaskFailed(task) {
    const status = exportTaskStatus(task)
    return ['4', '6', '7', 'FAIL', 'FAILED', 'ERROR', '生成失败', '执行异常', '取消任务', '已失效'].includes(status)
  }

  function exportTaskId(task) {
    return compact(task?.taskId || task?.id || task?.taskNo || task?.downloadTaskId)
  }

  function normalizeFilterFields(value) {
    return new Set(compact(value).split(',').map(compact).filter(Boolean))
  }

  function taskFilterCoversPayload(taskFilter, payloadFilter) {
    const expected = normalizeFilterFields(payloadFilter)
    if (!expected.size) return true
    const actual = normalizeFilterFields(taskFilter)
    if (!actual.size) return false
    for (const field of expected) {
      if (!actual.has(field)) return false
    }
    return true
  }

  function compassExportTaskMatches(task, context) {
    const expectedTaskId = compact(context.taskId)
    if (expectedTaskId && exportTaskId(task) === expectedTaskId) return true
    const createdAtMs = millisFromValue(task?.createTime || task?.createdAt || task?.gmtCreate)
    if (!context.allowExisting && createdAtMs && createdAtMs < context.submittedAtMs - 120000) return false
    const taskType = Number(task?.taskType)
    if (Number.isFinite(taskType) && Number.isFinite(Number(context.taskType)) && taskType !== Number(context.taskType)) return false
    const requestParams = parseJsonObject(task?.requestParams)
    if (requestParams.startDt && context.payload?.startDt && compact(requestParams.startDt) !== compact(context.payload.startDt)) return false
    if (requestParams.endDt && context.payload?.endDt && compact(requestParams.endDt) !== compact(context.payload.endDt)) return false
    if (requestParams.dimType != null && context.payload?.dimType != null && Number(requestParams.dimType) !== Number(context.payload.dimType)) return false
    if (context.payload?.filter) {
      if (requestParams.filter) {
        if (!taskFilterCoversPayload(requestParams.filter, context.payload.filter)) return false
      } else if (context.allowExisting) {
        return false
      }
    }
    const text = [
      task?.fileName,
      task?.outputFileName,
      task?.taskName,
      task?.name,
      task?.configKey,
      task?.scene,
      task?.bizType,
      task?.taskType,
      task?.downloadUrl,
      task?.downModel,
      task?.requestParams,
    ].map(rawValue).join(' ')
    return /商品|货品|明细|product|goods|item|merchandiseNo/i.test(text)
  }

  async function findExistingCompassExportTask(payload, rawParams = params) {
    const json = await snapshotCompassExportTasks(rawParams)
    const tasks = extractTaskRows(json)
    const context = {
      taskId: '',
      taskType: compassDownloadTaskType(rawParams),
      submittedAtMs: 0,
      allowExisting: true,
      payload,
    }
    return tasks.find(task => compassExportTaskMatches(task, context) && exportTaskDone(task)) || null
  }

  async function waitForCompassExportTask(context, rawParams = params) {
    const startedAtMs = Date.now()
    const waitMs = compassDownloadWaitMs(rawParams)
    const pollMs = compassDownloadPollMs(rawParams)
    let lastTask = null
    while (Date.now() - startedAtMs <= waitMs) {
      const json = await snapshotCompassExportTasks(rawParams)
      const tasks = extractTaskRows(json)
      const matched = tasks.find(task => compassExportTaskMatches(task, context))
      if (matched) {
        lastTask = matched
        if (exportTaskDone(matched) || exportTaskFailed(matched)) break
      }
      await sleep(pollMs)
    }
    return { task: lastTask }
  }

  async function submitCompassExportTask(payload, rawParams = params) {
    const submitUrl = compassExportSubmitUrl(rawParams)
    return postJson(submitUrl, payload)
  }

  async function downloadExportTaskFile(task, fallbackName, rawParams = params) {
    if (exportTaskId(task) && (task?.outputFileName || task?.outputFileVosKey || Number.isFinite(Number(task?.taskType)))) {
      const file = await postFormBlob(compassExportFileUrl(rawParams), {
        reqData: safeJson({ taskId: exportTaskId(task) }),
      })
      return {
        ...file,
        fileName: compact(task?.outputFileName) || compact(task?.fileName) || file.fileName || fallbackName,
      }
    }
    const model = normalizeDownModel(task)
    const modelUrl = compact(model?.fileLink || model?.downloadUrl || model?.downUrl || model?.url)
    const url = compact(task?.downloadUrl || task?.downUrl || task?.fileUrl || task?.url || task?.fileLink || modelUrl)
    if (!url) throw new Error('导出任务未返回下载 URL。')
    if (model?.param && model?.url && compact(model?.downType) !== 'FILE_LINK') {
      const payload = parseJsonObject(model.param)
      try {
        const file = await postBlob(model.url, payload)
        return {
          ...file,
          fileName: file.fileName || compact(task?.fileName) || fallbackName,
        }
      } catch (error) {
        return deferredDownloadFile({
          url: model.url,
          method: 'POST',
          payload,
          fileName: compact(task?.fileName) || fallbackName,
          downType: compact(model?.downType || 'CUSTOMIZE'),
          fetchError: error.message || String(error),
        })
      }
    }
    try {
      const file = await getBlob(url)
      return {
        ...file,
        fileName: file.fileName || compact(task?.fileName) || fallbackName,
      }
    } catch (error) {
      return deferredDownloadFile({
        url,
        method: 'GET',
        fileName: compact(task?.fileName) || fallbackName,
        downType: compact(model?.downType || 'FILE_LINK'),
        fetchError: error.message || String(error),
      })
    }
  }

  function buildCompassExportFailureRow(error, dateRange, rawParams = params) {
    return {
      __sheet_name: COMPASS_SHEET,
      报表来源: '魔方罗盘销售明细',
      数据分组: '商品明细后台导出',
      品牌编码: compact(rawParams.compass_brand_store_sn || rawParams.brand_store_sn || ''),
      品牌名称: compassBrandKeyword(rawParams),
      统计日期: `${formatDate(dateRange.startDt)} 至 ${formatDate(dateRange.endDt)}`,
      数据来源接口: `${compassExportSubmitUrl(rawParams)} -> ${compassExportTaskListUrl(rawParams)}`,
      执行结果: '后台导出失败',
      备注: [
        '默认不再降级页面表格接口，避免受 10000 条上限影响',
        `错误：${error.message || error}`,
        '如只需排查页面表格，可显式传 --compass-table-api 或 --compass-table-fallback。',
      ].filter(Boolean).join('；'),
    }
  }

  async function collectCompassSalesRowsByExport(rawParams = params) {
    const dateRange = extractCompassDateRange(rawParams)
    const payload = buildCompassExportPayload(dateRange, rawParams)
    const submittedAtMs = Date.now()
    let submitJson = null
    let submittedTaskId = ''
    let existingTask = null
    if (!parseBooleanFlag(rawParams.compass_force_new_export, false)) {
      try {
        existingTask = await findExistingCompassExportTask(payload, rawParams)
      } catch (error) {
        existingTask = null
      }
    }
    if (!existingTask) {
      submitJson = await submitCompassExportTask(payload, rawParams)
      const submitResult = Number(submitJson?.data?.result)
      if (Number.isFinite(submitResult) && ![0, 1].includes(submitResult)) {
        throw new Error(submitJson?.data?.msg || submitJson?.msg || '魔方后台导出任务创建失败')
      }
      submittedTaskId = extractTaskId(submitJson)
    }
    const context = {
      taskId: submittedTaskId,
      taskType: compassDownloadTaskType(rawParams),
      submittedAtMs,
      payload,
    }
    let downloadTask = null
    let downloadFile = null
    let downloadError = ''
    if (compassDownloadWaitMs(rawParams) > 0) {
      try {
        downloadTask = existingTask
        if (!downloadTask) {
          const waitResult = await waitForCompassExportTask(context, rawParams)
          downloadTask = waitResult.task
        }
        if (downloadTask && exportTaskDone(downloadTask)) {
          downloadFile = await downloadExportTaskFile(downloadTask, 'compass-product-detail.xlsx', rawParams)
        }
      } catch (error) {
        downloadError = error.message || String(error)
      }
    }
    const taskId = exportTaskId(downloadTask) || submittedTaskId || extractTaskId(submitJson)
    const status = exportTaskStatus(downloadTask)
    const resultText = downloadFile?.base64
      ? '已下载后台导出文件'
      : (downloadFile?.downloadUrl ? '已获取后台导出下载链接' : (downloadError ? '后台导出文件读取失败' : (exportTaskFailed(downloadTask) ? '后台导出失败' : '已提交后台导出')))
    const row = {
      __sheet_name: COMPASS_SHEET,
      报表来源: '魔方罗盘销售明细',
      数据分组: '商品明细后台导出',
      品牌编码: Array.isArray(payload.brandStoreSnSet) ? payload.brandStoreSnSet.join(',') : compact(payload.brandStoreSn || ''),
      品牌名称: compassBrandKeyword(rawParams),
      统计日期: `${formatDate(dateRange.startDt)} 至 ${formatDate(dateRange.endDt)}`,
      数据来源接口: `${compassExportSubmitUrl(rawParams)} -> ${compassExportTaskListUrl(rawParams)} -> ${compassExportFileUrl(rawParams)}`,
      执行结果: resultText,
      备注: [
        '来源：魔方后台下载导出，避开页面商品明细 10000 条表格上限',
        compassBalaOnly(rawParams) ? `仅保留品牌 ${compassBrandKeyword(rawParams) || '巴拉巴拉'} 数据` : '未限制品牌',
        existingTask ? '复用下载中心已成功任务并自动下载' : '',
        taskId ? `任务ID ${taskId}` : '',
        status ? `任务状态 ${status}` : '',
        downloadError ? `下载/解析待处理：${downloadError}` : '',
      ].filter(Boolean).join('；'),
      导出任务ID: taskId,
      下载文件名: compact(downloadFile?.fileName || downloadTask?.fileName),
      下载文件类型: compact(downloadFile?.contentType || downloadFile?.downType),
      下载文件字节数: downloadFile?.byteLength || '',
    }
    if (downloadFile?.base64 || downloadFile?.downloadUrl) {
      row.__attachment_base64 = downloadFile.base64 || ''
      row.__attachment_file_name = downloadFile.fileName || compact(downloadTask?.fileName) || 'compass-product-detail.xlsx'
      row.__attachment_content_type = downloadFile.contentType || ''
      row.__attachment_sheet_name = COMPASS_SHEET
      row.__attachment_download_url = downloadFile.downloadUrl || ''
      row.__attachment_download_method = downloadFile.downloadMethod || ''
      row.__attachment_download_payload = downloadFile.downloadPayload || ''
      row.__attachment_download_error = downloadFile.fetchError || ''
      row.__attachment_context = safeJson({
        sheet: COMPASS_SHEET,
        sourceLabel: '魔方罗盘销售明细',
        groupLabel: '商品明细',
        brandStoreSn: Array.isArray(payload.brandStoreSnSet) ? payload.brandStoreSnSet.join(',') : compact(payload.brandStoreSn || ''),
        brandName: compassBrandKeyword(rawParams),
        brandKeyword: compassBrandKeyword(rawParams),
        balaOnly: compassBalaOnly(rawParams),
        exportLabel: '后台下载导出商品明细（自定义指标全选）',
        configKey: 'compass_product_detail_export',
        taskId,
        sourceApi: `${compassExportSubmitUrl(rawParams)} -> ${compassExportTaskListUrl(rawParams)} -> ${compassExportFileUrl(rawParams)}`,
      })
    }
    return {
      rows: [row],
      total: downloadFile ? 1 : 0,
      pages: 0,
      dateRange,
      mode: 'backend_export',
      downloaded: Boolean(downloadFile?.base64),
      downloadReady: Boolean(downloadFile?.base64 || downloadFile?.downloadUrl),
      taskId,
      downloadStatus: status,
    }
  }

  async function collectCompassSalesRowsByTable(rawParams = params) {
    const dateRange = extractCompassDateRange(rawParams)
    const pageSize = getPageSize('compass', rawParams)
    const maxPages = getMaxPages(rawParams)
    const result = await collectPagedRows({
      url: GOODS_DETAIL_URL,
      pageSize,
      maxPages,
      buildPayload: (pageNo, size) => buildGoodsDetailPayload(pageNo, size, dateRange, rawParams),
      extractRows: json => Array.isArray(json?.data?.goodsList) ? json.data.goodsList : [],
      extractTotal: json => json?.data?.total,
    })
    const normalizedRows = result.rows
      .filter(row => compassRowMatchesBrand(row, rawParams))
      .map(normalizeCompassSalesRow)
    return {
      rows: normalizedRows,
      total: result.total,
      pages: result.pages,
      dateRange,
      mode: 'table_api',
    }
  }

  async function collectCompassSalesRows(rawParams = params) {
    if (parseBooleanFlag(rawParams.compass_table_api, false)) {
      return collectCompassSalesRowsByTable(rawParams)
    }
    const dateRange = extractCompassDateRange(rawParams)
    try {
      return await collectCompassSalesRowsByExport(rawParams)
    } catch (error) {
      if (parseBooleanFlag(rawParams.compass_export_required, false)) throw error
      if (!parseBooleanFlag(rawParams.compass_table_fallback, false)) {
        return {
          rows: [buildCompassExportFailureRow(error, dateRange, rawParams)],
          total: 0,
          pages: 0,
          dateRange,
          mode: 'backend_export_failed',
          exportError: error.message || String(error),
        }
      }
      const tableResult = await collectCompassSalesRowsByTable(rawParams)
      return {
        ...tableResult,
        mode: 'table_fallback',
        exportError: error.message || String(error),
        rows: tableResult.rows.map(row => ({
          ...row,
          执行结果: '已抓取（后台导出不可用，降级页面表格）',
          备注: `后台导出失败，已降级到页面表格接口，可能受 10000 条上限影响：${error.message || error}`,
        })),
      }
    }
  }

  function vipDirectLayerLabel(value) {
    const text = compact(value)
    const labels = {
      ALL: '汇总',
      CAMPAIGN: '推广计划',
      ADVERTISE: '广告',
      KEYWORDS: '关键词',
      PLACEMENT: '资源位',
      HOLE_SN: '坑位类型',
      ADVERTISE_HOLE_SN: '广告坑位',
    }
    return labels[text] || text || '汇总'
  }

  function normalizeVipDirectAdsRow(row, user = {}, payload = {}) {
    const stat = row?.statistics || {}
    const knownKeys = [
      'advertiserId', 'advertiserTitle', 'agentTitle', 'brandCategoryTitles', 'campaignId', 'campaignTitle',
      'adId', 'adTitle', 'advertiseId', 'keywordId', 'keywordTitle', 'searchWord', 'date', 'dateString',
      'deliveryChannel', 'deliveryChannelTitle', 'reportChannelType', 'reportChannelTypeTitle', 'site',
      'siteTitle', 'siteType', 'placementId', 'placementTitle', 'scheduleId', 'scheduleName',
      'statistics',
    ]
    const layer = vipDirectLayerLabel(payload.layer)
    const output = {
      __sheet_name: VZD_SHEET,
      报表来源: '唯直达投放效果',
      数据分组: layer,
      品牌名称: compact(user.advertiserTitle || row?.advertiserTitle),
      统计日期: formatDate(row?.dateString || row?.date),
      活动ID: firstNonEmpty(row?.campaignId, row?.campaignNo),
      活动名称: firstNonEmpty(row?.campaignTitle, row?.scheduleName),
      推广ID: firstNonEmpty(row?.adId, row?.advertiseId, row?.keywordId, row?.placementId),
      广告名称: compact(row?.adTitle),
      关键词: firstNonEmpty(row?.keywordTitle, row?.searchWord),
      营销渠道: firstNonEmpty(row?.reportChannelTypeTitle, row?.deliveryChannelTitle, '唯直达'),
      花费: formatCents(stat.cost),
      曝光量: compact(stat.impressionCount),
      点击量: compact(stat.clickCount),
      点击率: formatPercent(stat.clickRate),
      千次曝光均价: formatCents(stat.costPerMille),
      点击均价: formatCents(stat.costPerClick),
      APP端UV: compact(stat.appUV),
      小程序UV: compact(stat.miniappUV),
      商品详情页UV: compact(stat.detailUV1d),
      品牌UV: compact(stat.brandUV),
      '24小时收藏数(商家)': compact(stat.likeCnt1d),
      '24小时加购数(商家)': compact(stat.addcartCnt1d),
      '24小时加购成本(商家)': formatCents(stat.costPerAddcart1d),
      '24小时下单客户数(商家)': compact(stat.bookCustomerIn24Hour),
      '24小时下单量(商家)': compact(stat.bookOrdersIn24Hour),
      '24小时订单额(商家)': formatCents(stat.bookSalesIn24Hour),
      '24小时下单ROI(商家)': formatRatio(stat.bookRoiIn24Hour),
      '24小时成交客户数(商家)': compact(stat.customerIn24Hour),
      '24小时销售额(商家)': formatCents(stat.salesIn24Hour),
      '24小时成交ROI(商家)': formatRatio(stat.roiIn24Hour),
      '24小时收藏数(商品)': compact(stat.goodsLikeCnt1d),
      '24小时加购数(商品)': compact(stat.goodsAddcartCnt1d),
      '24小时加购成本(商品)': formatCents(stat.goodsCostPerAddcart1d),
      '24小时下单客户数(商品)': compact(stat.goodsBookCustomerIn24Hour),
      '24小时下单量(商品)': compact(stat.goodsBookOrdersIn24Hour),
      '24小时订单额(商品)': formatCents(stat.goodsBookSalesIn24Hour),
      '24小时下单ROI(商品)': formatRatio(stat.goodsBookRoiIn24Hour),
      '24小时成交客户数(商品)': compact(stat.goodsCustomerIn24Hour),
      '24小时销售额(商品)': formatCents(stat.goodsSalesIn24Hour),
      '24小时成交ROI(商品)': formatRatio(stat.goodsRoiIn24Hour),
      数据来源接口: VIPDIRECT_REPORT_TABLE_URL,
      执行结果: '已抓取',
      备注: '指标口径：唯直达 VSM/RTB，24小时商家与商品转化指标；接口为只读查询。',
    }
    return appendRawFields(output, row, knownKeys)
  }

  async function collectVipDirectSummaryRows(rawParams = params) {
    const dateRange = extractVipDirectDateRange(rawParams)
    const pageSize = getPageSize('vipdirect', rawParams)
    const maxPages = getMaxPages(rawParams)
    const user = await loadMarketingUser({ requireTmaxPermission: false })
    const rows = []
    let total = null
    let pages = 0
    let payloadForRows = null
    for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
      const payload = buildVipDirectReportPayload(pageNo, pageSize, dateRange, user, rawParams)
      payloadForRows = payload
      const json = await postJson(VIPDIRECT_REPORT_TABLE_URL, payload, { advid: user.advertiserId })
      const pageRows = Array.isArray(json?.data?.reports) ? json.data.reports : []
      const reportedTotal = Number(json?.pageInfo?.totalElements ?? json?.data?.page?.totalCount)
      if (Number.isFinite(reportedTotal) && reportedTotal > 0 && total == null) total = reportedTotal
      pages = pageNo
      rows.push(...pageRows)
      if (!pageRows.length) break
      if (total && rows.length >= total) break
      if (pageRows.length < pageSize) break
      await sleep(DEFAULT_DELAY_MS)
    }
    return {
      rows: rows.map(row => normalizeVipDirectAdsRow(row, user, payloadForRows || {})),
      total: total || rows.length,
      pages,
      dateRange,
      mode: 'summary_report',
      sourceLabel: '旧报表汇总接口',
    }
  }

  function buildVipDirectAdListPayload(pageNo, pageSize, dateRange, rawParams = params) {
    const payload = {
      uiStatus: parseList(rawParams.vipdirect_ui_status || rawParams.ui_status).length
        ? parseList(rawParams.vipdirect_ui_status || rawParams.ui_status)
        : ['PAUSED', 'ELIGIBLE', 'INELIGIBLE', 'PENDING', 'ENDED'],
      pauseCodes: parseList(rawParams.vipdirect_pause_codes || rawParams.pause_codes).length
        ? parseList(rawParams.vipdirect_pause_codes || rawParams.pause_codes)
        : ['USER_PAUSE', 'SYS_PAUSE', 'DEFAULT'],
      dealTypes: compact(rawParams.vipdirect_deal_types || rawParams.vipdirect_deal_type || rawParams.deal_type || '1') || '1',
      deliveryChannel: 104,
      start: dateRange.startMs,
      end: dateRange.endMs,
      pageIndex: pageNo,
      pageCount: pageSize,
      columnList: vipDirectColumnList(rawParams),
      auditStatuses: compact(rawParams.vipdirect_audit_statuses || rawParams.audit_statuses || '2,3,1') || '2,3,1',
      deepActionType: hasText(rawParams.vipdirect_deep_action_type || rawParams.deep_action_type)
        ? Number(rawParams.vipdirect_deep_action_type || rawParams.deep_action_type)
        : -1,
      operateSuggestionsTypes: hasText(rawParams.vipdirect_operate_suggestions_types || rawParams.operate_suggestions_types)
        ? Number(rawParams.vipdirect_operate_suggestions_types || rawParams.operate_suggestions_types)
        : -1,
      from: Number(rawParams.vipdirect_from || 20),
    }
    const passthrough = {
      name: rawParams.vipdirect_ad_name || rawParams.vipdirect_ad_title || rawParams.ad_title,
      campaignId: rawParams.vipdirect_campaign_id || rawParams.campaign_id,
      goodsId: rawParams.vipdirect_goods_id || rawParams.goods_id,
      adIds: rawParams.vipdirect_ad_ids || rawParams.ad_ids,
      orderByItem: rawParams.vipdirect_sort || rawParams.marketing_sort,
      orderBy: rawParams.vipdirect_orderby || rawParams.vipdirect_order_by || rawParams.marketing_orderby,
    }
    for (const [key, value] of Object.entries(passthrough)) {
      if (Array.isArray(value) && value.length) payload[key] = value
      else if (!Array.isArray(value) && hasText(value)) payload[key] = value
    }
    if (hasText(payload.adIds) && typeof payload.adIds === 'string') payload.adIds = parseList(payload.adIds)
    return payload
  }

  function meaningfulGoodsId(...values) {
    for (const value of values) {
      const text = compact(value)
      if (text && text !== '0') return text
    }
    return ''
  }

  function vipDirectMid(rawParams = params) {
    return compact(rawParams.vipdirect_mid || rawParams.mid)
  }

  function extractVipDirectAdListRows(json) {
    for (const value of [
      json?.data?.ads,
      json?.data?.adList,
      json?.data?.list,
      json?.data?.rows,
      json?.data?.records,
      json?.data?.items,
      json?.data?.data,
      json?.data?.data?.list,
      json?.data?.data?.rows,
      json?.data?.data?.records,
      json?.data?.page?.list,
      json?.data?.page?.rows,
      json?.data?.pageResult?.list,
      json?.data?.pageResult?.rows,
      json?.ads,
      json?.rows,
      json?.list,
    ]) {
      if (Array.isArray(value)) return value
    }
    return []
  }

  function extractVipDirectTotal(json, rowsLength) {
    const candidates = [
      json?.pageInfo?.totalElements,
      json?.pageInfo?.total,
      json?.data?.pageInfo?.totalElements,
      json?.data?.pageInfo?.total,
      json?.data?.page?.totalCount,
      json?.data?.page?.total,
      json?.data?.pageResult?.total,
      json?.data?.pageResult?.totalCount,
      json?.data?.totalElements,
      json?.data?.count,
      json?.data?.total,
      json?.total,
    ]
    for (const candidate of candidates) {
      const number = Number(candidate)
      if (Number.isFinite(number) && number >= 0) return number
    }
    return rowsLength
  }

  function extractAdGoodsRows(row) {
    const listCandidates = [
      row?.goodsList,
      row?.goodsInfos,
      row?.goodsInfoList,
      row?.productList,
      row?.products,
      row?.adGoodsList,
      row?.wakeupContent?.goodsList,
    ]
    for (const value of listCandidates) {
      if (Array.isArray(value) && value.length) return value
    }
    const singleCandidates = [
      row?.goods,
      row?.goodsInfo,
      row?.product,
      row?.wakeupContent,
      row?.dpaContent,
    ]
    for (const value of singleCandidates) {
      if (value && typeof value === 'object' && Object.keys(value).some(key => /goods|spu|mid|product|image/i.test(key))) {
        return [value]
      }
    }
    const directGoodsId = meaningfulGoodsId(
      row?.wakeupContent?.destId,
      row?.wakeupContent?.spuId,
      row?.goodsId,
      row?.spuId,
      row?.mid,
      row?.sdpaGoodsId,
      row?.wakeupContent?.goodsId,
    )
    return directGoodsId ? [{ goodsId: directGoodsId }] : [{}]
  }

  function statValue(row, ...keys) {
    const stat = row?.statistics || {}
    for (const key of keys) {
      const value = firstNonEmpty(stat[key], row?.[key])
      if (hasText(value)) return value
    }
    return ''
  }

  function normalizeVipDirectAdGoodsRow(row, goods = {}, user = {}, payload = {}) {
    const knownKeys = [
      'advertiserId', 'advertiserTitle', 'campaignId', 'campaignTitle', 'adId', 'advertiseId',
      'adTitle', 'title', 'name', 'deliveryChannel', 'deliveryChannelTitle', 'dealType',
      'chargeType', 'uiStatus', 'uiStatusTitle', 'status', 'statusTitle', 'statistics',
      'goodsList', 'goodsInfos', 'goodsInfoList', 'productList', 'products', 'wakeupContent',
    ]
    const goodsId = meaningfulGoodsId(
      goods?.destId,
      goods?.spuId,
      goods?.goodsId,
      goods?.mid,
      goods?.productId,
      goods?.merchandiseNo,
      row?.wakeupContent?.destId,
      row?.wakeupContent?.spuId,
      row?.goodsId,
      row?.spuId,
      row?.mid,
      row?.sdpaGoodsId,
      row?.wakeupContent?.goodsId,
    )
    const startYmd = (payload.start || payload.startDate) ? ymdFromOffsetMs(payload.start || payload.startDate) : ''
    const endYmd = (payload.end || payload.endDate || payload.start || payload.startDate)
      ? ymdFromOffsetMs(payload.end || payload.endDate || payload.start || payload.startDate)
      : ''
    const statDate = startYmd ? `${formatDate(startYmd)} 至 ${formatDate(endYmd || startYmd)}` : ''
    const knownGoodsKeys = [
      'spuId', 'goodsId', 'mid', 'productId', 'merchandiseNo', 'goodsNo', 'outerId', 'sn',
      'vendorGoodsId', 'goodsName', 'productName', 'title', 'name', 'imageUrl', 'imgUrl', 'image', 'picUrl',
    ]
    const output = {
      __sheet_name: VZD_SHEET,
      报表来源: '唯直达投放效果',
      数据分组: '广告商品明细',
      品牌名称: compact(user.advertiserTitle || row?.advertiserTitle || row?.advertiser?.title),
      统计日期: statDate,
      活动ID: firstNonEmpty(row?.campaignId, row?.campaignNo, row?.promotionId),
      活动名称: firstNonEmpty(row?.campaignTitle, row?.campaignName, row?.promotionTitle),
      推广ID: firstNonEmpty(row?.adId, row?.advertiseId, row?.id),
      广告名称: firstNonEmpty(row?.adTitle, row?.title, row?.name),
      广告状态: firstNonEmpty(row?.uiStatusTitle, row?.statusTitle, row?.uiStatus, row?.status),
      商品ID: goodsId,
      MID: firstNonEmpty(goods?.mid, row?.mid, goodsId),
      货号: firstNonEmpty(goods?.goodsNo, goods?.outerId, goods?.sn, goods?.vendorGoodsId),
      商品名称: firstNonEmpty(goods?.goodsName, goods?.productName, goods?.title, goods?.name),
      图片链接: firstNonEmpty(goods?.imageUrl, goods?.imgUrl, goods?.image, goods?.picUrl),
      投放资源: firstNonEmpty(row?.deliveryChannelTitle, '唯直达'),
      营销渠道: firstNonEmpty(row?.deliveryChannelTitle, '唯直达'),
      计费类型: firstNonEmpty(row?.chargeTypeTitle, row?.chargeType),
      花费: formatCents(statValue(row, 'cost')),
      曝光量: statValue(row, 'impressionCount'),
      点击量: statValue(row, 'clickCount'),
      点击率: formatPercent(statValue(row, 'clickRate')),
      千次曝光均价: formatCents(statValue(row, 'costPerMille')),
      点击均价: formatCents(statValue(row, 'costPerClick')),
      APP端UV: statValue(row, 'appUV', 'appUv', 'appWakenUV'),
      小程序UV: statValue(row, 'miniappUV', 'miniappUv'),
      商品详情页UV: statValue(row, 'detailUV1d', 'detailUv1d'),
      品牌UV: statValue(row, 'brandUV', 'brandUv'),
      '24小时收藏数(商家)': statValue(row, 'likeCnt1d'),
      '24小时加购数(商家)': statValue(row, 'addcartCnt1d'),
      '24小时加购成本(商家)': formatCents(statValue(row, 'costPerAddcart1d')),
      '24小时下单客户数(商家)': statValue(row, 'bookCustomerIn24Hour'),
      '24小时下单量(商家)': statValue(row, 'bookOrdersIn24Hour', 'bookOrders24Hour'),
      '24小时订单额(商家)': formatCents(statValue(row, 'bookSalesIn24Hour', 'bookSales24Hour')),
      '24小时下单ROI(商家)': formatRatio(statValue(row, 'bookRoiIn24Hour')),
      '24小时成交客户数(商家)': statValue(row, 'customerIn24Hour'),
      '24小时销售额(商家)': formatCents(statValue(row, 'salesIn24Hour')),
      '24小时成交ROI(商家)': formatRatio(statValue(row, 'roiIn24Hour')),
      '24小时收藏数(商品)': statValue(row, 'goodsLikeCnt1d'),
      '24小时加购数(商品)': statValue(row, 'goodsAddcartCnt1d'),
      '24小时加购成本(商品)': formatCents(statValue(row, 'goodsCostPerAddcart1d')),
      '24小时下单客户数(商品)': statValue(row, 'goodsBookCustomerIn24Hour'),
      '24小时下单量(商品)': statValue(row, 'goodsBookOrdersIn24Hour'),
      '24小时订单额(商品)': formatCents(statValue(row, 'goodsBookSalesIn24Hour')),
      '24小时下单ROI(商品)': formatRatio(statValue(row, 'goodsBookRoiIn24Hour')),
      '24小时成交客户数(商品)': statValue(row, 'goodsCustomerIn24Hour'),
      '24小时销售额(商品)': formatCents(statValue(row, 'goodsSalesIn24Hour')),
      '24小时成交ROI(商品)': formatRatio(statValue(row, 'goodsRoiIn24Hour')),
      数据来源接口: VIPDIRECT_AD_LIST_URL,
      执行结果: '已抓取',
      备注: '来源：推广 > 站内广告 > 唯直达 > 广告；按广告行展开商品ID。',
    }
    appendRawFields(output, row, knownKeys)
    return appendRawFields(output, goods, knownGoodsKeys, `${RAW_PREFIX}商品_`)
  }

  async function collectVipDirectAdGoodsRows(rawParams = params) {
    const dateRange = extractVipDirectDateRange(rawParams)
    const pageSize = getPageSize('vipdirect', rawParams)
    const maxPages = getMaxPages(rawParams)
    const user = await loadMarketingUser({ requireTmaxPermission: false })
    const rows = []
    let total = null
    let pages = 0
    let payloadForRows = null
    for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
      const payload = buildVipDirectAdListPayload(pageNo, pageSize, dateRange, rawParams)
      payloadForRows = payload
      const json = await postJson(VIPDIRECT_AD_LIST_URL, payload, { advid: user.advertiserId })
      const pageRows = extractVipDirectAdListRows(json)
      const reportedTotal = extractVipDirectTotal(json, pageRows.length)
      if (Number.isFinite(reportedTotal) && reportedTotal > 0 && total == null) total = reportedTotal
      pages = pageNo
      for (const row of pageRows) {
        const goodsRows = extractAdGoodsRows(row)
        for (const goods of goodsRows) {
          rows.push(normalizeVipDirectAdGoodsRow(row, goods, user, payloadForRows || {}))
        }
      }
      if (!pageRows.length) break
      if (total && pageNo * pageSize >= total) break
      if (pageRows.length < pageSize) break
      await sleep(DEFAULT_DELAY_MS)
    }
    return {
      rows,
      total: total || rows.length,
      pages,
      dateRange,
      mode: 'ad_goods_detail',
      sourceLabel: '广告页商品明细',
    }
  }

  function buildVipDirectProductInsightPayload(pageNo, pageSize, dateRange, rawParams = params) {
    const mid = vipDirectMid(rawParams)
    if (!mid) {
      throw new Error('商品洞察广告明细需要 MID；默认请使用广告页商品明细，或传 --vipdirect-mid 后再使用 product_insight。')
    }
    return {
      reportChannelTypeList: ['VSM'],
      startDate: dateRange.startMs,
      endDate: dateRange.endOfDayMs || dateRange.endMs,
      mid,
      columns: vipDirectColumnList(rawParams),
      searchTitle: compact(rawParams.vipdirect_search_title || rawParams.search_title),
      pageIndex: pageNo,
      pageCount: pageSize,
    }
  }

  async function collectVipDirectProductInsightRows(rawParams = params) {
    const dateRange = extractVipDirectDateRange(rawParams)
    const pageSize = getPageSize('vipdirect', rawParams)
    const maxPages = getMaxPages(rawParams)
    const user = await loadMarketingUser({ requireTmaxPermission: false })
    const rows = []
    let total = null
    let pages = 0
    for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
      const payload = buildVipDirectProductInsightPayload(pageNo, pageSize, dateRange, rawParams)
      const json = await postJson(VIPDIRECT_PRODUCT_INSIGHT_AD_LIST_URL, payload, { advid: user.advertiserId })
      const pageRows = extractVipDirectAdListRows(json)
      const reportedTotal = extractVipDirectTotal(json, pageRows.length)
      if (Number.isFinite(reportedTotal) && reportedTotal > 0 && total == null) total = reportedTotal
      pages = pageNo
      for (const row of pageRows) {
        rows.push({
          ...normalizeVipDirectAdGoodsRow(row, { mid: row.mid }, user, {
            start: dateRange.startMs,
            end: dateRange.endMs,
          }),
          数据来源接口: VIPDIRECT_PRODUCT_INSIGHT_AD_LIST_URL,
          备注: '来源：商品洞察 MID x 广告明细接口。',
        })
      }
      if (!pageRows.length) break
      if (total && pageNo * pageSize >= total) break
      if (pageRows.length < pageSize) break
      await sleep(DEFAULT_DELAY_MS)
    }
    return {
      rows,
      total: total || rows.length,
      pages,
      dateRange,
      mode: 'product_insight_ad_detail',
      sourceLabel: '商品洞察广告明细',
    }
  }

  async function collectVipDirectAdsRows(rawParams = params) {
    if (parseBooleanFlag(rawParams.vipdirect_summary_api, false)) {
      return collectVipDirectSummaryRows(rawParams)
    }
    if (compact(rawParams.vipdirect_detail_source).toLowerCase() === 'product_insight') {
      return collectVipDirectProductInsightRows(rawParams)
    }
    try {
      return await collectVipDirectAdGoodsRows(rawParams)
    } catch (error) {
      if (parseBooleanFlag(rawParams.vipdirect_no_product_insight_fallback, false)) throw error
      if (!vipDirectMid(rawParams)) {
        throw new Error(`${VIPDIRECT_AD_LIST_URL} 读取失败：${error.message || error}；未传 MID，已跳过商品洞察降级，避免 /product/insight/ad/list 空 MID 返回 1001 掩盖广告商品明细错误。`)
      }
      const fallback = await collectVipDirectProductInsightRows(rawParams)
      return {
        ...fallback,
        mode: `${fallback.mode}_fallback`,
        sourceLabel: `${fallback.sourceLabel}（广告页接口失败后降级）`,
        rows: fallback.rows.map(row => ({
          ...row,
          执行结果: '已抓取（广告页接口不可用，降级商品洞察）',
          备注: `${row.备注 || ''}；广告页接口 ${VIPDIRECT_AD_LIST_URL} 读取失败：${error.message || error}`.replace(/^；/, ''),
        })),
      }
    }
  }

  function normalizeTmaxGoodsRow(row, user = {}) {
    const stat = row?.statistics || {}
    const actionType = compact(row?.actionType)
    const chargeType = compact(row?.chargeType)
    return {
      __sheet_name: TMAX_SHEET,
      报表来源: 'T-max效果数据',
      数据分组: '商品打爆',
      品牌名称: compact(user.advertiserTitle || row?.advertiserTitle),
      活动ID: compact(row?.campaignId),
      活动名称: compact(row?.adsTitle),
      推广ID: compact(row?.adId),
      商品ID: compact(row?.spuId),
      货号: compact(row?.goodsId === '汇总' ? '' : row?.goodsId),
      商品名称: compact(row?.goodsName),
      运营方式: firstNonEmpty(row?.marketingSceneName, actionType ? `actionType=${actionType}` : ''),
      营销渠道: firstNonEmpty(row?.deliveryChannelName, hasText(row?.deliveryChannel) ? `deliveryChannel=${compact(row?.deliveryChannel)}` : ''),
      出价: formatCents(row?.bidPrice),
      行动出价: formatCents(row?.actionPrice),
      计费类型: chargeType,
      曝光人数: compact(stat.impressionCount),
      点击人数: compact(stat.clickCount),
      收藏数: compact(stat.goodsLikeCnt1d),
      加购数: compact(stat.goodsAddcartCnt1d),
      加购成本: formatCents(stat.goodsCostPerAddcart1d),
      销售额: formatCents(stat.goodsBookSalesIn24Hour),
      ROI: formatRatio(stat.goodsRoiIn24Hour),
      活动成本: formatCents(stat.cost),
      数据来源接口: TMAX_GOODS_REPORT_URL,
      执行结果: '已抓取',
      备注: '指标口径：商品 24 小时收藏、加购、加购成本、销售额、成交ROI；接口为只读查询。',
    }
  }

  async function loadMarketingUser(options = {}) {
    const requireTmaxPermission = options.requireTmaxPermission !== false
    const json = await getJson(MARKETING_CURRENT_USER_URL)
    const data = json?.data || {}
    const advertiserId = compact(data.advertiserId || data.advertiser?.id)
    const advertiserTitle = compact(data.advertiser?.title || data.advertiserTitle)
    const permissions = Array.isArray(data.permissions) ? data.permissions : []
    const privileges = data.privileges || {}
    const hasTmaxPermission = permissions.includes(TMAX_HOT_GOODS_PERMISSION) || Boolean(privileges[TMAX_HOT_GOODS_PERMISSION])
    if (!hasText(advertiserId)) throw new Error('营销平台当前用户未返回 advertiserId，无法读取营销报表。')
    if (requireTmaxPermission && !hasTmaxPermission) throw new Error(`当前营销平台账号缺少 ${TMAX_HOT_GOODS_PERMISSION} 权限。`)
    return { advertiserId, advertiserTitle, hasTmaxPermission }
  }

  async function collectTmaxGoodsRows(rawParams = params) {
    const dateRange = extractTmaxDateRange(rawParams)
    const pageSize = getPageSize('tmax', rawParams)
    const maxPages = getMaxPages(rawParams)
    const user = await loadMarketingUser({ requireTmaxPermission: true })
    const rows = []
    let total = null
    let pages = 0
    for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
      const url = buildTmaxGoodsReportUrl(pageNo, pageSize, dateRange, rawParams)
      const json = await getTmaxJson(url, user.advertiserId)
      const pageRows = Array.isArray(json?.data) ? json.data : []
      const reportedTotal = Number(json?.pageInfo?.totalElements)
      if (Number.isFinite(reportedTotal) && reportedTotal > 0 && total == null) total = reportedTotal
      pages = pageNo
      rows.push(...pageRows)
      if (!pageRows.length) break
      if (total && rows.length >= total) break
      if (pageRows.length < pageSize) break
      await sleep(DEFAULT_DELAY_MS)
    }
    return {
      rows: rows.map(row => normalizeTmaxGoodsRow(row, user)),
      total: total || rows.length,
      pages,
      dateRange,
    }
  }

  function brandHaystack(brand, root) {
    return [
      brand?.brandName,
      brand?.brandSn,
      brand?.vendorCode,
      brand?.vendorName,
      root?.vendorCode,
    ].map(compact).filter(Boolean).join(' ')
  }

  function selectBctBrand(json, keyword = '巴拉巴拉') {
    const root = json?.data || {}
    const brands = Array.isArray(root.brands) ? root.brands : (Array.isArray(root) ? root : [])
    if (!brands.length) throw new Error('中台未返回可用品牌，请确认当前账号有 BCT 策略效果权限。')
    const wanted = compact(keyword || '巴拉巴拉')
    const matched = wanted
      ? brands.find(brand => brandHaystack(brand, root).includes(wanted))
      : null
    const brand = matched || brands[0]
    const vendorId = brand.id ?? brand.vendorId ?? root.id ?? root.vendorId
    const vendorCode = compact(brand.vendorCode || root.vendorCode)
    const brandSn = brand.brandSn ?? brand.value
    if (!hasText(brandSn) || !hasText(vendorId)) {
      throw new Error('中台品牌信息缺少 brandSn/vendorId，无法构造策略效果查询。')
    }
    return {
      brandSn: compact(brandSn),
      brandName: compact(brand.brandName || brand.label),
      vendorCode,
      vendorId,
      matchedBy: matched ? '品牌关键词' : '首个可用品牌',
    }
  }

  function bctTaskTypesForGroup(group, rawParams = params) {
    if (group === 'lifecycle') {
      return parseNumberList(rawParams.bct_lifecycle_task_types || rawParams.lifecycle_task_types).length
        ? parseNumberList(rawParams.bct_lifecycle_task_types || rawParams.lifecycle_task_types)
        : BCT_LIFECYCLE_TASK_TYPES
    }
    return parseNumberList(rawParams.bct_scene_task_types || rawParams.scene_task_types).length
      ? parseNumberList(rawParams.bct_scene_task_types || rawParams.scene_task_types)
      : BCT_SCENE_TASK_TYPES
  }

  function addOptionalPayloadField(payload, key, value) {
    if (Array.isArray(value) && value.length) payload[key] = value
    else if (!Array.isArray(value) && hasText(value)) payload[key] = value
  }

  function bctActivityRangeForGroup(group, rawParams = params) {
    if (group === 'lifecycle') {
      return {
        start: rawParams.bct_gift_activity_start || rawParams.gift_activity_start || rawParams.bct_activity_start || rawParams.activity_start,
        end: rawParams.bct_gift_activity_end || rawParams.gift_activity_end || rawParams.bct_activity_end || rawParams.activity_end,
      }
    }
    return {
      start: rawParams.bct_scene_activity_start || rawParams.scene_activity_start || rawParams.bct_activity_start || rawParams.activity_start,
      end: rawParams.bct_scene_activity_end || rawParams.scene_activity_end || rawParams.bct_activity_end || rawParams.activity_end,
    }
  }

  function bctActivityFilterLabel(group, rawParams = params) {
    const range = bctActivityRangeForGroup(group, rawParams)
    const start = normalizeDateTime(range.start)
    const end = normalizeDateTime(range.end, true)
    if (!start && !end) return '未指定'
    return `${start || '未填'} 至 ${end || start}`
  }

  function buildBctToolboxPayload(group, pageNum, pageSize, brand, rawParams = params) {
    const payload = {
      vendorId: brand.vendorId,
      taskTypeList: bctTaskTypesForGroup(group, rawParams),
      source: Number(rawParams.bct_source ?? rawParams.source ?? 0) || 0,
      pageNum,
      pageSize,
    }

    addOptionalPayloadField(payload, 'taskName', rawParams.bct_task_name || rawParams.task_name)
    addOptionalPayloadField(payload, 'couponNos', parseList(rawParams.bct_coupon_nos || rawParams.coupon_nos))
    addOptionalPayloadField(payload, 'promotionNos', parseList(rawParams.bct_promotion_nos || rawParams.promotion_nos))
    addOptionalPayloadField(payload, 'statusList', parseNumberList(rawParams.bct_status_list || rawParams.status_list))
    addOptionalPayloadField(payload, 'idList', parseList(rawParams.bct_id_list || rawParams.id_list))
    addOptionalPayloadField(payload, 'jointTaskId', rawParams.bct_joint_task_id || rawParams.joint_task_id)

    const activityRange = bctActivityRangeForGroup(group, rawParams)
    const activityStart = normalizeDateTime(activityRange.start)
    const activityEnd = normalizeDateTime(activityRange.end, true)
    addOptionalPayloadField(payload, 'startTimeBegin', activityStart)
    addOptionalPayloadField(payload, 'startTimeEnd', activityEnd || activityStart)

    const createStart = normalizeDateTime(rawParams.bct_create_start || rawParams.create_start)
    const createEnd = normalizeDateTime(rawParams.bct_create_end || rawParams.create_end, true)
    addOptionalPayloadField(payload, 'createTimeBegin', createStart)
    addOptionalPayloadField(payload, 'createTimeEnd', createEnd || createStart)

    return payload
  }

  function formatBctChannels(value) {
    if (Array.isArray(value)) return value.map(compact).filter(Boolean).join('、')
    return compact(value).split(',').map(compact).filter(Boolean).join('、')
  }

  function normalizeBctTaskRow(row, group, brand) {
    const sheet = group === 'lifecycle' ? BCT_GIFT_SHEET : BCT_SCENE_SHEET
    const sourceLabel = group === 'lifecycle' ? '中台营销：礼金' : '中台营销：购物车和跨品类券'
    const usageQuantity = firstNonEmpty(
      row.useNum, row.usedNum, row.useQuantity, row.usedQuantity, row.couponUseNum, row.couponUsedNum
    )
    const knownKeys = [
      'activityCost', 'appendGoodsNum', 'buyAmt', 'buyTotal', 'couponNo', 'couponNos', 'createTime',
      'customNum', 'endTime', 'exposureUserNum', 'id', 'jointTaskId', 'newUserNum', 'offlinePerson',
      'offlineStatus', 'offlineTime', 'orderNum', 'promotionNo', 'roi', 'sceneType', 'startTime',
      'status', 'taskChannels', 'taskName', 'taskType', 'unitPrice', 'userNum', 'userSalePer',
      'uspGroupCnt', 'uspGroupName', 'visitorNum', 'touchUserNum', 'marketUserNum',
      'useUser', 'usedUserNum', 'usedPeopleNum', 'useNum', 'usedNum', 'useQuantity',
      'usedQuantity', 'couponUseNum', 'couponUsedNum',
    ]
    const taskType = Number(row.taskType)
    const status = Number(row.status)
    const output = {
      __sheet_name: sheet,
      报表来源: sourceLabel,
      数据分组: group === 'lifecycle' ? '用户生命周期运营' : '场景营销',
      品牌编码: compact(brand.brandSn),
      品牌名称: compact(brand.brandName),
      供应商编码: compact(brand.vendorCode),
      活动ID: compact(row.id || row.taskId),
      联合提报ID: compact(row.jointTaskId),
      活动名称: compact(row.taskName),
      人群名称: compact(row.uspGroupName),
      运营方式: compact(row.taskTypeName || BCT_TASK_TYPE_LABELS[taskType] || row.taskType),
      营销渠道: formatBctChannels(row.taskChannels),
      活动状态: compact(row.statusName || BCT_STATUS_LABELS[status] || row.status),
      计划开始: compact(row.startTime),
      计划结束: compact(row.endTime),
      创建时间: compact(row.createTime),
      下线时间: compact(row.offlineTime),
      下线人: compact(row.offlinePerson),
      券ID: joinList(row.couponNos || row.couponNo),
      推广ID: compact(row.promotionNo),
      触达用户数: firstNonEmpty(row.touchUserNum, row.marketUserNum),
      曝光人数: compact(row.exposureUserNum),
      访问人数: compact(row.visitorNum),
      客户数: firstNonEmpty(row.customNum, row.userNum),
      已使用人数: firstNonEmpty(row.useUser, row.usedUserNum, row.usedPeopleNum),
      [group === 'lifecycle' ? '使用量' : '用券量']: usageQuantity,
      销售额: firstNonEmpty(row.buyTotal, row.buyAmt),
      订单数: compact(row.orderNum),
      客单价: firstNonEmpty(row.userSalePer, row.unitPrice),
      活动成本: compact(row.activityCost),
      ROI: compact(row.roi),
      数据来源接口: BCT_TOOLBOX_LIST_URL,
      执行结果: '已抓取',
      备注: '',
    }
    return appendRawFields(output, row, knownKeys)
  }

  async function collectBctGroupRows(group, brand, rawParams = params) {
    const exportConfig = bctProductEffectExportConfig(rawParams)
    const formData = buildBctProductEffectFormData(group, brand, exportConfig, rawParams)
    const submittedAtMs = Date.now()
    const submitJson = await submitBctDownloadTask(exportConfig.configKey, formData, brand.brandSn)
    const submittedTaskId = extractBctDownloadTaskId(submitJson)
    const matchContext = {
      configKey: exportConfig.configKey,
      submittedAtMs,
      taskId: submittedTaskId,
      formData,
      group,
    }
    let downloadTask = null
    let downloadFile = null
    let downloadError = ''
    if (bctDownloadWaitMs(rawParams) > 0) {
      try {
        const waitResult = await waitForBctDownloadTask(brand.brandSn, matchContext, rawParams)
        downloadTask = waitResult.task
        if (downloadTask && Number(downloadTask.status) === 2) {
          downloadFile = await downloadBctTaskFile(downloadTask)
        }
      } catch (error) {
        downloadError = error.message || String(error)
      }
    }
    return {
      rows: [buildBctProductEffectExportRow({
        group,
        brand,
        exportConfig,
        formData,
        submitJson,
        submittedTaskId,
        downloadTask,
        downloadFile,
        downloadError,
      })],
      total: downloadFile ? 1 : 0,
      pages: 0,
      activityFilter: bctActivityFilterLabel(group, rawParams),
      exportConfig,
      submittedTaskId,
      downloadStatus: compact(downloadTask?.status),
      downloaded: Boolean(downloadFile?.base64),
      downloadReady: Boolean(downloadFile?.base64 || downloadFile?.downloadUrl),
    }
  }

  function bctStrategyTypeForGroup(group) {
    return group === 'lifecycle' ? '2' : '3'
  }

  function bctStrategyLabelForGroup(group) {
    return group === 'lifecycle' ? '用户生命周期运营' : '场景营销'
  }

  function bctProductEffectExportConfig(rawParams = params) {
    const raw = compact(
      rawParams.bct_product_export_type
      || rawParams.bct_export_type
      || rawParams.product_export_type
      || '',
    ).toLowerCase()
    if (['1', 'daily', 'day', 'detail', '明细', '每日', '商品每日新增效果数据明细'].includes(raw)) {
      return BCT_PRODUCT_EFFECT_EXPORTS.daily
    }
    return BCT_PRODUCT_EFFECT_EXPORTS.summary
  }

  function bctDownloadWaitMs(rawParams = params) {
    const seconds = Number(rawParams.bct_download_wait_seconds ?? rawParams.download_wait_seconds ?? 120)
    if (!Number.isFinite(seconds) || seconds <= 0) return 0
    return Math.max(0, Math.min(600, seconds)) * 1000
  }

  function bctDownloadPollMs(rawParams = params) {
    const seconds = Number(rawParams.bct_download_poll_seconds ?? rawParams.download_poll_seconds ?? 5)
    if (!Number.isFinite(seconds) || seconds <= 0) return 5000
    return Math.max(1000, Math.min(30000, seconds * 1000))
  }

  function bctProductTaskIdsForGroup(group, rawParams = params) {
    const specific = group === 'lifecycle'
      ? rawParams.bct_gift_task_ids || rawParams.bct_lifecycle_task_ids
      : rawParams.bct_scene_task_ids
    return parseList(specific || rawParams.bct_task_ids || rawParams.product_effect_task_ids)
  }

  function buildBctProductEffectFilter(group, brand, rawParams = params) {
    const filter = buildBctToolboxPayload(group, 1, getPageSize('bct', rawParams), brand, rawParams)
    for (const key of ['vendorId', 'source', 'pageNum', 'pageNo', 'pageSize']) delete filter[key]
    filter.strategyType = bctStrategyTypeForGroup(group)
    return filter
  }

  function buildBctProductEffectFormData(group, brand, exportConfig, rawParams = params) {
    const taskIds = bctProductTaskIdsForGroup(group, rawParams)
    if (taskIds.length) {
      return {
        taskIds,
        brandSn: brand.brandSn,
        exportType: exportConfig.exportType,
      }
    }
    return {
      brandSn: brand.brandSn,
      exportType: exportConfig.exportType,
      filter: buildBctProductEffectFilter(group, brand, rawParams),
    }
  }

  async function submitBctDownloadTask(configKey, formData, brandSn) {
    return postJson(BCT_DOWNLOAD_CENTER_ADD_URL, {
      configKey,
      param: JSON.stringify(formData),
      brandSn,
    })
  }

  function extractBctDownloadTaskId(json) {
    const candidates = [
      json?.data?.taskId,
      json?.data?.id,
      json?.data?.downloadTaskId,
      json?.data,
      json?.taskId,
      json?.id,
    ]
    for (const candidate of candidates) {
      if (['string', 'number'].includes(typeof candidate) && hasText(candidate)) return compact(candidate)
    }
    return ''
  }

  function extractBctDownloadTasks(json) {
    const data = json?.data || {}
    for (const value of [data.taskModelList, data.records, data.list, data.rows]) {
      if (Array.isArray(value)) return value
    }
    return []
  }

  function millisFromValue(value) {
    if (value == null || value === '') return 0
    const number = Number(value)
    if (Number.isFinite(number)) return number < 1000000000000 ? number * 1000 : number
    const parsed = Date.parse(compact(value).replace(/-/g, '/'))
    return Number.isFinite(parsed) ? parsed : 0
  }

  function bctDownloadTaskId(task) {
    return compact(task?.taskId || task?.id || task?.taskNo || task?.downloadTaskId)
  }

  function bctDownloadTaskMatches(task, context) {
    const expectedTaskId = compact(context.taskId)
    if (expectedTaskId && bctDownloadTaskId(task) === expectedTaskId) return true
    const createdAtMs = millisFromValue(task?.createTime)
    if (createdAtMs && createdAtMs < context.submittedAtMs - 120000) return false
    const text = [
      task?.fileName,
      task?.taskName,
      task?.configKey,
      task?.downModel,
      task?.downModel?.url,
      task?.downModel?.param,
      task?.downModel?.fileLink,
    ].map(rawValue).join(' ')
    return text.includes(context.configKey) || /商品.*效果|效果.*商品|商品汇总|商品每日|toolTaskMid/i.test(text)
  }

  async function waitForBctDownloadTask(brandSn, context, rawParams = params) {
    const startedAtMs = Date.now()
    const waitMs = bctDownloadWaitMs(rawParams)
    const pollMs = bctDownloadPollMs(rawParams)
    let lastTask = null
    while (Date.now() - startedAtMs <= waitMs) {
      const json = await postJson(BCT_DOWNLOAD_CENTER_PAGE_URL, {
        pageNo: 1,
        pageSize: 20,
        brandSn,
        createStartTime: context.submittedAtMs - 120000,
      })
      const tasks = extractBctDownloadTasks(json)
      const matched = tasks.find(task => bctDownloadTaskMatches(task, context))
      if (matched) {
        lastTask = matched
        if ([2, 3, 4].includes(Number(matched.status))) break
      }
      await sleep(pollMs)
    }
    return { task: lastTask }
  }

  function normalizeDownModel(task) {
    const model = task?.downModel
    if (!model) return null
    if (typeof model === 'string') {
      try {
        return JSON.parse(model)
      } catch (error) {
        return null
      }
    }
    return model
  }

  async function downloadBctTaskFile(task) {
    const model = normalizeDownModel(task)
    if (!model) throw new Error('下载中心任务未返回 downModel。')
    if (compact(model.downType) === 'FILE_LINK') {
      if (!hasText(model.fileLink)) throw new Error('下载中心 FILE_LINK 未返回 fileLink。')
      try {
        const file = await getBlob(model.fileLink)
        return {
          ...file,
          fileName: file.fileName || compact(task.fileName) || 'bct-product-effect.xlsx',
          downType: 'FILE_LINK',
        }
      } catch (error) {
        return deferredDownloadFile({
          url: model.fileLink,
          method: 'GET',
          fileName: compact(task.fileName) || 'bct-product-effect.xlsx',
          downType: 'FILE_LINK',
          fetchError: error.message || String(error),
        })
      }
    }
    if (model?.param && model?.url && compact(model?.downType) === 'FILE_SECURITY') {
      const payload = parseJsonObject(model.param)
      const modelUrl = compact(model.url)
      const securityUrl = BCT_FILE_SECURITY_DOWN_URL
      try {
        const file = await firstSuccessfulBlobDownload([
          { label: `${securityUrl} JSON`, fetcher: () => postBlob(securityUrl, payload) },
          modelUrl && modelUrl !== securityUrl
            ? { label: `${modelUrl} JSON`, fetcher: () => postBlob(modelUrl, payload) }
            : null,
          { label: `${securityUrl} FormData`, fetcher: () => postFormBlob(securityUrl, payload) },
          { label: `${securityUrl} query`, fetcher: () => getBlob(withQuery(securityUrl, payload)) },
        ])
        return {
          ...file,
          fileName: file.fileName || compact(task.fileName) || 'bct-product-effect.xlsx',
          downType: 'FILE_SECURITY',
        }
      } catch (error) {
        return deferredDownloadFile({
          url: securityUrl,
          method: 'POST',
          payload,
          fileName: compact(task.fileName) || 'bct-product-effect.xlsx',
          downType: 'FILE_SECURITY',
          fetchError: error.message || String(error),
        })
      }
    }
    if (!hasText(model.url)) throw new Error('下载中心任务未返回下载 URL。')
    let payload = {}
    if (hasText(model.param)) {
      try {
        payload = JSON.parse(model.param)
      } catch (error) {
        throw new Error('下载中心 downModel.param 不是合法 JSON。')
      }
    }
    try {
      const file = await postBlob(model.url, payload)
      return {
        ...file,
        fileName: file.fileName || compact(task.fileName) || 'bct-product-effect.xlsx',
        downType: compact(model.downType || 'CUSTOMIZE'),
      }
    } catch (error) {
      return deferredDownloadFile({
        url: model.url,
        method: 'POST',
        payload,
        fileName: compact(task.fileName) || 'bct-product-effect.xlsx',
        downType: compact(model.downType || 'CUSTOMIZE'),
        fetchError: error.message || String(error),
      })
    }
  }

  function safeJson(value) {
    try {
      return JSON.stringify(value)
    } catch (error) {
      return rawValue(value)
    }
  }

  function buildBctProductEffectExportRow(options) {
    const {
      group,
      brand,
      exportConfig,
      formData,
      submitJson,
      submittedTaskId,
      downloadTask,
      downloadFile,
      downloadError,
    } = options
    const sheet = group === 'lifecycle' ? BCT_GIFT_SHEET : BCT_SCENE_SHEET
    const sourceLabel = group === 'lifecycle' ? '中台营销：礼金' : '中台营销：购物车和跨品类券'
    const taskId = bctDownloadTaskId(downloadTask) || submittedTaskId || extractBctDownloadTaskId(submitJson)
    const status = compact(downloadTask?.status)
    const statusLabel = status ? (BCT_DOWNLOAD_STATUS_LABELS[Number(status)] || status) : '已提交'
    const result = downloadFile?.base64
      ? '已下载商品效果文件'
      : (downloadFile?.downloadUrl ? '已获取下载链接待解析' : (downloadError ? '下载文件读取失败' : (Number(status) === 3 ? '下载中心生成失败' : '已提交下载中心')))
    const context = {
      sheet,
      sourceLabel,
      groupLabel: bctStrategyLabelForGroup(group),
      brandSn: brand.brandSn,
      brandName: brand.brandName,
      vendorCode: brand.vendorCode,
      exportLabel: exportConfig.label,
      configKey: exportConfig.configKey,
      taskId,
    }
    const output = {
      __sheet_name: sheet,
      报表来源: sourceLabel,
      数据分组: bctStrategyLabelForGroup(group),
      品牌编码: compact(brand.brandSn),
      品牌名称: compact(brand.brandName),
      供应商编码: compact(brand.vendorCode),
      商品效果导出类型: exportConfig.label,
      下载中心配置: exportConfig.configKey,
      下载中心任务ID: taskId,
      下载中心状态: statusLabel,
      下载文件名: compact(downloadFile?.fileName || downloadTask?.fileName),
      下载文件类型: compact(downloadFile?.contentType || downloadFile?.downType),
      下载文件字节数: downloadFile?.byteLength || '',
      筛选策略类型: bctStrategyTypeForGroup(group),
      筛选条件: safeJson(formData.filter || {}),
      选中活动ID: joinList(formData.taskIds),
      销售额: '',
      订单数: '',
      客户数: '',
      活动成本: '',
      ROI: '',
      数据来源接口: `${BCT_DOWNLOAD_CENTER_ADD_URL} -> ${BCT_DOWNLOAD_CENTER_PAGE_URL}`,
      执行结果: result,
      备注: [
        '来源：右上角「批量导出商品效果」',
        `配置：${exportConfig.configKey}`,
        formData.taskIds?.length ? `按已选活动 ${formData.taskIds.length} 个导出` : '按当前筛选条件导出前1000条活动的商品效果',
        downloadError ? `下载/解析待处理：${downloadError}` : '',
      ].filter(Boolean).join('；'),
    }
    if (downloadFile?.base64 || downloadFile?.downloadUrl) {
      output.__attachment_base64 = downloadFile.base64 || ''
      output.__attachment_file_name = downloadFile.fileName || compact(downloadTask?.fileName) || 'bct-product-effect.xlsx'
      output.__attachment_content_type = downloadFile.contentType || ''
      output.__attachment_sheet_name = sheet
      output.__attachment_download_url = downloadFile.downloadUrl || ''
      output.__attachment_download_method = downloadFile.downloadMethod || ''
      output.__attachment_download_payload = downloadFile.downloadPayload || ''
      output.__attachment_download_error = downloadFile.fetchError || ''
      output.__attachment_context = safeJson(context)
    }
    return output
  }

  async function loadBctBrand(rawParams = params) {
    const json = await getJson(BCT_AVAILABLE_BRAND_URL)
    return selectBctBrand(json, rawParams.brand_keyword || '巴拉巴拉')
  }

  function summaryRow(source, message, status = '完成') {
    return {
      __sheet_name: SUMMARY_SHEET,
      报表来源: source,
      数据分组: '',
      品牌编码: '',
      品牌名称: '',
      统计日期: '',
      活动ID: '',
      活动名称: '',
      运营方式: '',
      营销渠道: '',
      活动状态: '',
      计划开始: '',
      计划结束: '',
      创建时间: '',
      券ID: '',
      推广ID: '',
      商品ID: '',
      款号: '',
      货号: '',
      商品名称: '',
      销售额: '',
      订单额: '',
      客户数: '',
      订单数: '',
      收藏数: '',
      加购数: '',
      ROI: '',
      活动成本: '',
      数据来源接口: '',
      执行结果: status,
      备注: message,
    }
  }

  function marketingPreflightRow(sheet, source, route, requiredMetrics, href = currentHref(), bodyText = document?.body?.innerText || '') {
    const loggedIn = isMarketingLoggedInPage(href, bodyText)
    return {
      __sheet_name: sheet,
      报表来源: source,
      数据分组: route,
      数据来源接口: 'https://e.vip.com/upgrade.html',
      执行结果: loggedIn ? '待捕获登录后接口' : '需要营销平台登录',
      备注: [
        `需求截图路径：${route}`,
        `需导出/自定义列：${requiredMetrics.join('、')}`,
        loggedIn
          ? '当前检测到营销平台页面，但本次未捕获到登录后列表/导出 API；请先用此预检 sheet 保留操作路径，后续可补充官方导出接口。'
          : '当前 9222 会话打开营销平台后台会跳转 passport.vip.com 登录页，未拿到唯直达/T-max 登录后接口；脚本未伪造未验证 API。',
      ].join('；'),
    }
  }

  function buildMarketingPreflightRows(rawParams = params, href = currentHref(), bodyText = document?.body?.innerText || '') {
    const scope = normalizeScope(rawParams.report_scope)
    const rows = []
    if (hasScope(scope, 'vipdirect_ads')) {
      rows.push(marketingPreflightRow(
        VZD_SHEET,
        '唯直达投放效果',
        '推广 > 站内广告 > 唯直达 > 广告 > 导出 > 自定义列',
        ['商品ID', '广告名称', '24小时收藏数', '24小时下单客户数', '24小时订单额', '24小时成交ROI'],
        href,
        bodyText,
      ))
    }
    if (hasScope(scope, 'tmax_goods')) {
      rows.push(marketingPreflightRow(
        TMAX_SHEET,
        'T-max效果数据',
        'Target-Max > 商品打爆 > 商品 > 导出报表 > 自定义列',
        ['24小时收藏数', '加购数', '加购成本', '销售额', '成交ROI'],
        href,
        bodyText,
      ))
    }
    return rows
  }

  function nextPhaseAfterCompass(scope = normalizeScope()) {
    if (wantsAny(scope, ['bct_gift', 'bct_scene'])) return 'bct_reports'
    if (wantsAny(scope, ['vipdirect_ads', 'tmax_goods'])) return 'marketing_reports'
    return ''
  }

  function firstExecutionPhase(scope = normalizeScope()) {
    if (hasScope(scope, 'compass_sales_detail')) return 'compass_sales'
    const afterCompass = nextPhaseAfterCompass(scope)
    return afterCompass || 'marketing_reports'
  }

  function exposeHelpers() {
    if (!testExports) return
    Object.assign(testExports, {
      compact,
      normalizeCode,
      normalizeDateValue,
      normalizeDateTime,
      normalizeScope,
      hasScope,
      firstExecutionPhase,
      nextPhaseAfterCompass,
      extractCompassDateRange,
      buildGoodsDetailPayload,
      normalizeCompassSalesRow,
      COMPASS_FULL_EXPORT_FIELDS,
      buildCompassExportPayload,
      compassExportTaskMatches,
      collectCompassSalesRowsByExport,
      collectCompassSalesRowsByTable,
      extractVipDirectDateRange,
      buildVipDirectReportPayload,
      normalizeVipDirectAdsRow,
      collectVipDirectSummaryRows,
      buildVipDirectAdListPayload,
      normalizeVipDirectAdGoodsRow,
      collectVipDirectAdGoodsRows,
      buildVipDirectProductInsightPayload,
      collectVipDirectAdsRows,
      extractTmaxDateRange,
      buildTmaxGoodsReportUrl,
      normalizeTmaxGoodsRow,
      selectBctBrand,
      bctTaskTypesForGroup,
      bctActivityRangeForGroup,
      bctActivityFilterLabel,
      buildBctToolboxPayload,
      normalizeBctTaskRow,
      bctProductEffectExportConfig,
      bctStrategyTypeForGroup,
      buildBctProductEffectFilter,
      buildBctProductEffectFormData,
      extractBctDownloadTaskId,
      buildBctProductEffectExportRow,
      loadMarketingUser,
      collectTmaxGoodsRows,
      buildMarketingPreflightRows,
      isMarketingLoggedInPage,
      isCompassPage,
      isBctPage,
      getPageSize,
    })
  }

  exposeHelpers()
  if (phase === '__exports__') return complete([], shared)

  try {
    const scope = normalizeScope(params.report_scope)

    if (phase === 'main') {
      return nextPhase(firstExecutionPhase(scope), [], shared, 10)
    }

    if (phase === 'compass_sales') {
      if (!hasScope(scope, 'compass_sales_detail')) {
        const nextName = nextPhaseAfterCompass(scope)
        return nextName ? nextPhase(nextName, [], shared, 10) : complete([], shared)
      }
      if (!isCompassPage()) {
        location.href = COMPASS_PAGE_URL
        return nextPhase('compass_sales', [], { ...shared, compass_target_url: COMPASS_PAGE_URL }, 1800)
      }
      try {
        const result = await collectCompassSalesRows(params)
        const modeLabel = result.mode === 'backend_export'
          ? '后台下载导出'
          : (result.mode === 'backend_export_failed' ? '后台导出失败' : (result.mode === 'table_fallback' ? '后台导出失败后降级页面表格接口' : '页面表格接口'))
        const statusText = result.mode === 'backend_export'
          ? `；导出任务 ${result.taskId || '未返回'}；${result.downloaded ? '已下载待 CLI 解析' : (result.downloadReady ? '已取得下载链接待 CLI 解析' : `下载状态 ${result.downloadStatus || '已提交/生成中'}`)}`
          : (result.mode === 'backend_export_failed' ? '；未降级页面表格，避免 10000 条上限误导' : `；扫描 ${result.total} 行，实际输出 ${result.rows.length} 行，分页 ${result.pages} 页；页面表格接口可能受 10000 条上限影响`)
        const exportErrorText = result.exportError ? `；后台导出错误：${result.exportError}` : ''
        const rows = [
          summaryRow(
            '魔方罗盘销售明细',
            `商品明细日期 ${result.dateRange.startDt}-${result.dateRange.endDt}（${result.dateRange.source}）；模式 ${modeLabel}${statusText}${exportErrorText}；${compassBalaOnly(params) ? '只保留巴拉巴拉口径' : '未限制品牌'}`,
            result.mode === 'backend_export_failed' ? '部分失败' : (result.mode === 'backend_export' && !(result.downloaded || result.downloadReady) ? '已提交后台导出' : '完成'),
          ),
          ...result.rows,
        ]
        const nextName = nextPhaseAfterCompass(scope)
        const nextShared = {
          ...shared,
          compass_sales_rows: result.rows.length,
          compass_sales_total: result.total,
          compass_sales_pages: result.pages,
          compass_sales_mode: result.mode,
        }
        return nextName ? nextPhase(nextName, rows, nextShared, 600) : complete(rows, nextShared)
      } catch (error) {
        const rows = [
          summaryRow('魔方罗盘销售明细', `读取失败：${error.message || error}`, '部分失败'),
        ]
        const nextName = nextPhaseAfterCompass(scope)
        return nextName ? nextPhase(nextName, rows, { ...shared, compass_sales_error: error.message || String(error) }, 600) : complete(rows, shared)
      }
    }

    if (phase === 'bct_reports') {
      if (!wantsAny(scope, ['bct_gift', 'bct_scene'])) {
        return wantsAny(scope, ['vipdirect_ads', 'tmax_goods'])
          ? nextPhase('marketing_reports', [], shared, 10)
          : complete([], shared)
      }
      if (!isBctPage()) {
        location.href = BCT_PAGE_URL
        return nextPhase('bct_reports', [], { ...shared, bct_target_url: BCT_PAGE_URL }, 2200)
      }

      const rows = []
      const stats = {}
      try {
        const brand = await loadBctBrand(params)
        stats.bct_brand = `${brand.brandName || brand.brandSn}/${brand.vendorCode || ''}`
        if (hasScope(scope, 'bct_gift')) {
          const result = await collectBctGroupRows('lifecycle', brand, params)
          stats.bct_gift_rows = result.rows.length
          const readyText = result.downloaded ? '已下载待解析' : (result.downloadReady ? '已取得下载链接待 CLI 解析' : '请在下载中心查看生成进度')
          rows.push(summaryRow(
            '中台营销：礼金',
            `品牌 ${brand.brandName || brand.brandSn}（${brand.matchedBy}）；活动过滤 ${result.activityFilter}；已提交右上角「批量导出商品效果」${result.exportConfig.label}（${result.exportConfig.configKey}）；下载状态 ${result.downloadStatus || '已提交'}；${readyText}`,
            (result.downloaded || result.downloadReady) ? '完成' : '已提交下载中心',
          ))
          rows.push(...result.rows)
        }
        if (hasScope(scope, 'bct_scene')) {
          const result = await collectBctGroupRows('scene', brand, params)
          stats.bct_scene_rows = result.rows.length
          const readyText = result.downloaded ? '已下载待解析' : (result.downloadReady ? '已取得下载链接待 CLI 解析' : '请在下载中心查看生成进度')
          rows.push(summaryRow(
            '中台营销：购物车和跨品类券',
            `品牌 ${brand.brandName || brand.brandSn}（${brand.matchedBy}）；活动过滤 ${result.activityFilter}；已提交右上角「批量导出商品效果」${result.exportConfig.label}（${result.exportConfig.configKey}）；下载状态 ${result.downloadStatus || '已提交'}；${readyText}`,
            (result.downloaded || result.downloadReady) ? '完成' : '已提交下载中心',
          ))
          rows.push(...result.rows)
        }
      } catch (error) {
        rows.push(summaryRow('中台营销', `读取失败：${error.message || error}`, '部分失败'))
        stats.bct_error = error.message || String(error)
      }

      const nextShared = { ...shared, ...stats }
      return wantsAny(scope, ['vipdirect_ads', 'tmax_goods'])
        ? nextPhase('marketing_reports', rows, nextShared, 600)
        : complete(rows, nextShared)
    }

    if (phase === 'marketing_preflight' || phase === 'marketing_reports') {
      if (wantsAny(scope, ['vipdirect_ads', 'tmax_goods']) && !isMarketingLoggedInPage()) {
        const targetUrl = hasScope(scope, 'vipdirect_ads') ? VIPDIRECT_PAGE_URL : TMAX_PAGE_URL
        location.href = targetUrl
        return nextPhase('marketing_reports', [], { ...shared, marketing_target_url: targetUrl }, 2200)
      }

      const rows = []
      const stats = {}
      if (hasScope(scope, 'vipdirect_ads')) {
        try {
          const result = await collectVipDirectAdsRows(params)
          rows.push(summaryRow(
            '营销投放数据：唯直达',
            `唯直达广告商品明细 ${formatDate(result.dateRange.startYmd)}-${formatDate(result.dateRange.endYmd)}（${result.dateRange.source}）；来源 ${result.sourceLabel || '广告页商品明细'}；扫描广告 ${result.total} 行，输出商品广告明细 ${result.rows.length} 行，分页 ${result.pages} 页`,
            '完成',
          ))
          rows.push(...result.rows)
          stats.vipdirect_ads_rows = result.rows.length
          stats.vipdirect_ads_total = result.total
          stats.vipdirect_ads_pages = result.pages
        } catch (error) {
          rows.push(summaryRow('营销投放数据：唯直达', `读取失败：${error.message || error}`, '部分失败'))
          stats.vipdirect_ads_error = error.message || String(error)
        }
      }

      if (hasScope(scope, 'tmax_goods')) {
        try {
          const result = await collectTmaxGoodsRows(params)
          rows.push(summaryRow(
            '营销投放数据：T-max商品打爆',
            `T-max商品打爆 ${formatDate(result.dateRange.startYmd)}-${formatDate(result.dateRange.endYmd)}（${result.dateRange.source}）；扫描 ${result.total} 行，输出 ${result.rows.length} 行，分页 ${result.pages} 页`,
            '完成',
          ))
          rows.push(...result.rows)
          stats.tmax_goods_rows = result.rows.length
          stats.tmax_goods_total = result.total
          stats.tmax_goods_pages = result.pages
        } catch (error) {
          rows.push(summaryRow('营销投放数据：T-max商品打爆', `读取失败：${error.message || error}`, '部分失败'))
          stats.tmax_goods_error = error.message || String(error)
        }
      }
      return complete(rows, {
        ...shared,
        ...stats,
      })
    }

    return nextPhase(firstExecutionPhase(scope), [], shared, 10)
  } catch (error) {
    return { success: false, error: error.message || String(error) }
  }
})()
