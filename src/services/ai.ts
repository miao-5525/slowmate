/**
 * 「慢慢来」AI 陪练 —— 有状态对话树引擎
 *
 * 记住当前在聊的任务和步骤，支持 5-8 轮连续对话。
 * 每轮返回 AI 回复 + 2-4 个可选后续，点一下继续聊。
 */

export interface AIResponse {
  content: string;
  suggestions: string[];
}

// ====== 对话状态 ======
interface ChatState {
  activeTask: string | null;    // 当前任务 ID
  currentStep: number;          // 当前第几步（1-based）
  totalSteps: number;           // 总步数
}

let state: ChatState = {
  activeTask: null,
  currentStep: 0,
  totalSteps: 0,
};

/** 重置对话状态 */
export function resetChatState() {
  state = { activeTask: null, currentStep: 0, totalSteps: 0 };
}

// ====== 任务定义 ======
interface TaskFlow {
  id: string;
  title: string;
  emoji: string;
  totalSteps: number;
  // 每步的 AI 回复 + 可选后续
  steps: {
    content: string;
    suggestions: string[];
  }[];
}

const TASK_FLOWS: Record<string, TaskFlow> = {
  guahao: {
    id: 'guahao', title: '线上挂号', emoji: '🏥', totalSteps: 5,
    steps: [
      {
        content: '好的！咱们来学「🏥 线上挂号」。一共有 5 步，不着急～\n\n第 1 步：打开微信，点顶部的 🔍 搜索框，输入您要去的医院名字。\n\n找到医院公众号后点「关注」。注意看名字旁边有没有蓝色 ✓ 认证标志，有才是正规的。',
        suggestions: ['找到了！然后呢？', '没找到这个医院 😟', '什么是认证标志？'],
      },
      {
        content: '很好！👏\n\n第 2 步：进入公众号后，看底部菜单栏。点「就医服务」（有的叫「医疗服务」或「门诊服务」），再选「预约挂号」。\n\n一般在菜单最左边或中间位置。',
        suggestions: ['看到了，进去了！', '有好几个选项，点哪个？😵', '需要先登录或绑卡吗？'],
      },
      {
        content: '正常，第一次用需要绑定就诊卡或身份证。按提示填写姓名、身份证号、手机号就行。\n\n第 3 步：绑定后就能看到科室列表了。感冒看「内科」，牙疼看「口腔科」，不确定就选「全科门诊」。\n\n往下滑可以看到所有科室哦～',
        suggestions: ['选好科室了！下一步？', '科室太多了，不知道挂哪个 🤔', '全科门诊在哪里？'],
      },
      {
        content: '选全科门诊就对了！\n\n第 4 步：选好科室后，会显示可以预约的日期和医生。🟢 绿色表示有号，⬜ 灰色表示约满了。\n\n选一个您方便的日子和时间段。专家号挂不上就先挂「普通门诊」，也能看好。',
        suggestions: ['选好了！怎么付钱？💰', '都是灰色的，没号了 😟', '挂号要多少钱？'],
      },
      {
        content: '挂号费一般在 ¥10-50 左右，微信支付就行。\n\n第 5 步（最后一步！）：仔细核对日期、科室、医生都对，点「确认挂号」付款。\n\n付完款会收到短信通知，上面有就诊时间和地点。\n\n🛡️ 正规平台不会要求额外转账给个人！',
        suggestions: ['学会了！谢谢小慢 🎉', '再从头学一遍 🔄', '还想了解怎么缴费 💡'],
      },
    ],
  },

  jiaofei: {
    id: 'jiaofei', title: '生活缴费', emoji: '💡', totalSteps: 3,
    steps: [
      {
        content: '好的！学「💡 生活缴费」。一共 3 步～\n\n第 1 步：打开微信 → 右下角「我」→「服务」→「生活缴费」。\n\n您会看到水费、电费、燃气费、固话费这些图标。点您要交的那个。\n\n🛡️ 注意：只用微信/支付宝官方入口，不要扫陌生人给的缴费二维码！',
        suggestions: ['找到了！然后呢？', '要输入户号，在哪找？📋', '没用过，怕点错了 😟'],
      },
      {
        content: '户号在以前的纸质缴费单上能找到，是一串数字。\n\n第 2 步：输入户号后点确认，系统会自动查到您的账单。户号只用输一次，以后就记住了。\n\n核对一下户名是不是您的名字，金额对不对。',
        suggestions: ['都对！怎么付款？💳', '显示的名字不对 😟', '金额比以前贵了好多'],
      },
      {
        content: '第 3 步（最后一步！）：确认无误后，点「立即缴费」，用微信支付就行了。\n\n交完会有成功提示，也会收到微信支付凭证。\n\n以后每个月在「生活缴费」里都能看到账单，点一下就能交。再也不用跑营业厅啦 🎉',
        suggestions: ['太方便了！谢谢 🎉', '还想学别的 📚', '如果再学一遍 🔄'],
      },
    ],
  },

  dache: {
    id: 'dache', title: '打车出行', emoji: '🚗', totalSteps: 4,
    steps: [
      {
        content: '好的！学「🚗 打车出行」。一共 4 步～\n\n第 1 步：在微信聊天页面，手指往下拉一下，会出现「最近使用的小程序」。找到「滴滴出行」点开。\n\n手机会自动定位您现在的位置作为上车点。',
        suggestions: ['打开了！然后怎么叫车？', '找不到滴滴出行 😟', '手机定位准吗？'],
      },
      {
        content: '第 2 步：在「您去哪儿」输入框里输入要去的地方，比如小区名字、商场名字。\n\n输完后系统会显示预估价格，不同车型价格不一样。\n\n🛡️ 上车前一定要核对车牌号！',
        suggestions: ['选好了！叫车！🚗', '可以选什么车？有区别吗？', '怕司机找不到我 😟'],
      },
      {
        content: '第 3 步：选好目的地后点「呼叫」，系统自动找附近司机。\n\n叫到车后会显示：司机照片、车牌号、预计几分钟到。\n\n站在定位地点等就行，车到了对照车牌确认再上车。\n\n💡 可以用「分享行程」功能把行程发给家人，让他们知道你去哪儿。',
        suggestions: ['上车了！然后呢？', '怎么付钱？要现金吗？💰', '司机绕路了怎么办？'],
      },
      {
        content: '第 4 步（最后一步！）：到达后，微信自动扣款，不用付现金。\n\n下车前检查一下有没有落东西。可以在 App 里给司机打分。\n\n🛡️ 如果在车上不舒服或司机绕路，App 里有「紧急求助」按钮。',
        suggestions: ['学会了！很方便 🎉', '还想学别的 📚', '再学一遍打车 🔄'],
      },
    ],
  },

  shipin: {
    id: 'shipin', title: '视频通话', emoji: '📞', totalSteps: 3,
    steps: [
      {
        content: '好的！学「📞 视频通话」。一共 3 步，很简单～\n\n第 1 步：打开微信 → 底部「通讯录」→ 找到您想视频的人。\n\n或者在聊天列表里，直接点开和 ta 的对话框。\n\n💡 用家里 WiFi 打视频不费流量哦！',
        suggestions: ['找到了！怎么打视频？📹', '联系人太多了找不到 😟', '对方需要装什么软件？'],
      },
      {
        content: '第 2 步：进入聊天窗口后，点右下角的「⊕」加号 → 选「视频通话」→ 再点「开始视频通话」。\n\n对方手机会响铃，和打电话一样，等 ta 接就行啦。\n\n接通后就能看到对方了！说话声音大一点，你也能听到 ta 的声音。',
        suggestions: ['打通了！好开心 😊', '画面不清楚怎么办？📱', '能看到孙子了！然后怎么挂？'],
      },
      {
        content: '第 3 步：如果画面卡顿，换个离 WiFi 近一点的地方。\n\n想让对方看您身边的东西（比如猫、花），可以点屏幕上的「切换摄像头」按钮。\n\n聊完了点红色的电话图标就挂断了。免费的，不花钱～\n\n以后想谁了就打个视频，随时都能见！🎉',
        suggestions: ['太开心了！谢谢 🥰', '还想学别的 📚', '怎么把视频过程录下来？'],
      },
    ],
  },

  gouwu: {
    id: 'gouwu', title: '手机购物', emoji: '🛒', totalSteps: 5,
    steps: [
      {
        content: '好的！学「🛒 手机购物」。一共 5 步，慢慢来～\n\n第 1 步：打开淘宝或拼多多 App。在顶部搜索框里打字搜您想买的东西，比如"老年健步鞋"。\n\n搜出来后可以上下滑看更多商品，点图片看大图和详细介绍。\n\n🛡️ 只在官方 App 里买，不要点别人发来的链接！',
        suggestions: ['搜出来了！然后怎么选？', '好多商品，挑花眼了 😵', '怎么知道哪个靠谱？'],
      },
      {
        content: '第 2 步：看中一个商品后点进去。先看评价——点「评价」看其他买家怎么说。\n\n多看有图片的评价，那些更真实。商品评分 4.5 以上的一般质量不错。\n\n选好尺码、颜色后，下面有两个按钮：「加入购物车」可以继续看别的，「立即购买」直接下单。',
        suggestions: ['选好了！加入购物车 🛒', '怎么判断评价是不是假的？🤔', '价格比其他家贵好多'],
      },
      {
        content: '第 3 步：不急着买的话，加购物车是对的！可以多看几家对比。\n\n第 3 步：在购物车里，勾选要买的商品，点「结算」。\n\n第一次用需要填收货地址——收件人姓名、手机号、详细地址。填一次以后就记住了。',
        suggestions: ['地址填好了！怎么付钱？💳', '地址不想填太详细 😟', '可以送到家里吗？'],
      },
      {
        content: '第 4 步：选微信支付最方便。确认金额、地址都对，点「提交订单」。\n\n付款成功后，可以在「我的订单」里看物流——快递到哪了、预计哪天到。\n\n一般 2-5 天就能收到。',
        suggestions: ['付款了！怎么看快递？📦', '想改收货地址怎么办？', '万一买了不喜欢呢？'],
      },
      {
        content: '第 5 步（最后一步！）：收到包裹后，先检查商品有没有问题。\n\n满意的话在 App 上点「确认收货」。不满意可以申请「退货退款」，一般 7 天内都能退。\n\n🛡️ 退货退款在 App 里操作就行，不要信打电话说"帮您退款"的陌生人！',
        suggestions: ['全学会了！谢谢 🎉', '还想学别的 📚', '再学一遍购物 🔄'],
      },
    ],
  },

  fangpian: {
    id: 'fangpian', title: '防骗指南', emoji: '🛡️', totalSteps: 4,
    steps: [
      {
        content: '🛡️ 防骗是最重要的一课！一共 4 步。\n\n第 1 步：记住三个"绝对不"：\n\n❶ 验证码绝对不告诉任何人\n❷ 绝对不给陌生人转账\n❸ 陌生链接绝对不点\n\n📌 验证码就像您家门的钥匙，给别人就等于把门打开！',
        suggestions: ['记住了！还有什么要注意？', '验证码为什么这么重要？🔑', '哪些人会来骗验证码？'],
      },
      {
        content: '验证码一旦给别人，对方就能登录您的微信、支付宝，直接把钱转走！\n\n第 2 步：识别常见骗术——\n\n• "您中奖了，先交税"——骗人的！\n• "我是您孙子，急用钱"——先打给子女确认\n• "医保卡被停"——打 12333 核实\n• "快递丢了，点链接退款"——骗人的！\n\n您遇到过哪种？',
        suggestions: ['收到过中奖短信 📱', '有人打电话说是警察 😟', '朋友发链接让我帮忙点'],
      },
      {
        content: '这些都很常见！陌生人发的链接、中奖信息、催缴费的短信，十有八九是骗人的。\n\n第 3 步：遇到可疑情况怎么办？\n\n① 先挂电话，别急着操作\n② 给子女或亲友打电话问一下\n③ 打 96110（全国反诈热线）咨询\n④ 被骗了马上打 110\n\n时间越短追回的可能越大！',
        suggestions: ['如果有人让我转账怎么办？😟', '已经被骗了怎么办？', '怎么跟家里人说这些？'],
      },
      {
        content: '第 4 步（最重要！）：如果被骗了，别慌，也别觉得丢人——骗子就是利用人的善良。\n\n1️⃣ 马上打 110 报警\n2️⃣ 联系银行冻结账户\n3️⃣ 保留聊天记录和转账截图\n\n🛡️ 把这些也告诉身边的老朋友，大家互相提醒，骗子就没机会了！\n\n您今天学到的防骗知识，可能帮您守住一辈子的积蓄。',
        suggestions: ['谢谢！这个太重要了 🙏', '再学一遍防骗 🔄', '还想想学别的 📚'],
      },
    ],
  },
};

// ====== 意图识别 ======
function detectTask(input: string): string | null {
  const m = input;
  if (/挂号|医院|看病|预约|门诊|科室/.test(m)) return 'guahao';
  if (/缴费|水费|电费|燃气|煤气|话费|宽带|账单/.test(m)) return 'jiaofei';
  if (/打车|出行|滴滴|叫车|导航|出门/.test(m)) return 'dache';
  if (/视频|视频通话|视频聊天|打.*电话|儿女|家人|孙子|见.*面/.test(m)) return 'shipin';
  if (/购物|买东西|淘宝|拼多多|快递|下单/.test(m)) return 'gouwu';
  if (/诈骗|骗子|防骗|验证码|转账|汇款|中奖|陌生.*链接|密码|银行卡|安全/.test(m)) return 'fangpian';
  return null;
}

// ====== 主逻辑 ======
function reply(input: string): AIResponse {
  const msg = input.trim();

  // -- 问候重置 --
  if (/^(你好|您好|嗨|早上好|下午好|晚上好|在吗|hi|hello)/i.test(msg)) {
    resetChatState();
    const h = new Date().getHours();
    const g = h < 12 ? '上午好' : h < 18 ? '下午好' : '晚上好';
    return {
      content: `${g}！😊 我是您的数字生活陪练"小慢"。\n\n您想学点什么？不着急，咱们一步一步来～`,
      suggestions: [
        '怎么用手机挂号？🏥',
        '怎么缴水电费？💡',
        '怎么用手机打车？🚗',
        '怎么跟家人视频？📞',
        '帮我看短信是不是诈骗 🛡️',
        '想学在网上买东西 🛒',
      ],
    };
  }

  // -- 通用导航 --
  if (/换.*话题|别的|其他|再学|还想学|学.*别的|想学别/.test(msg) || /^📚/.test(msg)) {
    resetChatState();
    return {
      content: '没问题！想学哪个？选一个吧 👇',
      suggestions: [
        '怎么用手机挂号？🏥',
        '怎么缴水电费？💡',
        '怎么用手机打车？🚗',
        '怎么跟家人视频？📞',
        '帮我看短信是不是诈骗 🛡️',
        '想学在网上买东西 🛒',
      ],
    };
  }

  // -- 重新学当前任务 --
  if (/重学|从头|再.*学.*遍|🔄/.test(msg)) {
    if (state.activeTask && TASK_FLOWS[state.activeTask]) {
      state.currentStep = 0;
    } else {
      resetChatState();
      return {
        content: '好的！您想学什么呢？',
        suggestions: ['怎么用手机挂号？🏥', '怎么缴水电费？💡', '怎么视频通话？📞', '防骗指南 🛡️'],
      };
    }
  }

  // -- 检测任务意图 --
  const detected = detectTask(msg);
  if (detected && detected !== state.activeTask) {
    // 切换任务
    const flow = TASK_FLOWS[detected];
    state.activeTask = detected;
    state.currentStep = 1;
    state.totalSteps = flow.totalSteps;
    return { content: flow.steps[0].content, suggestions: flow.steps[0].suggestions };
  }

  // -- 当前任务中，推进步骤 --
  if (state.activeTask && TASK_FLOWS[state.activeTask]) {
    const flow = TASK_FLOWS[state.activeTask];

    // 「下一步」或类似推进词 → 进入下一 step
    if (/下一步|然后|接着|之后|继续|好了|可以了|完成了|学到了|懂了|选好了|找到了|打开了/.test(msg) ||
        /^[👍✅]/.test(msg) || /^可以/.test(msg)) {

      state.currentStep = Math.min(state.currentStep + 1, flow.totalSteps);

      if (state.currentStep > flow.totalSteps) {
        // 已完成
        const done = {
          content: `🎉「${flow.title}」全部学完了！\n\n您今天又掌握了一项新技能，真的非常棒！\n\n还想学什么？`,
          suggestions: ['再学一个别的 📚', '重学一遍 🔄', '这就够啦，谢谢！😊'],
        };
        resetChatState();
        return done;
      }

      const step = flow.steps[state.currentStep - 1];
      return { content: step.content, suggestions: step.suggestions };
    }

    // 「再讲一遍」→ 重复当前步骤
    if (/再讲|重复|没听懂|没听清|再说|再.*一遍/.test(msg)) {
      const step = flow.steps[state.currentStep - 1];
      return {
        content: `好的，我再讲一遍：\n\n${step.content}`,
        suggestions: step.suggestions,
      };
    }

    // 「不会/不懂/没找到」→ 回到当前步骤给帮助
    if (/不会|不懂|不明白|没找到|找不到|没有|太难|花眼|迷路/.test(msg) || /😟|😵/.test(msg)) {
      const step = flow.steps[state.currentStep - 1];
      return {
        content: `没关系，不着急～\n\n现在咱们在第 ${state.currentStep} 步。\n\n${step.content}`,
        suggestions: step.suggestions,
      };
    }

    // 其他输入 → 保持在当前步骤，重新给出选项
    const step = flow.steps[state.currentStep - 1];
    return {
      content: `咱们继续学「${flow.title}」。现在在第 ${state.currentStep} 步～\n\n${step.content}`,
      suggestions: step.suggestions,
    };
  }

  // -- 无活跃任务，通用回复 --
  if (/谢谢|感谢|太.*好|棒|厉害|开心/.test(msg) || /🎉|🥰/.test(msg)) {
    return {
      content: '不客气！😊 能帮到您我也很开心！\n\n还想学点什么吗？随时找我～',
      suggestions: ['怎么用手机挂号？🏥', '想了解防骗知识 🛡️', '怎么跟儿女视频？📞'],
    };
  }

  // 默认引导
  return {
    content: '您想学什么？我一步一步陪着您练～\n\n选一个试试吧 👇',
    suggestions: [
      '怎么用手机挂号？🏥',
      '怎么缴水电费？💡',
      '怎么用手机打车？🚗',
      '怎么跟家人视频？📞',
      '帮我看短信是不是诈骗 🛡️',
      '想学在网上买东西 🛒',
    ],
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
