// ============== User Types ==============
export interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  title: string;
  bio: string;
  stats: UserStats;
  joinDate: string;
  badges: Badge[];
}

export interface UserStats {
  projects: number;
  completed: number;
  followers: number;
  following: number;
  posts: number;
  patterns: number;
}

// ============== Pattern / Chart Types ==============
export interface Pattern {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  author: User;
  difficulty: 1 | 2 | 3 | 4 | 5;
  category: PatternCategory;
  tags: string[];
  tools: string[];
  yarns: YarnInfo[];
  gauge?: GaugeInfo;
  steps: PatternStep[];
  likes: number;
  saves: number;
  createdAt: string;
  updatedAt: string;
}

export type PatternCategory = 
  | 'sweater' | 'cardigan' | 'scarf' | 'hat' | 'socks' 
  | 'blanket' | 'amigurumi' | 'shawl' | 'vest' | 'other';

export interface PatternStep {
  id: string;
  row: number;
  instruction: string;
  stitchType: string;
  stitchCount: number;
  note?: string;
}

export interface GaugeInfo {
  rowsPer10cm: number;
  stitchesPer10cm: number;
  needleSize: string;
}

export interface ChartSymbol {
  symbol: string;
  name: string;
  description: string;
  color?: string;
}

export interface StitchChart {
  id: string;
  name: string;
  rows: number;
  cols: number;
  symbols: ChartSymbol[][];
  stitchTypes: string[][];
}

// ============== Yarn / Material Types ==============
export interface YarnInfo {
  id: string;
  brand: string;
  series: string;
  name: string;
  color: string;
  colorCode: string;
  composition: string;
  weight: number; // grams per ball
  yardage: number; // meters per ball
  suitableNeedle: string;
  price: number;
  rating: number;
  reviews: number;
  imageUrl: string;
}

export interface MaterialEstimate {
  yarnId: string;
  yarnName: string;
  color: string;
  ballsNeeded: number;
  totalWeight: number;
  estimatedCost: number;
  purchaseLinks: PurchaseLink[];
}

export interface PurchaseLink {
  platform: string;
  price: number;
  url: string;
  inStock: boolean;
}

// ============== Project Types ==============
export interface Project {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  owner: User;
  pattern?: Pattern;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  targetDate?: string;
  completedDate?: string;
  yarnsUsed: YarnInfo[];
  modifications: string[];
  journal: JournalEntry[];
  totalTime: number; // hours
  images: ProjectImage[];
}

export type ProjectStatus = 'planning' | 'in_progress' | 'paused' | 'completed' | 'abandoned';

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  images: string[];
  stitches?: string;
  mood?: 'happy' | 'frustrated' | 'proud' | 'neutral';
  progress?: number;
}

export interface ProjectImage {
  id: string;
  url: string;
  caption: string;
  date: string;
}

// ============== Community Types ==============
export interface Post {
  id: string;
  author: User;
  title: string;
  content: string;
  category: CommunityCategory;
  tags: string[];
  type: PostType;
  images: string[];
  linkedPattern?: Pattern;
  linkedProject?: Project;
  likes: number;
  comments: Comment[];
  views: number;
  createdAt: string;
  isResolved?: boolean;
  isArchived?: boolean;
}

export type CommunityCategory = 
  | 'knitting' | 'crochet' | 'weaving' | 'embroidery'
  | 'clothing' | 'amigurumi' | 'accessories' | 'home_decor';

export type PostType = 'question' | 'tutorial' | 'discussion' | 'showcase' | 'help';

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
  isAnswer?: boolean;
  replies?: Comment[];
}

// ============== Activity Types ==============
export interface Activity {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  type: 'challenge' | 'along' | 'contest';
  participantCount: number;
  entries: ActivityEntry[];
  prizes: string[];
  status: 'upcoming' | 'active' | 'ended';
}

export interface ActivityEntry {
  id: string;
  project: Project;
  votes: number;
  author: User;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  points: number;
  completedProjects: number;
  badges: number;
}

// ============== Tutorial Types ==============
export interface Tutorial {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  author: User;
  difficulty: 1 | 2 | 3 | 4 | 5;
  type: 'article' | 'video' | 'photo';
  category: string;
  tags: string[];
  duration?: number; // minutes
  steps: TutorialStep[];
  likes: number;
  saves: number;
  createdAt: string;
}

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  image?: string;
  videoUrl?: string;
  tip?: string;
}
