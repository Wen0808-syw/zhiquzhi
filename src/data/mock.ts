import type { User, Pattern, Project, Post, Activity, Tutorial, YarnInfo, Badge, LeaderboardEntry, JournalEntry } from '@/types';

// ============== Mock Users ==============
export const currentUser: User = {
  id: 'u1',
  name: '织梦小筑',
  avatar: '🧑‍🎨',
  level: 12,
  title: '资深织女',
  bio: '编织让我在纷繁世界中找到宁静的角落 🧶',
  joinDate: '2023-06-15',
  stats: { projects: 28, completed: 22, followers: 1234, following: 89, posts: 45, patterns: 8 },
  badges: [
    { id: 'b1', name: '初心织女', icon: '🌱', description: '完成第一个作品', earnedDate: '2023-06-20', rarity: 'common' },
    { id: 'b2', name: '棒针达人', icon: '🪡', description: '完成10件棒针作品', earnedDate: '2024-01-10', rarity: 'rare' },
    { id: 'b3', name: '图解大师', icon: '📐', description: '发布5个原创图解', earnedDate: '2024-05-15', rarity: 'epic' },
    { id: 'b4', name: '百日编织', icon: '🔥', description: '连续100天坚持编织', earnedDate: '2024-09-20', rarity: 'legendary' },
  ],
};

export const mockUsers: User[] = [
  currentUser,
  {
    id: 'u2', name: '毛线球球', avatar: '👩‍🎨', level: 18, title: '钩针大师',
    bio: '爱钩针、爱分享、爱生活中的一切美好', joinDate: '2022-03-10',
    stats: { projects: 56, completed: 48, followers: 5678, following: 234, posts: 120, patterns: 25 },
    badges: [{ id: 'b5', name: '社区之星', icon: '⭐', description: '获赞超过5000', earnedDate: '2024-02-15', rarity: 'legendary' }],
  },
  {
    id: 'u3', name: '编织日记', avatar: '🧶', level: 9, title: '进阶织女',
    bio: '记录每一针每一线的故事', joinDate: '2024-01-05',
    stats: { projects: 15, completed: 10, followers: 456, following: 67, posts: 23, patterns: 3 },
    badges: [],
  },
  {
    id: 'u4', name: '苏小暖', avatar: '🌸', level: 15, title: '配色高手',
    bio: '在色彩中寻找灵感', joinDate: '2022-11-20',
    stats: { projects: 38, completed: 32, followers: 3456, following: 156, posts: 78, patterns: 15 },
    badges: [{ id: 'b6', name: '万紫千红', icon: '🎨', description: '使用超过50种颜色的作品', earnedDate: '2024-06-01', rarity: 'epic' }],
  },
];

// ============== Mock Yarns ==============
export const mockYarns: YarnInfo[] = [
  { id: 'y1', brand: '和麻纳卡', series: '圆球系列', name: '可爱圆球棉', color: '奶油白', colorCode: '#FFF8F0', composition: '100%棉', weight: 40, yardage: 130, suitableNeedle: '3-4mm', price: 12.5, rating: 4.8, reviews: 2340, imageUrl: '' },
  { id: 'y2', brand: '达夫棉', series: '经典系列', name: '达夫棉DK', color: '樱花粉', colorCode: '#FFB7C5', composition: '100%羊毛', weight: 50, yardage: 100, suitableNeedle: '4-5mm', price: 28, rating: 4.6, reviews: 1856, imageUrl: '' },
  { id: 'y3', brand: 'Hobby Lobby', series: 'I Love This Yarn', name: '柔软美利奴', color: '薰衣草紫', colorCode: '#C5A3FF', composition: '80%美利奴 20%尼龙', weight: 100, yardage: 180, suitableNeedle: '5-6mm', price: 35, rating: 4.9, reviews: 3200, imageUrl: '' },
  { id: 'y4', brand: 'DMC', series: 'Natura', name: '自然棉线', color: '鼠尾草绿', colorCode: '#A8D5BA', composition: '100%棉', weight: 50, yardage: 135, suitableNeedle: '3-4mm', price: 18, rating: 4.7, reviews: 1560, imageUrl: '' },
  { id: 'y5', brand: '可钩', series: '蕾丝系列', name: '蕾丝棉线', color: '雾蓝', colorCode: '#87CEEB', composition: '100%棉', weight: 25, yardage: 160, suitableNeedle: '1.5-2mm', price: 8, rating: 4.5, reviews: 980, imageUrl: '' },
  { id: 'y6', brand: 'WALNUT', series: '云朵系列', name: '云朵宝宝绒', color: '鹅黄', colorCode: '#FFE599', composition: '60%羊毛 40%腈纶', weight: 50, yardage: 120, suitableNeedle: '5-6mm', price: 22, rating: 4.7, reviews: 2100, imageUrl: '' },
];

// ============== Mock Patterns ==============
export const mockPatterns: Pattern[] = [
  {
    id: 'p1', title: '春日花园开衫', description: '一款适合初学者的棒针开衫，采用从上往下编织法，花园蕾丝花样点缀肩部。', coverImage: '', author: mockUsers[1],
    difficulty: 3, category: 'cardigan', tags: ['棒针', '开衫', '蕾丝', '春装'], tools: ['4mm棒针', '记号扣', '缝针'],
    yarns: [mockYarns[1]], gauge: { rowsPer10cm: 28, stitchesPer10cm: 22, needleSize: '4mm' },
    steps: [
      { id: 's1', row: 1, instruction: '起112针，分配到前后片及袖子', stitchType: '起针', stitchCount: 112 },
      { id: 's2', row: 2, instruction: '第1行（正面）: 下针织到前片结束', stitchType: '下针', stitchCount: 112 },
      { id: 's3', row: 3, instruction: '第2行（反面）: 上针到前片', stitchType: '上针', stitchCount: 112 },
      { id: 's4', row: 4, instruction: '开始花园花样: *2下针, 加1, 3下针, 左上2并1, 2下针*', stitchType: '花样', stitchCount: 120 },
    ],
    likes: 2340, saves: 1890, createdAt: '2024-10-15', updatedAt: '2024-11-20',
  },
  {
    id: 'p2', title: '小熊玩偶', description: '超可爱的钩针小熊玩偶，适合进阶编织者。成品高约20cm。', coverImage: '', author: mockUsers[0],
    difficulty: 4, category: 'amigurumi', tags: ['钩针', '玩偶', '小熊', '进阶'], tools: ['3mm钩针', '填充棉', '安全眼'],
    yarns: [mockYarns[0], mockYarns[2]],
    steps: [
      { id: 's5', row: 1, instruction: '环起6短针', stitchType: '短针', stitchCount: 6 },
      { id: 's6', row: 2, instruction: '每针加1 = 12短针', stitchType: '短针加针', stitchCount: 12 },
      { id: 's7', row: 3, instruction: '*1短针, 加1* x6 = 18短针', stitchType: '短针加针', stitchCount: 18 },
    ],
    likes: 5670, saves: 4320, createdAt: '2024-08-20', updatedAt: '2024-09-05',
  },
  {
    id: 'p3', title: '经典费尔岛提花围巾', description: '传统费尔岛配色围巾，学习双色提花编织的最佳选择。', coverImage: '', author: mockUsers[3],
    difficulty: 4, category: 'scarf', tags: ['棒针', '提花', '费尔岛', '冬季'], tools: ['4mm棒针', '辅色线'],
    yarns: [mockYarns[1], mockYarns[3]],
    steps: [
      { id: 's8', row: 1, instruction: '起100针（底色）', stitchType: '起针', stitchCount: 100 },
      { id: 's9', row: 2, instruction: '第1行花样: 交替使用底色和配色编织', stitchType: '提花', stitchCount: 100 },
    ],
    likes: 3210, saves: 2560, createdAt: '2024-11-01', updatedAt: '2024-12-01',
  },
  {
    id: 'p4', title: '贝雷帽', description: '优雅的法式贝雷帽，适合秋冬搭配。从帽顶向帽缘编织。', coverImage: '', author: mockUsers[2],
    difficulty: 2, category: 'hat', tags: ['棒针', '帽子', '秋冬', '入门'], tools: ['5mm棒针', '记号扣'],
    yarns: [mockYarns[5]],
    steps: [
      { id: 's10', row: 1, instruction: '起8针，均分到4根针', stitchType: '起针', stitchCount: 8 },
      { id: 's11', row: 2, instruction: '每圈每针加1 = 16针', stitchType: '下针加针', stitchCount: 16 },
    ],
    likes: 1560, saves: 1230, createdAt: '2024-09-10', updatedAt: '2024-10-10',
  },
  {
    id: 'p5', title: '蕾丝夏衫', description: '轻盈透气的钩针蕾丝夏衫，适合炎炎夏日。', coverImage: '', author: mockUsers[1],
    difficulty: 5, category: 'sweater', tags: ['钩针', '蕾丝', '夏装', '大师'], tools: ['2mm钩针'],
    yarns: [mockYarns[4]],
    steps: [
      { id: 's12', row: 1, instruction: '从后背中心开始，网格起针', stitchType: '网格起针', stitchCount: 50 },
    ],
    likes: 4560, saves: 3890, createdAt: '2024-07-01', updatedAt: '2024-08-15',
  },
  {
    id: 'p6', title: '婴儿毯', description: '柔软温馨的宝宝毯子，格子花样的经典之作。', coverImage: '', author: mockUsers[0],
    difficulty: 2, category: 'blanket', tags: ['棒针', '毯子', '宝宝', '格子'], tools: ['5mm棒针'],
    yarns: [mockYarns[0]],
    steps: [
      { id: 's13', row: 1, instruction: '起120针', stitchType: '起针', stitchCount: 120 },
    ],
    likes: 1890, saves: 2100, createdAt: '2024-06-15', updatedAt: '2024-07-20',
  },
];

// ============== Mock Projects ==============
export const mockJournalEntries: JournalEntry[] = [
  { id: 'j1', date: '2026-04-15', title: '开始袖子', content: '今天终于完成了主体部分！袖子部分要特别注意花样对齐。', images: [], stitches: '下针', mood: 'happy', progress: 60 },
  { id: 'j2', date: '2026-04-10', title: '花样遇到困难', content: '花园花样第3-5行的加针总是数不对，重织了3次终于搞定 😅', images: [], stitches: '花样', mood: 'frustrated', progress: 40 },
  { id: 'j3', date: '2026-04-05', title: '选了樱花粉的线', content: '达夫棉DK的樱花粉色号太美了，决定用这个配色！', images: [], mood: 'happy', progress: 10 },
];

export const mockProjects: Project[] = [
  {
    id: 'proj1', title: '春日花园开衫 - 我的版本', description: '正在跟随毛线球球老师的图解编织，加入了个人修改。',
    coverImage: '', owner: currentUser, pattern: mockPatterns[0], status: 'in_progress', progress: 60,
    startDate: '2026-04-01', targetDate: '2026-05-15',
    yarnsUsed: [mockYarns[1], mockYarns[3]], modifications: ['肩部蕾丝花样改为叶子花样', '加长了袖口', '使用双色配色'],
    journal: mockJournalEntries, totalTime: 24, images: [],
  },
  {
    id: 'proj2', title: '小熊玩偶 - 送朋友的生日礼物', description: '准备在朋友生日前完成这个小熊。',
    coverImage: '', owner: currentUser, pattern: mockPatterns[1], status: 'completed', progress: 100,
    startDate: '2026-02-01', completedDate: '2026-03-10',
    yarnsUsed: [mockYarns[0]], modifications: ['帽子颜色改成了蓝色'],
    journal: [], totalTime: 18, images: [],
  },
  {
    id: 'proj3', title: '冬季提花围巾', description: '第一次尝试费尔岛提花，挑战双色编织！',
    coverImage: '', owner: currentUser, pattern: mockPatterns[2], status: 'planning', progress: 5,
    startDate: '2026-04-16', targetDate: '2026-06-30',
    yarnsUsed: [], modifications: [], journal: [], totalTime: 0, images: [],
  },
  {
    id: 'proj4', title: '苏小暖的贝雷帽仿织', description: '看到苏小暖的贝雷帽太美了，决定仿织一件！',
    coverImage: '', owner: mockUsers[3], pattern: mockPatterns[3], status: 'in_progress', progress: 80,
    startDate: '2026-03-20', targetDate: '2026-04-25',
    yarnsUsed: [mockYarns[5]], modifications: ['加了一圈双层帽缘'],
    journal: [], totalTime: 8, images: [],
  },
];

// ============== Mock Posts ==============
export const mockPosts: Post[] = [
  {
    id: 'post1', author: mockUsers[1], title: '求助！蕾丝花样总是歪怎么办？',
    content: '大家好！我在编织春日花园开衫的蕾丝部分时，花样总是出现偏移，有没有大佬能帮忙看看？附上我的作品照片...',
    category: 'knitting', tags: ['棒针', '蕾丝', '求助'], type: 'help',
    images: [], likes: 34, comments: [
      { id: 'c1', author: mockUsers[3], content: '可能是加针位置不对，建议每行结束放一个记号扣来帮助计数。', createdAt: '2026-04-14', likes: 12, isAnswer: true },
      { id: 'c2', author: mockUsers[2], content: '我也遇到过这个问题，后来发现是每行起始针数不对。', createdAt: '2026-04-14', likes: 5 },
    ],
    views: 567, createdAt: '2026-04-13', isResolved: false,
  },
  {
    id: 'post2', author: mockUsers[3], title: '分享一个超好用的配色技巧',
    content: '编织配色作品时，我有一个小技巧想分享给大家：用Excel建一个色板表，把所有色号的RGB值录入，可以快速预览配色效果...',
    category: 'knitting', tags: ['配色', '教程', '技巧'], type: 'tutorial',
    images: [], likes: 289, comments: [],
    views: 2340, createdAt: '2026-04-10',
  },
  {
    id: 'post3', author: mockUsers[2], title: '我的第一件提花毛衣完成了！',
    content: '历时两个月终于完成了！虽然有瑕疵但超级有成就感。用了5种颜色，费尔岛经典花样。感谢社区大家的帮助！',
    category: 'knitting', tags: ['提花', '费尔岛', '作品展示'], type: 'showcase',
    images: [], linkedProject: mockProjects[3], likes: 456, comments: [],
    views: 1890, createdAt: '2026-04-08',
  },
  {
    id: 'post4', author: mockUsers[0], title: '讨论：棒针 vs 钩针，你更偏爱哪个？',
    content: '作为两个都爱的织女，我很好奇大家更偏爱棒针还是钩针？我个人觉得棒针适合大件衣物，钩针更适合小件装饰品...',
    category: 'knitting', tags: ['棒针', '钩针', '讨论'], type: 'discussion',
    images: [], likes: 678, comments: [
      { id: 'c3', author: mockUsers[1], content: '钩针！速度快，花样也好看！', createdAt: '2026-04-12', likes: 34 },
      { id: 'c4', author: mockUsers[3], content: '棒针的质感更好，但钩针更便携。', createdAt: '2026-04-12', likes: 28 },
    ],
    views: 3456, createdAt: '2026-04-11',
  },
];

// ============== Mock Activities ==============
export const mockActivities: Activity[] = [
  {
    id: 'act1', title: '🌸 春日编织挑战', description: '用春日配色创作一件编织作品！任何类型都可以参加。',
    coverImage: '', startDate: '2026-04-01', endDate: '2026-05-31',
    type: 'challenge', participantCount: 456, entries: [],
    prizes: ['专属徽章', '100积分', '精选推荐位'],
    status: 'active',
  },
  {
    id: 'act2', title: '🐱 治愈系玩偶 Knit-Along', description: '一起来钩可爱的动物玩偶吧！每周更新一个部位的教学。',
    coverImage: '', startDate: '2026-03-15', endDate: '2026-06-15',
    type: 'along', participantCount: 789, entries: [],
    prizes: ['纪念徽章', '教学视频永久观看权'],
    status: 'active',
  },
  {
    id: 'act3', title: '❄️ 冬日温暖编织赛', description: '用你的作品温暖整个冬天！最佳创意奖等你来拿。',
    coverImage: '', startDate: '2026-12-01', endDate: '2027-02-28',
    type: 'contest', participantCount: 0, entries: [],
    prizes: ['冠军奖杯', '500元线材礼券', '年度织女称号'],
    status: 'upcoming',
  },
];

// ============== Mock Tutorials ==============
export const mockTutorials: Tutorial[] = [
  {
    id: 't1', title: '棒针入门：从零开始学会编织', description: '最全面的棒针入门教程，包含起针、下针、上针等基础针法。',
    coverImage: '', author: mockUsers[1], difficulty: 1, type: 'video', category: '棒针基础',
    tags: ['入门', '棒针', '视频'], duration: 45,
    steps: [
      { id: 'ts1', title: '认识工具', content: '了解棒针、毛线、记号扣等基本工具的选择和使用。', tip: '建议从4mm棒针和中粗线开始练习' },
      { id: 'ts2', title: '起针方法', content: '学习长尾起针法（Long Tail Cast On），这是最常用的起针方式。', tip: '预留的尾线长度约为需要针数的3倍' },
      { id: 'ts3', title: '下针', content: '棒针最基本的针法，也称为平针（Stockinette Stitch）。' },
      { id: 'ts4', title: '上针', content: '下针的反面，掌握下针和上针后可以编织无数花样。' },
    ],
    likes: 5670, saves: 8900, createdAt: '2024-01-15',
  },
  {
    id: 't2', title: '钩针蕾丝花边教程', description: '学会用钩针制作精美的蕾丝花边，可以装饰衣物和家居用品。',
    coverImage: '', author: mockUsers[3], difficulty: 3, type: 'article', category: '钩针进阶',
    tags: ['钩针', '蕾丝', '花边', '进阶'], duration: 30,
    steps: [
      { id: 'ts5', title: '认识钩针符号', content: '了解 crochet chart 中常见的符号和含义。' },
      { id: 'ts6', title: '基础链针和短针', content: '复习链针（ch）和短针（sc）的正确做法。' },
    ],
    likes: 3450, saves: 5670, createdAt: '2024-03-20',
  },
  {
    id: 't3', title: '费尔岛提花编织详解', description: '从基础双色提花到复杂费尔岛花样，系统学习提花编织技巧。',
    coverImage: '', author: mockUsers[0], difficulty: 4, type: 'video', category: '棒针进阶',
    tags: ['提花', '费尔岛', '配色', '进阶'], duration: 60,
    steps: [
      { id: 'ts7', title: '什么是费尔岛提花', content: '了解费尔岛编织的历史和特点。' },
    ],
    likes: 4560, saves: 6780, createdAt: '2024-05-10',
  },
];

// ============== Mock Leaderboard ==============
export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, user: mockUsers[1], points: 12580, completedProjects: 48, badges: 15 },
  { rank: 2, user: mockUsers[3], points: 9870, completedProjects: 32, badges: 12 },
  { rank: 3, user: mockUsers[0], points: 7650, completedProjects: 22, badges: 8 },
  { rank: 4, user: mockUsers[2], points: 5430, completedProjects: 10, badges: 5 },
];
