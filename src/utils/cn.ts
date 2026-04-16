import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  if (days < 30) return `${Math.floor(days / 7)}周前`;
  return date.toLocaleDateString('zh-CN');
}

export function formatNumber(num: number): string {
  if (num >= 10000) return `${(num / 10000).toFixed(1)}万`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

export function getDifficultyStars(level: number): string {
  return '⭐'.repeat(level) + '☆'.repeat(5 - level);
}

export function getDifficultyLabel(level: number): string {
  const labels = ['', '入门', '简单', '中等', '进阶', '大师'];
  return labels[level] || '';
}

export function getStatusLabel(status: string): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    planning: { label: '计划中', color: 'bg-blue-100 text-blue-700' },
    in_progress: { label: '编织中', color: 'bg-brand-100 text-brand-700' },
    paused: { label: '已暂停', color: 'bg-yellow-100 text-yellow-700' },
    completed: { label: '已完成', color: 'bg-green-100 text-green-700' },
    abandoned: { label: '已放弃', color: 'bg-gray-100 text-gray-500' },
  };
  return map[status] || { label: status, color: 'bg-gray-100 text-gray-500' };
}

export function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    knitting: '棒针', crochet: '钩针', weaving: '梭织', embroidery: '刺绣',
    clothing: '衣物', amigurumi: '玩偶', accessories: '配饰', home_decor: '家居',
    sweater: '毛衣', cardigan: '开衫', scarf: '围巾', hat: '帽子', socks: '袜子',
    blanket: '毯子', shawl: '披肩', vest: '背心', other: '其他',
  };
  return map[category] || category;
}
