// localStorage 持久化工具

/**
 * 获取 localStorage 中的数据
 */
export function getStorageData<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * 设置 localStorage 中的数据
 */
export function setStorageData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error);
  }
}

/**
 * 删除 localStorage 中的数据
 */
export function removeStorageData(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error);
  }
}

// Storage keys
export const STORAGE_KEYS = {
  PROJECTS: 'zhiquzhi_projects',
  POSTS: 'zhiquzhi_posts',
  USER_LIKES: 'zhiquzhi_user_likes',
  USER_SAVES: 'zhiquzhi_user_saves',
  USER_SETTINGS: 'zhiquzhi_user_settings',
  RECENT_PATTERNS: 'zhiquzhi_recent_patterns',
} as const;
