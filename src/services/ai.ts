/**
 * 「慢慢来」AI 陪练 —— 有状态对话树引擎 v2
 *
 * 6 个任务，每个 5-7 轮对话。点选项自动推进，不用打字。
 */

export interface AIResponse {
  content: string;
  suggestions: string[];
}

// ====== 对话状态 ======
interface ChatState {
  activeTask: string | null;
  currentStep: number;
}
let state: ChatState = { activeTask: null, currentStep: 0 };

export function resetChatState() {
  state = { activeTask: null, currentStep: 0 };
}

// ====== 6 大任务对话树 ======
// 每步: { content: AI说的话, suggestions: [2-4个可选回复] }

const guahao = {
  id: 'guahao', title: '线上挂号', emoji: '🏥',
  steps: [
    {
      content: '好的！咱们来学「🏥 线上挂号」。\n\n第 1 步：打开微信，点顶部的 🔍，输入医院名字。找到医院公众号后点「关注」。\n\n👀 注意看名字旁有没有蓝色 ✓ 认证标志，有才是真的。',
      suggestions: ['找到了，已关注 ✅', '搜出来好几个，哪个是真的？🤔', '没搜到这个医院 😟'],
    },
    {
      content: '如果搜出好几个，找名字最完整的那个，带蓝色 ✓ 标志的。\n\n第 2 步：进公众号后，看底部菜单栏。点「就医服务」→「预约挂号」。一般在菜单最左边。\n\n有的医院叫「医疗服务」或「门诊预约」，都是一个意思。',
      suggestions: ['找到了预约挂号！下一步？', '菜单里没有预约挂号 😟', '点了让我登录，怎么弄？'],
    },
    {
      content: '第一次用需要绑定信息。按提示填姓名、身份证号、手机号就行，和去医院挂号填的是一样的。\n\n第 3 步：登录后会看到科室列表。感冒看「内科」，牙疼看「口腔科」，不确定就选「全科门诊」。\n\n往下滑能看到所有科室～',
      suggestions: ['选好科室了 ✅', '科室太多不知道挂哪个 🤔', '绑定信息安全吗？🛡️'],
    },
    {
      content: '不确定就选「全科门诊」或「普通内科」，到了医院医生会根据情况帮您转科。\n\n🛡️ 绑定信息是安全的，这是医院官方渠道，和在医院窗口挂号一样。\n\n第 4 步：选好科室后，挑一个有号的日子和医生。🟢 绿色有号，⬜ 灰色没号。',
      suggestions: ['选好日期和医生了！', '都是灰色的没号了 😟', '专家号和普通号有什么区别？'],
    },
    {
      content: '专家号是主任级别医生，贵一些但经验丰富。普通号也能看好，¥10-25 左右。\n\n第 5 步：选好日期医生后，选一个时间段（建议选早上的，人少不用等太久）。\n\n核对信息都没错，点「确认挂号」付款。微信支付就行。',
      suggestions: ['确认付款了！💰', '还想再核对一下信息 🔍', '付款后怎么看挂号成功没？'],
    },
    {
      content: '付款成功后，公众号会发一条消息给你，上面有：\n\n✅ 医院名称和地址\n✅ 科室和医生名字\n✅ 就诊日期和时间段\n✅ 挂号编号\n\n去医院当天带上身份证和手机，在自助机或窗口取号就行。\n\n🛡️ 正规挂号不会额外让你转账给个人！',
      suggestions: ['全学会了！谢谢小慢 🎉', '还想再学一遍 🔄', '可以教我别的吗？📚'],
    },
  ],
};

const jiaofei = {
  id: 'jiaofei', title: '生活缴费', emoji: '💡',
  steps: [
    {
      content: '好的！学「💡 生活缴费」。\n\n第 1 步：打开微信 → 右下角「我」→「服务」→「生活缴费」。\n\n水费、电费、燃气费、固话费的图标都在里面。\n\n🛡️ 只在微信/支付宝官方入口缴费，不扫陌生人给的二维码！',
      suggestions: ['找到了生活缴费！下一步？', '需要什么户号，去哪找？📋', '从来没用过，怕点错 😟'],
    },
    {
      content: '户号在以前的纸质缴费单上能找到，是一串 8-12 位数字。\n\n第 2 步：点要交的项目（比如电费）→「新增缴费户号」→ 输入户号 → 确认。\n\n系统会自动查到账单，核对户名是不是你的名字。户号只输一次，以后都记住。',
      suggestions: ['户号输好了，核对正确 ✅', '找不到以前的缴费单 📄', '显示的名字不对 😟'],
    },
    {
      content: '找不到缴费单的话，打供电局客服电话 95598（电费）或自来水公司电话，报地址就能问到户号。\n\n第 3 步：核对无误后，能看到这个月要交多少钱。点「立即缴费」，微信支付就行了。',
      suggestions: ['缴费成功了！✅', '金额比上个月多了很多，正常吗？', '可以设置自动缴费吗？'],
    },
    {
      content: '金额波动是正常的，夏天开空调电费会高一些。如果有疑问可以打客服电话核实。\n\n第 4 步：缴费成功后会收到微信支付凭证，也会有短信通知。\n\n💡 可以在「生活缴费」里开启「自动缴费」，以后每个月自动扣款，不怕忘交停电停水。',
      suggestions: ['开通自动缴费了！', '自动缴费安全吗？🛡️', '学会了！太方便了 🎉'],
    },
  ],
};

const dache = {
  id: 'dache', title: '打车出行', emoji: '🚗',
  steps: [
    {
      content: '好的！学「🚗 打车出行」。\n\n第 1 步：打开微信，在聊天页面手指往下拉，找到「滴滴出行」小程序。\n\n手机自动定位你的位置。在「您去哪儿」输入要去的地方。\n\n🛡️ 上车前一定核对手机上的车牌号！',
      suggestions: ['打开了！下一步？', '找不到滴滴出行 😟', '怎么知道要多少钱？'],
    },
    {
      content: '第 2 步：输入目的地后，系统显示预估价格。不同车型价格不同：\n\n🚗 快车 — 最实惠\n🚙 优享 — 更舒适\n🚕 出租车 — 打表计价\n\n选好后点「呼叫」，系统自动找附近司机。',
      suggestions: ['叫到车了！🚗', '司机打电话过来了，怎么接？', '怕司机找不到我 😟'],
    },
    {
      content: '司机打电话是确认你的位置，直接接就行！\n\n第 3 步：叫到车后会显示：司机照片、车牌号、车辆颜色、预计几分钟到。\n\n站在定位点等，车到了对照车牌号确认再上车。\n\n💡 可以把行程分享给家人，让他们知道你去哪。',
      suggestions: ['上车了 ✅', '怎么付钱？要现金吗？', '司机看起来不像照片里的人 😟'],
    },
    {
      content: '不用现金！到达后微信自动扣款。\n\n🛡️ 如果司机和照片不一样，或车牌不对——不要上车！取消订单重新叫。安全第一！\n\n第 4 步：坐车时可以看手机上的行程路线，确保司机没有绕路。',
      suggestions: ['顺利到达了！🎉', '司机好像绕路了 😟', '下车要做什么？'],
    },
    {
      content: '第 5 步：到达后自动扣款，下车前检查座位有没有落东西。\n\n可以在 App 里给司机打分，如果服务好就给 5 星 ⭐\n\n如果司机绕路了，在 App 里点「投诉」，平台会退差价。\n\n你学会打车啦！以后出门方便多了 🎉',
      suggestions: ['全学会了！谢谢 🎉', '还想学别的 📚', '再学一遍 🔄'],
    },
  ],
};

const shipin = {
  id: 'shipin', title: '视频通话', emoji: '📞',
  steps: [
    {
      content: '好的！学「📞 视频通话」，很简单～\n\n第 1 步：打开微信 → 底部「通讯录」→ 找到你想视频的人。\n\n或在聊天列表里，直接点开和 ta 的聊天窗口。\n\n💡 连家里 WiFi 打视频不费流量！',
      suggestions: ['找到了联系人！下一步？', '联系人太多，找不到 😟', '对方也用微信吗？'],
    },
    {
      content: '第 2 步：打开聊天窗口 → 点右下角「⊕」→「视频通话」→「开始视频通话」。\n\n对方手机会响铃，和打电话一样。等 ta 接起来就行～\n\n双方都要用微信才能视频通话哦。',
      suggestions: ['打通了！好开心 😊', '对方没接怎么办？', '画面好模糊 📱'],
    },
    {
      content: '第 3 步：画面模糊的话，换个离 WiFi 近的地方，或者把手机举高一点。\n\n想让对方看你身边的东西（花、猫、小孙子），点「切换摄像头」按钮。\n\n声音小的话，按手机侧面的音量键调大。',
      suggestions: ['画面清楚了！👀', '怎么挂断视频？', '可以同时跟多个人视频吗？'],
    },
    {
      content: '第 4 步：聊完了点红色电话图标就挂断了。不花钱，免费的～\n\n想跟好几个人一起视频，可以用「群聊视频」——在家人群里发视频通话就行。\n\n以后每天都能看到儿女、孙子的脸啦 🥰',
      suggestions: ['太开心了！谢谢 🥰', '想学怎么建家人群 👨‍👩‍👧‍👦', '还想学别的 📚'],
    },
  ],
};

const gouwu = {
  id: 'gouwu', title: '手机购物', emoji: '🛒',
  steps: [
    {
      content: '好的！学「🛒 手机购物」。一共 6 步～\n\n第 1 步：打开淘宝或拼多多 App。顶部搜索框输入想买的东西，比如"老年健步鞋"。\n\n搜出来上下滑看更多商品，点图片看详情。\n\n🛡️ 只在官方 App 买！不点别人发来的链接！',
      suggestions: ['搜出来了！好多商品 👀', '拼多多和淘宝用哪个好？', '怎么判断东西靠不靠谱？'],
    },
    {
      content: '第 2 步：点进一个商品 → 先看评价！点「评价」看其他买家怎么说，多看带图片的评价。\n\n评分 4.5 以上、销量高的比较靠谱。\n\n选好尺码颜色后……「加入购物车」继续逛 or「立即购买」直接下单？',
      suggestions: ['加入购物车，再看看别的 🛒', '直接买了！怎么下单？', '价格比其他店贵好多，正常吗？'],
    },
    {
      content: '第 3 步：可以多看几家对比价格，同一件东西不同店差很多的。\n\n第 4 步：在购物车里勾选要买的，点「结算」。\n\n第一次需要填收货地址——收件人姓名、手机号、小区名字和门牌号。填一次就记住了。',
      suggestions: ['填好地址了！怎么付钱？', '地址不想写太详细 😟', '大概几天能到？'],
    },
    {
      content: '第 5 步：选「微信支付」最方便。确认金额和地址无误，点「提交订单」付款。\n\n一般 2-5 天到货，在「我的订单」里能看快递到哪了。\n\n💡 收到货先检查再点「确认收货」，有问题 7 天内能退！',
      suggestions: ['付款成功了！📦', '想改收货地址怎么办？', '东西质量不好怎么退？🔄'],
    },
    {
      content: '第 6 步：退货很简单！在「我的订单」找到那个商品 → 点「申请退款」→ 选理由 → 提交。\n\n快递员会上门取件，不用自己寄。退款 1-3 天到账。\n\n🛡️ 退货在 App 里操作就行！不要信打电话说"帮您退款"的人——那些是骗子！',
      suggestions: ['全学会了！谢谢小慢 🎉', '再学一遍购物 🔄', '还想学别的 📚'],
    },
  ],
};

const fangpian = {
  id: 'fangpian', title: '防骗指南', emoji: '🛡️',
  steps: [
    {
      content: '🛡️ 防骗是最重要的一课！一共 5 步。\n\n第 1 步：记住三个"绝对不"——\n\n❶ 验证码绝对不告诉任何人\n❷ 绝对不给陌生人转账\n❸ 陌生链接绝对不点\n\n📌 验证码就是您手机的钥匙，给别人就等于把家钥匙交出去！',
      suggestions: ['记住了！为什么验证码这么重要？🔑', '遇到过这些情况 😟', '继续下一步'],
    },
    {
      content: '验证码一旦给了别人，对方就能登录你的微信、支付宝，直接把钱转走！银行、公安局、法院绝不会电话找你要验证码。\n\n第 2 步：识别常见骗术——\n\n• "中奖了先交税" — 骗人的\n• "你孙子出事急用钱" — 先打给子女\n• "医保卡被停" — 打 12333 核实\n• "快递丢了点链接退款" — 骗人的',
      suggestions: ['收到过中奖短信，差点信了 😟', '有人打电话说是派出所的', '朋友发链接让我帮忙砍价'],
    },
    {
      content: '第 3 步：陌生链接不要点！即使是朋友发的也要先问一下，朋友的号可能被盗了。\n\n自称银行/公安/法院打电话来的，99% 是骗子。真的会发正式文件或者让你去现场办理。\n\n接到这种电话，直接挂断！',
      suggestions: ['知道了！还有哪些要注意？', '被骗了怎么办？😟', '怎么跟老伴/朋友讲这些？'],
    },
    {
      content: '第 4 步：遇到拿不准的情况，三步走——\n\n① 先挂电话，别急着操作\n② 给子女打电话问一下\n③ 或打 96110（全国反诈热线）\n\n骗子的套路就是让你"急"，你一急就容易出错。记住：真正重要的事，不差这几分钟！',
      suggestions: ['记住了！96110 📞', '如果已经转钱了怎么办？😰', '这些知识太重要了 🙏'],
    },
    {
      content: '第 5 步：万一被骗了——\n\n1️⃣ 马上打 110 报警\n2️⃣ 联系银行冻结账户\n3️⃣ 保留聊天记录和转账截图\n\n越早报警追回的可能越大！\n\n🛡️ 你学到的这些防骗知识，可能帮你守住一辈子的辛苦钱。也告诉身边的朋友，大家一起防骗！',
      suggestions: ['谢谢小慢！这个太重要了 🙏', '再学一遍防骗 🔄', '还想学别的 📚'],
    },
  ],
};

const TASKS: Record<string, typeof guahao> = {
  guahao, jiaofei, dache, shipin, gouwu, fangpian,
};

// ====== 意图识别 ======
function detectTask(input: string): string | null {
  const m = input;
  if (/挂号|医院|看病|预约|门诊|科室/.test(m)) return 'guahao';
  if (/缴费|水费|电费|燃气|煤气|话费|宽带|账单/.test(m)) return 'jiaofei';
  if (/打车|出行|滴滴|叫车|导航|出门/.test(m)) return 'dache';
  if (/视频|视频通话|视频聊天|打.*电话|儿女|家人|孙子|见.*面|跟.*视频/.test(m)) return 'shipin';
  if (/购物|买东西|淘宝|拼多多|快递|下单/.test(m)) return 'gouwu';
  if (/诈骗|骗子|防骗|验证码|转账|汇款|中奖|陌生.*链接|密码|银行卡|安全/.test(m)) return 'fangpian';
  return null;
}

// ====== 推进词检测（宽泛匹配） ======
function isAdvance(msg: string): boolean {
  return /下一步|然后|接着|之后|继续|好了|可以了|完成了|学到了|懂了|选好了|找到了|打开了|进去了|知道了|记住了|成功了|付款了|上车了|到达了|打通了|填好了|清楚了/.test(msg) ||
         /^[✅👍]/.test(msg) ||
         /^可以/.test(msg) ||
         /^好的/.test(msg) ||
         /^ok/i.test(msg);
}

// ====== 困难词检测 ======
function isStuck(msg: string): boolean {
  return /不.*会|不.*懂|不明白|没找到|找不到|没有|太难|花眼|迷路|怎么办|不知道|怕|😟|😵|😰/.test(msg);
}

// ====== 主逻辑 ======
function reply(input: string): AIResponse {
  const msg = input.trim();

  // 问候
  if (/^(你好|您好|嗨|早上好|下午好|晚上好|在吗|hi|hello)/i.test(msg)) {
    resetChatState();
    return {
      content: `${new Date().getHours() < 12 ? '上午好' : new Date().getHours() < 18 ? '下午好' : '晚上好'}！😊 我是您的数字生活陪练"小慢"。\n\n想学什么？不着急，慢慢来～`,
      suggestions: ['怎么用手机挂号？🏥', '怎么缴水电费？💡', '怎么用手机打车？🚗', '怎么跟家人视频？📞', '帮我看短信是不是诈骗 🛡️', '想学在网上买东西 🛒'],
    };
  }

  // 切换任务
  if (/换.*话题|别的|其他|学.*别的|想学别|📚/.test(msg)) {
    resetChatState();
    return {
      content: '没问题！想学哪个？👇',
      suggestions: ['怎么用手机挂号？🏥', '怎么缴水电费？💡', '怎么用手机打车？🚗', '怎么跟家人视频？📞', '帮我看短信是不是诈骗 🛡️', '想学在网上买东西 🛒'],
    };
  }

  // 重学当前任务
  if (/重学|从头|再.*学.*遍|🔄/.test(msg)) {
    if (state.activeTask && TASKS[state.activeTask]) {
      state.currentStep = 0;
    } else {
      resetChatState();
      return { content: '您想学什么？选一个吧 👇', suggestions: ['怎么用手机挂号？🏥', '怎么缴水电费？💡', '怎么跟家人视频？📞', '防骗指南 🛡️'] };
    }
  }

  // 检测新任务意图（切换或初次进入）
  const detected = detectTask(msg);
  if (detected) {
    if (detected !== state.activeTask) {
      const flow = TASKS[detected];
      state.activeTask = detected;
      state.currentStep = 1;
      return { content: flow.steps[0].content, suggestions: flow.steps[0].suggestions };
    }
  }

  // 当前任务中
  if (state.activeTask && TASKS[state.activeTask]) {
    const flow = TASKS[state.activeTask];

    if (isStuck(msg)) {
      // 用户卡住了，给当前步骤的帮助
      const step = flow.steps[Math.max(0, state.currentStep - 1)];
      return {
        content: `没关系，不着急～\n\n咱们在第 ${state.currentStep} 步。\n\n${step.content}`,
        suggestions: step.suggestions,
      };
    }

    if (/再讲|重复|没听懂|没听清|再说|再.*一遍/.test(msg)) {
      const step = flow.steps[Math.max(0, state.currentStep - 1)];
      return { content: `好的，我再讲一遍：\n\n${step.content}`, suggestions: step.suggestions };
    }

    if (isAdvance(msg)) {
      state.currentStep += 1;
      if (state.currentStep > flow.steps.length) {
        // 全部学完
        const done = {
          content: `🎉「${flow.title}」全部学完啦！\n\n你又掌握了一项新技能，真的很棒！\n\n还想学什么？`,
          suggestions: ['想学别的 📚', '重学一遍 🔄', '这就够了，谢谢 😊'],
        };
        resetChatState();
        return done;
      }
      const step = flow.steps[state.currentStep - 1];
      return { content: step.content, suggestions: step.suggestions };
    }

    // 默认：保持当前步骤
    const step = flow.steps[Math.max(0, state.currentStep - 1)];
    return { content: `咱们继续学「${flow.title}」～\n\n${step.content}`, suggestions: step.suggestions };
  }

  // 无任务，感谢收尾
  if (/谢谢|感谢|太.*好|棒|厉害|开心|🥰|🙏/.test(msg) || /🎉/.test(msg)) {
    return {
      content: '不客气！😊 能帮到您我也很开心！\n\n还想学什么？随时找我～',
      suggestions: ['怎么用手机挂号？🏥', '怎么缴水电费？💡', '怎么跟家人视频？📞', '防骗指南 🛡️'],
    };
  }

  // 兜底
  return {
    content: '您想学什么？我一步一步陪着您练～\n\n选一个试试吧 👇',
    suggestions: ['怎么用手机挂号？🏥', '怎么缴水电费？💡', '怎么用手机打车？🚗', '怎么跟家人视频？📞', '帮我看短信是不是诈骗 🛡️', '想学在网上买东西 🛒'],
  };
}

// ====== 对外接口 ======
export function getMockReply(userInput?: string): AIResponse {
  return reply(userInput || '');
}

export function getMockReplyAsync(userInput?: string): Promise<AIResponse> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(reply(userInput || '')), 600 + Math.random() * 800);
  });
}
