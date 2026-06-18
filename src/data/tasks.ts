import { Task } from '../types';

const SYS = `你是一位名叫"小慢"的数字生活陪练员，正在耐心地帮助一位中老年人学习使用智能手机。
说话温暖、耐心，每次只讲一步。多鼓励。
遇到验证码、密码、转账、陌生链接必须先提醒风险。`;

export const TASKS: Task[] = [
  // ==================== 1. 线上挂号 ====================
  {
    id: 'guahao', title: '线上挂号', description: '在医院公众号上预约挂号',
    icon: 'hospital', iconBg: '#F9F0EF', category: 'health',
    steps: [
      {
        title: '打开微信，搜索医院公众号',
        detail: '打开微信，点顶部的 🔍 搜索框，输入医院名字，找到后点「关注」。',
        tip: '正规医院公众号名字旁有蓝色 ✓ 认证标志。',
        warning: '不要关注名字奇怪的公众号，可能是假的。',
        mockup: {
          appName: '微信', highlightLabel: '点搜索框，输入医院名',
          elements: [
            { type: 'input', placeholder: '🔍  搜索医院名称…' },
            { type: 'card', title: 'XX市人民医院', subtitle: '三甲医院 · 已认证 ✓' },
            { type: 'card', title: 'XX大学附属医院', subtitle: '三甲医院 · 已认证 ✓' },
            { type: 'button', label: '关注', color: 'green' },
          ],
        },
      },
      {
        title: '点击「预约挂号」菜单',
        detail: '进入公众号，点底部菜单栏的「就医服务」，再选「预约挂号」。',
        tip: '一般在底部菜单最左边或中间。',
        mockup: {
          appName: 'XX市人民医院', highlightLabel: '点这里 → 再选「预约挂号」',
          elements: [
            { type: 'text', text: '欢迎关注 XX市人民医院！', size: 'md' },
            { type: 'text', text: '本院提供在线挂号、报告查询等服务。', size: 'sm' },
            { type: 'list', items: ['就医服务 ▼', '个人中心', '医院介绍'] },
            { type: 'button', label: '预约挂号', color: 'green', primary: true },
            { type: 'button', label: '在线问诊', color: 'green' },
          ],
        },
      },
      {
        title: '选择科室',
        detail: '在科室列表里找到你要看的科，比如感冒看「内科」，牙疼看「口腔科」。',
        tip: '不确定挂哪个科就选「全科门诊」。',
        warning: '挂号前需绑定就诊卡或身份证，按提示填就行。',
        mockup: {
          appName: '预约挂号', highlightLabel: '点你需要的科室',
          elements: [
            { type: 'list', items: ['🫀 内科', '🦷 口腔科', '👁️ 眼科', '🦴 骨科', '👶 儿科', '🩺 全科门诊'] },
          ],
        },
      },
      {
        title: '选择日期和医生',
        detail: '挑一个有空的日子（绿色有号、灰色没号），再选一位医生。',
        tip: '专家号挂不上就先挂「普通门诊」，也能看好。',
        mockup: {
          appName: '选择医生', highlightLabel: '先选日期，再选医生',
          elements: [
            { type: 'text', text: '6月12日 周四', size: 'md' },
            { type: 'card', title: '张医生', subtitle: '主任医师 · 挂号费 ¥25 · 余号 8' },
            { type: 'card', title: '李医生', subtitle: '副主任医师 · 挂号费 ¥15 · 余号 3' },
            { type: 'button', label: '普通门诊 · ¥10 · 余号 15', color: 'green' },
          ],
        },
      },
      {
        title: '选择时间并确认',
        detail: '选一个时间段（建议选早一点），核对日期、医生、时间，点「确认挂号」。',
        warning: '确认前一定核对信息，不对就点返回重新选。',
        mockup: {
          appName: '确认挂号', highlightLabel: '核对后点这里',
          elements: [
            { type: 'card', title: '张医生 · 内科 · 6月12日' },
            { type: 'list', items: ['上午 9:00-9:30', '上午 10:00-10:30', '下午 14:00-14:30'] },
            { type: 'button', label: '确认挂号', color: 'green', primary: true },
          ],
        },
      },
      {
        title: '完成挂号',
        detail: '挂号成功！微信会收到通知。有些医院需要在线付挂号费，按提示支付即可。',
        tip: '截图保存挂号成功的页面，去医院时给工作人员看。',
        warning: '挂号费一般几十块，如果显示几百块说明可能选错了。',
        mockup: {
          appName: '挂号结果', highlightLabel: '',
          elements: [
            { type: 'text', text: '✅ 挂号成功！', size: 'md' },
            { type: 'card', title: '张医生 · 内科', subtitle: '6月12日 周四 9:00-9:30 · XX市人民医院' },
            { type: 'highlight-box', text: '⚠️ 请提前15分钟到院取号', color: 'orange' },
            { type: 'button', label: '查看挂号详情', color: 'blue' },
          ],
        },
      },
    ],
    systemPrompt: `${SYS}\n\n教老人微信挂号。提醒：实名认证不要在非官方渠道透露身份证。`,
  },

  // ==================== 2. 生活缴费 ====================
  {
    id: 'jiaofei', title: '生活缴费', description: '在手机上缴水电燃气费',
    icon: 'droplet', iconBg: '#EEF3F7', category: 'life',
    steps: [
      {
        title: '打开微信，进入「服务」',
        detail: '打开微信，点底部「我」→「服务」，找到「生活缴费」。',
        tip: '搜不到就直接在微信首页顶部搜索框搜「生活缴费」。',
        mockup: {
          appName: '微信 · 服务', highlightLabel: '点「生活缴费」',
          elements: [
            { type: 'icon-grid', icons: [
              { icon: '💧', label: '生活缴费' }, { icon: '📱', label: '手机充值' },
              { icon: '💰', label: '理财通' }, { icon: '🛡️', label: '保险服务' },
              { icon: '❤️', label: '医疗健康' }, { icon: '🚗', label: '交通出行' },
            ] },
          ],
        },
      },
      {
        title: '选择缴费类型',
        detail: '点你要缴的项目：水费、电费或燃气费。',
        mockup: {
          appName: '生活缴费', highlightLabel: '选你要缴的',
          elements: [
            { type: 'list', items: ['💧 水费', '⚡ 电费', '🔥 燃气费', '📞 固话宽带'] },
          ],
        },
      },
      {
        title: '输入缴费户号',
        detail: '户号在纸质账单右上角能找到。输完点「下一步」。',
        tip: '第一次输入后系统会记住，下次不用再输。',
        warning: '别扫陌生人给的缴费码，只在自己微信里操作。',
        mockup: {
          appName: '电费缴费', highlightLabel: '输入账单上的户号',
          elements: [
            { type: 'text', text: '请输入缴费户号', size: 'sm' },
            { type: 'input', placeholder: '户号（10位数字）' },
            { type: 'highlight-box', text: '💡 户号在纸质账单右上角', color: 'orange' },
            { type: 'button', label: '下一步', color: 'green', primary: true },
          ],
        },
      },
      {
        title: '确认金额并支付',
        detail: '核对金额和账单是否一致，确认后输入支付密码完成缴费。',
        tip: '缴费成功后截图保存。',
        warning: '金额不对就先别付，打客服电话问。',
        mockup: {
          appName: '确认缴费', highlightLabel: '核对金额后点支付',
          elements: [
            { type: 'card', title: '电费 · 户号 1234567890', subtitle: '2024年6月 · 欠费 ¥128.50' },
            { type: 'button', label: '立即缴费 ¥128.50', color: 'green', primary: true },
          ],
        },
      },
    ],
    systemPrompt: `${SYS}\n\n教老人微信缴水电燃气费。提醒：不要扫陌生人给的缴费二维码。`,
  },

  // ==================== 3. 打车导航 ====================
  {
    id: 'dache', title: '打车导航', description: '用手机叫车和导航',
    icon: 'car', iconBg: '#EEF3F7', category: 'life',
    steps: [
      {
        title: '打开滴滴出行',
        detail: '打开滴滴出行 App。屏幕上的蓝色圆点就是你当前位置。',
        tip: '看不到蓝色圆点说明定位没开，从屏幕顶部下滑打开「位置信息」。',
        mockup: {
          appName: '滴滴出行', highlightLabel: '蓝色圆点是你的位置',
          elements: [
            { type: 'input', placeholder: '你要去哪儿？' },
            { type: 'text', text: '📍 当前位置 · XX路', size: 'sm' },
            { type: 'card', title: '🏠 家', subtitle: 'XX小区' },
            { type: 'card', title: '🏥 XX市人民医院', subtitle: '上次去过' },
          ],
        },
      },
      {
        title: '输入目的地',
        detail: '在「你要去哪儿」框里输入目的地，比如「XX医院」，点出现的建议。',
        tip: '设置「家」的地址后，一键就能叫车回家。',
        mockup: {
          appName: '滴滴出行', highlightLabel: '输入目的地',
          elements: [
            { type: 'input', placeholder: 'XX市人民医院' },
            { type: 'card', title: 'XX市人民医院', subtitle: '距你 3.2 公里 · 预计 ¥18' },
            { type: 'card', title: 'XX市人民医院（东院）', subtitle: '距你 4.5 公里' },
          ],
        },
      },
      {
        title: '选车型，点呼叫',
        detail: '选快车（便宜）或出租车，点「呼叫」。',
        tip: '不赶时间选快车最实惠。下雨天会贵些。',
        warning: '上车前核对车牌号！和App显示的不一样就别上。',
        mockup: {
          appName: '确认叫车', highlightLabel: '选好车型点呼叫',
          elements: [
            { type: 'card', title: '🚗 快车 · 预计 ¥18', subtitle: '约3分钟到达' },
            { type: 'card', title: '🚕 出租车 · 打表计价', subtitle: '约5分钟到达' },
            { type: 'button', label: '呼叫快车', color: 'orange', primary: true },
          ],
        },
      },
      {
        title: '上车，核对车牌',
        detail: '车到了先对车牌号，确认一致再上车。告诉司机「按导航走」。',
        tip: '点「分享行程」发给家人，他们能实时看到你的位置。',
        warning: '别取消订单后私下给现金，App支付才有保障。',
        mockup: {
          appName: '等待接驾', highlightLabel: '核对这个车牌号',
          elements: [
            { type: 'text', text: '🚗 白 · 京B·12345 · 约2分钟到达', size: 'md' },
            { type: 'text', text: '张师傅 · 评分 4.9 · 1,280单', size: 'sm' },
            { type: 'button', label: '📞 联系司机', color: 'blue' },
            { type: 'button', label: '📤 分享行程给家人', color: 'green' },
          ],
        },
      },
      {
        title: '到达，自动扣费',
        detail: '到达后系统自动从微信/支付宝扣钱，下车就行。',
        tip: '给司机打5星好评，以后更容易叫到车。',
        mockup: {
          appName: '行程结束', highlightLabel: '',
          elements: [
            { type: 'text', text: '✅ 行程结束', size: 'md' },
            { type: 'card', title: '已付 ¥18.50', subtitle: 'XX路 → XX市人民医院 · 3.2km · 12分钟' },
            { type: 'text', text: '给司机评分：⭐⭐⭐⭐⭐', size: 'sm' },
          ],
        },
      },
    ],
    systemPrompt: `${SYS}\n\n教老人打车。提醒：上车前核对车牌。分享行程给家人。`,
  },

  // ==================== 4. 网购下单 ====================
  {
    id: 'gouwu', title: '网购下单', description: '在淘宝/拼多多买东西',
    icon: 'shopping-bag', iconBg: '#F9F0EF', category: 'life',
    steps: [
      {
        title: '打开购物App，搜索商品',
        detail: '打开淘宝或拼多多，点顶部搜索框，输入想买的东西，点「搜索」。',
        tip: '点搜索框旁的麦克风用语音输入更方便。',
        mockup: {
          appName: '淘宝', highlightLabel: '点搜索框输入',
          elements: [
            { type: 'input', placeholder: '🔍 老花镜' },
            { type: 'icon-grid', icons: [
              { icon: '👓', label: '眼镜' }, { icon: '👟', label: '鞋' },
              { icon: '🍚', label: '大米' }, { icon: '🧥', label: '外套' },
              { icon: '💊', label: '保健品' }, { icon: '📱', label: '手机' },
            ] },
          ],
        },
      },
      {
        title: '浏览商品，看评价',
        detail: '点一个商品进去，看图片、价格、评价。多看几家，不着急。',
        tip: '带图评价一般是真实用户写的。评价多、评分高的更靠谱。',
        warning: '价格低得离谱（1000块卖50块）很可能是假货。',
        mockup: {
          appName: '商品详情', highlightLabel: '看评价和价格',
          elements: [
            { type: 'card', title: '老花镜 防蓝光 超轻', subtitle: '¥68 · 已售 2.3万件 · ★4.8' },
            { type: 'text', text: '💬 用户评价（带图）', size: 'sm' },
            { type: 'card', title: '⭐⭐⭐⭐⭐ 很好用，戴着不累', subtitle: '王阿姨 · 3天前' },
            { type: 'button', label: '立即购买', color: 'orange', primary: true },
            { type: 'button', label: '加入购物车', color: 'orange' },
          ],
        },
      },
      {
        title: '选规格，点「立即购买」',
        detail: '选好颜色、尺寸、数量，点「立即购买」。还想买别的就点「加入购物车」最后一起结算。',
        tip: '买衣服鞋子不确定尺码就问客服。',
        mockup: {
          appName: '选择规格', highlightLabel: '选好后点这里',
          elements: [
            { type: 'text', text: '颜色：黑色 / 金色 / 银色', size: 'sm' },
            { type: 'text', text: '度数：100度 / 150度 / 200度', size: 'sm' },
            { type: 'text', text: '数量：1', size: 'sm' },
            { type: 'button', label: '立即购买 · ¥68', color: 'orange', primary: true },
          ],
        },
      },
      {
        title: '填写收货地址',
        detail: '填姓名、手机号、详细地址（写到门牌号）。第一次填完以后自动记住。',
        warning: '确认地址是你家，别填到不熟悉的地方。',
        mockup: {
          appName: '收货地址', highlightLabel: '填你的收货地址',
          elements: [
            { type: 'input', placeholder: '收货人姓名' },
            { type: 'input', placeholder: '手机号码' },
            { type: 'input', placeholder: '省/市/区/详细地址' },
            { type: 'button', label: '保存地址', color: 'blue', primary: true },
          ],
        },
      },
      {
        title: '确认订单并支付',
        detail: '核对商品、数量、地址、金额全都对了，点「提交订单」，输入支付密码。',
        warning: '「客服」让你转账或给验证码都是骗子！正规客服不会私下联系你。',
        mockup: {
          appName: '确认订单', highlightLabel: '核对无误后点支付',
          elements: [
            { type: 'card', title: '老花镜 防蓝光 · 黑色 · 150度 ×1', subtitle: '¥68.00' },
            { type: 'card', title: '收货人：张阿姨 138****5678', subtitle: 'XX市XX区XX路XX小区3-501' },
            { type: 'button', label: '提交订单 · ¥68.00', color: 'orange', primary: true },
          ],
        },
      },
    ],
    systemPrompt: `${SYS}\n\n教老人淘宝/拼多多网购。提醒：不贪便宜、核对地址、不相信私下转账的客服。`,
  },

  // ==================== 5. 视频通话 ====================
  {
    id: 'shipin', title: '视频通话', description: '微信视频/语音通话',
    icon: 'video', iconBg: '#EBF2EC', category: 'social',
    steps: [
      {
        title: '打开微信，找到联系人',
        detail: '打开微信 → 点底部「通讯录」→ 找到想通话的人。',
        tip: '常联系的人可以长按名字选「置顶聊天」，以后就在最上面了。',
        mockup: {
          appName: '微信 · 通讯录', highlightLabel: '找到你想通话的人',
          elements: [
            { type: 'input', placeholder: '🔍 搜索' },
            { type: 'list', items: ['👤 儿子', '👤 女儿', '👤 老伴', '👤 老王', '👤 李姐'] },
          ],
        },
      },
      {
        title: '进入聊天，点 + 号',
        detail: '点联系人 → 进入聊天界面 → 点右下角 ⊕。',
        mockup: {
          appName: '与 女儿 的聊天', highlightLabel: '点右下角 ⊕',
          elements: [
            { type: 'text', text: '女儿：妈，晚上来吃饭吗？', size: 'sm' },
            { type: 'text', text: '你：好的呀，几点到？', size: 'sm' },
            { type: 'text', text: '                      ⊕', size: 'md' },
          ],
        },
      },
      {
        title: '选择视频通话',
        detail: '弹出菜单里找到「视频通话」图标，点它。选「视频通话」就能看到脸。',
        tip: '没准备好可以先选「语音通话」，只说话不露脸。',
        mockup: {
          appName: '与 女儿 的聊天', highlightLabel: '点视频通话',
          elements: [
            { type: 'icon-grid', icons: [
              { icon: '📷', label: '拍照' }, { icon: '🖼️', label: '相册' },
              { icon: '📹', label: '视频通话' }, { icon: '🎤', label: '语音通话' },
              { icon: '📍', label: '位置' }, { icon: '🎁', label: '红包' },
            ] },
          ],
        },
      },
      {
        title: '等待接听 & 通话中',
        detail: '对方接听后就能看到彼此了。点「扬声器」按钮声音更大。挂断点红色按钮。',
        tip: '画面卡说明网络不好，靠近WiFi或切成语音通话。',
        warning: '不要和自称「客服」「警察」的陌生人视频。',
        mockup: {
          appName: '视频通话中…', highlightLabel: '',
          elements: [
            { type: 'text', text: '📹 女儿 · 通话中 02:15', size: 'md' },
            { type: 'icon-grid', icons: [
              { icon: '📢', label: '扬声器' }, { icon: '🎥', label: '切换' },
              { icon: '🔇', label: '静音' }, { icon: '🔴', label: '挂断' },
            ] },
          ],
        },
      },
    ],
    systemPrompt: `${SYS}\n\n教老人微信视频通话。提醒：用WiFi比流量省钱。不和陌生人视频。`,
  },

  // ==================== 6. 防诈骗 ====================
  {
    id: 'fangzhapian', title: '防诈骗指南', description: '识别诈骗短信、电话和链接',
    icon: 'shield', iconBg: '#F9F0EF', category: 'safety',
    steps: [
      {
        title: '认识常见骗术',
        detail: '骗子常冒充客服、公检法、亲戚，说「退款」「中奖」「涉嫌犯罪」「急用钱」。',
        tip: '记住：天上不会掉馅饼。让你转账、给验证码的，先问家人！',
        warning: '真警察、真法院绝不会打电话让你转账或下载不明App。',
        mockup: {
          appName: '防骗知识', highlightLabel: '',
          elements: [
            { type: 'highlight-box', text: '⚠️ 常见骗术：冒充客服 / 中奖 / 冒充公检法 / 冒充亲戚借钱', color: 'red' },
            { type: 'card', title: '🚨 案例：假客服', subtitle: '"您购买的商品有问题，需要退款，请提供银行卡号…"' },
            { type: 'card', title: '🚨 案例：假中奖', subtitle: '"恭喜您中奖！请先缴纳手续费500元…"' },
          ],
        },
      },
      {
        title: '识别可疑短信',
        detail: '看三样：号码正不正常？有没有奇怪链接？内容是不是催你马上点？有一个可疑就别点。',
        warning: '永远别点陌生链接！点进去钱可能就被偷走。',
        mockup: {
          appName: '短信', highlightLabel: '这种短信别点！',
          elements: [
            { type: 'text', text: '【顺丰快递】您好，您的快递因地址不详无法派送，请点击 http://sf-xxx.cc 确认地址，24小时不处理将退回。', size: 'sm' },
            { type: 'highlight-box', text: '⚠️ 可疑特征：奇怪链接 + 紧急催促', color: 'red' },
            { type: 'button', label: '删除这条短信', color: 'green' },
          ],
        },
      },
      {
        title: '识别可疑电话',
        detail: '陌生来电先冷静。问：你是谁？哪个单位？什么事？对方说不清、催你做事，直接挂。',
        warning: '提到「转账」「验证码」「安全账户」= 100% 骗子。',
        mockup: {
          appName: '来电', highlightLabel: '这种电话直接挂！',
          elements: [
            { type: 'text', text: '📞 来电：+86 138****6666', size: 'md' },
            { type: 'text', text: '"您好，我是公安局的，您的银行卡涉嫌洗钱，请把资金转到安全账户…"', size: 'sm' },
            { type: 'highlight-box', text: '🚨 这是骗子！挂断！打110！', color: 'red' },
            { type: 'button', label: '挂断', color: 'green', primary: true },
          ],
        },
      },
      {
        title: '验证码和密码死也不能给',
        detail: '验证码就是你家门钥匙，谁问都不能给！密码同样。任何「客服」「警察」问你要验证码都是骗子。',
        warning: '任何人以任何理由要验证码＝骗子，没有例外。',
        mockup: {
          appName: '验证码', highlightLabel: '死也不能给别人！',
          elements: [
            { type: 'text', text: '您的验证码是：', size: 'sm' },
            { type: 'text', text: '【 8 2 1 4 6 5 】', size: 'md' },
            { type: 'highlight-box', text: '🔒 这个6位数字=你家门钥匙，不能告诉任何人！', color: 'red' },
            { type: 'text', text: '有效期5分钟，请勿泄露给他人', size: 'sm' },
          ],
        },
      },
      {
        title: '不幸被骗了怎么办',
        detail: '马上做三件事：① 打银行客服冻结卡；② 打110报警；③ 告诉家人。越快越好。',
        warning: '骗子会继续骗你「再转一笔才能退钱」——别再转！马上报警！',
        mockup: {
          appName: '紧急处理', highlightLabel: '',
          elements: [
            { type: 'button', label: '① 银行客服 · 冻结卡片', color: 'orange', primary: true },
            { type: 'button', label: '② 拨打 110 报警', color: 'orange', primary: true },
            { type: 'button', label: '③ 联系家人', color: 'green', primary: true },
            { type: 'highlight-box', text: '⚠️ 越早处理，钱追回的可能性越大', color: 'orange' },
          ],
        },
      },
    ],
    systemPrompt: `${SYS}\n\n教老人防诈骗。重点：验证码死也不能给别人！陌生链接别点！转账前先问家人！`,
  },

  // ==================== 7. 手机基础设置 ====================
  {
    id: 'shezhi', title: '手机基础设置', description: '调WiFi、字体、音量等',
    icon: 'wrench', iconBg: '#EBF2EC', category: 'basics',
    steps: [
      {
        title: '连接WiFi',
        detail: '打开「设置」→「WLAN」→ 找到你家WiFi名字 → 输入密码 → 点「连接」。',
        tip: '密码在路由器底部贴纸上。区分大小写。',
        warning: '别连商场里没密码的免费WiFi，可能不安全。',
        mockup: {
          appName: '设置 · WLAN', highlightLabel: '点你家WiFi',
          elements: [
            { type: 'text', text: '✅ 已连接：我家WiFi_5G', size: 'md' },
            { type: 'list', items: ['我家WiFi_5G（已连接）', '我家WiFi_2.4G', '邻居的WiFi（🔒）'] },
            { type: 'card', title: '输入密码', subtitle: '********' },
          ],
        },
      },
      {
        title: '调大字体',
        detail: '「设置」→「显示」→「字体大小」→ 把滑块往右拖，字就变大了。',
        tip: '调完打开微信看看字够不够大，不够再调。',
        mockup: {
          appName: '字体大小', highlightLabel: '往右拖变大',
          elements: [
            { type: 'text', text: '预览文字：你好，我是小慢', size: 'md' },
            { type: 'text', text: '字体大小：小 ◉━━━━━━● 大', size: 'sm' },
            { type: 'card', title: '📱 预览效果', subtitle: '上面的字变大变小，你看着舒服就好' },
          ],
        },
      },
      {
        title: '调音量和亮度',
        detail: '音量：按手机侧边键。亮度：从屏幕顶部下滑，拖动亮度条。',
        tip: '太亮费电，太暗伤眼。调到看着舒服就行。',
        mockup: {
          appName: '控制中心', highlightLabel: '下滑出现，拖动调节',
          elements: [
            { type: 'icon-grid', icons: [
              { icon: '🔦', label: '手电筒' }, { icon: '📶', label: 'WiFi' },
              { icon: '🔇', label: '静音' }, { icon: '🔒', label: '锁屏' },
            ] },
            { type: 'text', text: '☀️ 亮度：◉━━━━━━━●', size: 'sm' },
            { type: 'text', text: '🔊 音量：◉━━━━●━━━', size: 'sm' },
          ],
        },
      },
      {
        title: '清理手机垃圾',
        detail: '「设置」→「存储」看还剩多少空间。满了就删掉不用的照片和App。',
        tip: '每周关机重启一次，手机变快。',
        warning: '别删不认识的文件，可能系统要用。不确定的问家人。',
        mockup: {
          appName: '存储空间', highlightLabel: '',
          elements: [
            { type: 'text', text: '总容量：128 GB', size: 'sm' },
            { type: 'text', text: '已用：96 GB（75%）· 可用：32 GB', size: 'sm' },
            { type: 'card', title: '📸 照片：28 GB', subtitle: '点击清理' },
            { type: 'card', title: '📱 App：35 GB', subtitle: '点击管理' },
            { type: 'button', label: '一键清理缓存', color: 'green' },
          ],
        },
      },
    ],
    systemPrompt: `${SYS}\n\n教老人手机基础设置。用最通俗的语言。`,
  },

  // ==================== 8. 拍照分享 ====================
  {
    id: 'paizhao', title: '拍照分享', description: '拍照并发给家人朋友',
    icon: 'camera', iconBg: '#EEF3F7', category: 'social',
    steps: [
      {
        title: '打开相机，拍照',
        detail: '打开相机 App，对准要拍的，双手拿稳，点中间大圆按钮。咔嚓就拍好了！',
        tip: '光线好的地方拍出来更清楚。手抖就靠墙。',
        warning: '拍照前注意别拍到银行卡、身份证、密码纸条。',
        mockup: {
          appName: '相机', highlightLabel: '点中间大圆按钮',
          elements: [
            { type: 'text', text: '📸 对准要拍的东西', size: 'md' },
            { type: 'icon-grid', icons: [
              { icon: '🖼️', label: '相册' }, { icon: '⚪', label: '拍照' },
              { icon: '🔄', label: '翻转' },
            ] },
          ],
        },
      },
      {
        title: '查看照片',
        detail: '点右下角小方块看刚拍的照片，左右滑看其他的。不满意删掉重拍。',
        mockup: {
          appName: '相册', highlightLabel: '左右滑看照片',
          elements: [
            { type: 'text', text: '📷 刚刚拍的照片', size: 'sm' },
            { type: 'card', title: '🌅 窗台上的花', subtitle: '今天 15:30 · 2.4 MB' },
            { type: 'button', label: '🗑️ 删除重拍', color: 'green' },
            { type: 'button', label: '📤 发送给朋友', color: 'blue', primary: true },
          ],
        },
      },
      {
        title: '通过微信发给家人',
        detail: '微信 → 找到人 → 聊天界面 → 点 ⊕ →「相册」→ 选照片 →「发送」。',
        tip: '一次可选多张（最多9张），每张点一下打勾。',
        mockup: {
          appName: '与 女儿 的聊天', highlightLabel: '⊕ → 相册 → 选照片 → 发送',
          elements: [
            { type: 'card', title: '🌅 窗台上的花', subtitle: '已选中 ✓' },
            { type: 'button', label: '发送（1张）', color: 'green', primary: true },
          ],
        },
      },
      {
        title: '发朋友圈（可选）',
        detail: '微信 →「发现」→「朋友圈」→ 点右上角相机图标 → 选照片 → 写句话 →「发表」。',
        warning: '别发身份证、银行卡、家里详细地址的照片。',
        mockup: {
          appName: '发表朋友圈', highlightLabel: '写句话，点发表',
          elements: [
            { type: 'card', title: '🌅 窗台上的花', subtitle: '已选1张照片' },
            { type: 'input', placeholder: '说点什么…今天天气真好🌞' },
            { type: 'button', label: '发表', color: 'green', primary: true },
          ],
        },
      },
    ],
    systemPrompt: `${SYS}\n\n教老人拍照分享。提醒：发照片前检查有没有拍到隐私信息。`,
  },

  // ==================== 9. 健康码/电子医保 ====================
  {
    id: 'yibao', title: '电子医保', description: '用手机出示医保码和健康码',
    icon: 'heart', iconBg: '#F9F0EF', category: 'health',
    steps: [
      {
        title: '打开支付宝，搜"医保"',
        detail: '打开支付宝，点顶部搜索框，输入"电子医保"或"医保码"，点第一个结果。',
        tip: '微信也能搜"我的医保"，两个平台都行。',
        mockup: {
          appName: '支付宝', highlightLabel: '搜索电子医保',
          elements: [
            { type: 'input', placeholder: '🔍 电子医保' },
            { type: 'card', title: '🏥 电子医保码', subtitle: '国家医保局 · 官方服务' },
            { type: 'card', title: '💊 医保查询', subtitle: '个人账户余额、消费明细' },
          ],
        },
      },
      {
        title: '激活医保电子凭证',
        detail: '第一次用需要激活：点"同意协议并激活"→ 刷脸验证 → 设置密码。以后就不用再激活了。',
        tip: '刷脸时摘掉帽子眼镜，光线好一点，1秒就过。',
        warning: '只在官方渠道激活医保码，别扫不明二维码。',
        mockup: {
          appName: '医保电子凭证', highlightLabel: '点激活，刷脸',
          elements: [
            { type: 'text', text: '首次使用需激活', size: 'md' },
            { type: 'button', label: '同意协议并激活', color: 'blue', primary: true },
            { type: 'text', text: '已阅读《用户服务协议》', size: 'sm' },
          ],
        },
      },
      {
        title: '就医时出示医保码',
        detail: '去医院挂号或交费时，打开支付宝 → 搜索"医保码" → 点二维码图标 → 给工作人员扫一下就行。',
        tip: '把医保码添加到手机桌面，下次不用搜，直接点。',
        mockup: {
          appName: '医保码', highlightLabel: '给工作人员扫这个码',
          elements: [
            { type: 'text', text: '┌─────────────────┐', size: 'sm' },
            { type: 'text', text: '│   ██ ██ ██ ██  │', size: 'md' },
            { type: 'text', text: '│   ██ ██ ██ ██  │', size: 'md' },
            { type: 'text', text: '└─────────────────┘', size: 'sm' },
            { type: 'text', text: '张** · 社会保障卡', size: 'sm' },
            { type: 'button', label: '添加到桌面', color: 'blue' },
          ],
        },
      },
    ],
    systemPrompt: `${SYS}\n\n教老人使用电子医保码。提醒：只在官方渠道激活。`,
  },
  {
    id: 'yanglao', title: '养老认证', description: '社保App刷脸认证、养老金查询',
    icon: 'user', iconBg: '#EBF2EC', category: 'health',
    steps: [
      {
        title: '下载"掌上12333"App',
        detail: '在手机应用商店搜"掌上12333"（人社部官方App），下载安装。',
        tip: '或搜本地社保App也行，比如"XX人社"、"XX社保"。',
        warning: '只在官方应用商店下载，别从短信链接里下。',
        mockup: {
          appName: '应用商店', highlightLabel: '搜官方App',
          elements: [
            { type: 'input', placeholder: '🔍 掌上12333' },
            { type: 'card', title: '掌上12333', subtitle: '人力资源和社会保障部 · 官方' },
            { type: 'button', label: '下载', color: 'blue' },
          ],
        },
      },
      {
        title: '注册并登录',
        detail: '打开App，用身份证号和手机号注册。需要人脸识别验证身份。',
        tip: '刷脸时正对手机，光线充足，按提示眨眼或张嘴。',
        warning: '认证完全免费！任何要求交费的都是骗子。',
        mockup: {
          appName: '掌上12333', highlightLabel: '输入身份证号注册',
          elements: [
            { type: 'input', placeholder: '请输入身份证号码' },
            { type: 'input', placeholder: '请输入手机号' },
            { type: 'button', label: '下一步（人脸识别）', color: 'blue', primary: true },
          ],
        },
      },
      {
        title: '进行养老待遇认证',
        detail: '登录后，首页点"社会保险待遇资格认证"→ 按提示刷脸 → 显示"认证成功"就完成了。每年认证一次即可。',
        tip: '如果家里老人不方便刷脸，子女可用自己的手机帮老人"代认证"。',
        mockup: {
          appName: '掌上12333', highlightLabel: '点这里开始认证',
          elements: [
            { type: 'card', title: '📋 社保待遇资格认证', subtitle: '每年认证一次' },
            { type: 'card', title: '💰 养老金查询', subtitle: '查看发放记录' },
            { type: 'button', label: '开始认证', color: 'blue', primary: true },
          ],
        },
      },
      {
        title: '查询养老金',
        detail: '认证成功后回到首页，点"养老金查询"可以看每月发了多少钱、什么时候到账。',
        tip: '每月15号左右发养老金，可以设置日历提醒。',
        mockup: {
          appName: '养老金查询', highlightLabel: '',
          elements: [
            { type: 'card', title: '2024年6月', subtitle: '发放 ¥2,850.00 · 6月15日到账' },
            { type: 'card', title: '2024年5月', subtitle: '发放 ¥2,850.00 · 5月15日到账' },
          ],
        },
      },
    ],
    systemPrompt: `${SYS}\n\n教老人养老认证和养老金查询。强调完全免费，任何收费都是骗子。`,
  },
  {
    id: 'tuangou', title: '社区团购', description: '拼多多买菜、美团优选自提',
    icon: 'shopping-bag', iconBg: '#EEF3F7', category: 'life',
    steps: [
      {
        title: '打开拼多多或美团',
        detail: '拼多多点底部"多多买菜"；美团点"美团优选"。两个都可以买菜，价格差不多。',
        tip: '第一次用会送优惠券，记得领。',
        mockup: {
          appName: '拼多多', highlightLabel: '点多多买菜',
          elements: [
            { type: 'icon-grid', icons: [
              { icon: '🥬', label: '多多买菜' }, { icon: '💰', label: '限时秒杀' },
              { icon: '🎮', label: '多多果园' }, { icon: '📦', label: '我的订单' },
            ] },
          ],
        },
      },
      {
        title: '选商品加入购物车',
        detail: '浏览水果蔬菜粮油，看到想要的点"+"加入购物车。满一定金额才能下单（通常满15元）。',
        tip: '早10点和晚6点有特价秒杀，价格更低。',
        mockup: {
          appName: '多多买菜', highlightLabel: '点+号加入购物车',
          elements: [
            { type: 'card', title: '🍎 红富士苹果 3斤', subtitle: '¥9.99  +  1  -' },
            { type: 'card', title: '🥬 大白菜 1颗', subtitle: '¥2.50  +  1  -' },
            { type: 'card', title: '🥚 鸡蛋 30枚', subtitle: '¥19.90  +  1  -' },
          ],
        },
      },
      {
        title: '选择自提点',
        detail: '点底部"去结算"→ 系统会显示离你最近的自提点（通常是小卖部、便利店），选一个方便的。',
        tip: '选离家近的，散步顺便拿菜。自提点一般保留到第二天下午。',
        mockup: {
          appName: '选择自提点', highlightLabel: '选最近的自提点',
          elements: [
            { type: 'card', title: '📍 XX便利店', subtitle: '距你120m · 营业 8:00-22:00' },
            { type: 'card', title: '📍 XX超市', subtitle: '距你350m · 营业 7:00-23:00' },
          ],
        },
      },
      {
        title: '下单支付、次日自提',
        detail: '确认商品和金额，点"提交订单"支付。第二天下午4点后去自提点取货，报手机尾号就行。',
        tip: '第二天会收到取货提醒短信，拿手机尾号后4位去取。',
        mockup: {
          appName: '确认订单', highlightLabel: '核对后支付',
          elements: [
            { type: 'card', title: '共3件 · ¥32.39', subtitle: '自提点：XX便利店' },
            { type: 'text', text: '预计明天下午4点后可取货', size: 'sm' },
            { type: 'button', label: '提交订单 · ¥32.39', color: 'orange', primary: true },
          ],
        },
      },
    ],
    systemPrompt: `${SYS}\n\n教老人用拼多多或美团买菜自提。提醒：第一次用不知道自提点在哪可以问家人。`,
  },
  {
    id: 'yuyin', title: '语音助手', description: '用Siri/小爱同学语音操作手机',
    icon: 'mic', iconBg: '#EEF3F7', category: 'basics',
    steps: [
      {
        title: '唤醒语音助手',
        detail: 'iPhone：长按右侧按钮。安卓：长按Home键或说"嘿Siri""小爱同学"。',
        tip: '在设置里打开"语音唤醒"，以后叫一声就行，不用按键。',
        mockup: {
          appName: '语音助手', highlightLabel: '长按或喊一声',
          elements: [
            { type: 'text', text: '🎤 "嘿 Siri…"', size: 'md' },
            { type: 'text', text: '或者长按右侧按钮', size: 'sm' },
            { type: 'text', text: '●●●●●●●（正在听你说话）', size: 'sm' },
          ],
        },
      },
      {
        title: '常用口语指令',
        detail: '直接说话就行，不用打字。试试这些："今天天气怎么样""打电话给女儿""打开微信""提醒我下午3点吃药""10分钟后闹钟"。',
        tip: '说得越具体越好。比如"打电话给女儿"而不是"打电话"。',
        mockup: {
          appName: 'Siri', highlightLabel: '直接说你想做什么',
          elements: [
            { type: 'list', items: ['☁️ 今天天气怎么样？', '📞 打电话给女儿', '⏰ 下午3点提醒我吃药', '💬 打开微信', '🔍 帮我搜红烧肉怎么做'] },
          ],
        },
      },
      {
        title: '让语音助手帮忙设置提醒',
        detail: '比如喊"提醒我每天下午3点吃药"，手机会自动到时间弹出提醒。比手动输入方便很多。',
        tip: '可以设置重复提醒，比如"每天早上8点提醒我量血压"。',
        mockup: {
          appName: '提醒事项', highlightLabel: '',
          elements: [
            { type: 'card', title: '✅ 下午3点：吃药', subtitle: '每天重复' },
            { type: 'card', title: '✅ 早上8点：量血压', subtitle: '每天重复' },
            { type: 'text', text: 'Siri 已帮你设置好了！', size: 'sm' },
          ],
        },
      },
      {
        title: '让语音助手朗读和导航',
        detail: '说"帮我导航到XX医院"，手机自动打开地图导航。说"读一下最近的消息"，手机帮你读微信消息。',
        tip: '开车或走路时用语音特别安全，不用看手机。',
        warning: '不要在人多的地方大声说密码、银行卡号等敏感信息。',
        mockup: {
          appName: '地图', highlightLabel: '',
          elements: [
            { type: 'card', title: '📍 导航到 XX市人民医院', subtitle: '驾车约12分钟 · 3.2公里' },
            { type: 'button', label: '开始导航', color: 'green', primary: true },
          ],
        },
      },
    ],
    systemPrompt: `${SYS}\n\n教老人使用手机语音助手。鼓励老人多尝试语音操作。`,
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  health: '健康医疗',
  life: '日常生活',
  social: '社交沟通',
  safety: '安全防护',
  basics: '基础操作',
};

export default TASKS;
