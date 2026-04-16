import { useState } from 'react';
import {
  Settings,
  Heart,
  FolderKanban,
  Star,
  Award,
  Users,
  BookOpen,
  Edit3,
  Camera,
  Bell,
  Shield,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Download,
  Upload,
  ChevronRight,
  Check,
  Crown,
  Flame,
  Lock,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  Trophy,
  GitFork,
} from 'lucide-react';
import { cn, formatDate, formatNumber } from '@/utils/cn';
import { currentUser, mockProjects } from '@/data/mock';
import type { Badge } from '@/types';

// 未解锁徽章数据
const lockedBadges = [
  { id: 'l1', name: '配色大师', icon: '🎨', description: '创作使用10种以上颜色的作品', rarity: 'rare' as const },
  { id: 'l2', name: '社区领袖', icon: '👑', description: '获得5000粉丝关注', rarity: 'epic' as const },
  { id: 'l3', name: '年度织女', icon: '🏆', description: '年度排行榜前十', rarity: 'legendary' as const },
  { id: 'l4', name: '百件作品', icon: '💯', description: '累计完成100件作品', rarity: 'epic' as const },
];

// 可选头像表情
const avatarEmojis = ['🧑‍🎨', '👩‍🎨', '🧶', '🌸', '🎀', '🧵', '🪡', '🌺', '🌷', '🍀', '🌙', '⭐', '🦋', '🐱', '🐰'];

// 徽章稀有度颜色
const rarityColors = {
  common: 'bg-gray-100 text-gray-600 border-gray-200',
  rare: 'bg-blue-100 text-blue-600 border-blue-200',
  epic: 'bg-purple-100 text-purple-600 border-purple-200',
  legendary: 'bg-amber-100 text-amber-600 border-amber-200',
};

const rarityLabels = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};

// 最近7天编织时长数据（分钟）
const weeklyKnittingData = [45, 60, 30, 90, 120, 45, 75];
const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

// 近6个月完成项目趋势
const monthlyCompletedData = [2, 3, 1, 4, 2, 3];
const monthLabels = ['11月', '12月', '1月', '2月', '3月', '4月'];

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(currentUser.name);
  const [editedBio, setEditedBio] = useState(currentUser.bio);
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatar);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // 设置状态
  const [settings, setSettings] = useState({
    projectReminder: true,
    communityNotification: true,
    activityNotification: false,
    publicWorks: true,
    publicProgress: true,
    theme: 'warm',
    fontSize: 16,
  });

  // 计算本周总时长
  const weeklyTotalMinutes = weeklyKnittingData.reduce((a, b) => a + b, 0);
  const weeklyHours = Math.floor(weeklyTotalMinutes / 60);
  const weeklyMinutes = weeklyTotalMinutes % 60;

  // 计算近6个月完成总数
  const sixMonthTotal = monthlyCompletedData.reduce((a, b) => a + b, 0);

  // 获取最大值的百分比（用于柱状图高度）
  const maxWeekly = Math.max(...weeklyKnittingData);
  const maxMonthly = Math.max(...monthlyCompletedData);

  const handleSaveProfile = () => {
    // 这里可以调用API保存
    setIsEditing(false);
    setShowAvatarPicker(false);
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-warm-50 pb-20">
      {/* 顶部装饰 */}
      <div className="h-32 bg-gradient-to-r from-brand-400 to-brand-600" />

      <div className="max-w-4xl mx-auto px-4 -mt-16">
        {/* 个人资料卡片 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* 头像区域 */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-brand-300 via-brand-400 to-brand-500 p-1">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-5xl">
                    {selectedAvatar}
                  </div>
                </div>
                <button
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-brand-600 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              {/* 头像选择器 */}
              {showAvatarPicker && (
                <div className="absolute mt-2 bg-white rounded-xl shadow-xl border border-warm-200 p-3 z-10">
                  <div className="grid grid-cols-5 gap-2">
                    {avatarEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setSelectedAvatar(emoji)}
                        className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center text-xl hover:bg-warm-100 transition-colors',
                          selectedAvatar === emoji && 'bg-brand-100 ring-2 ring-brand-400'
                        )}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 用户信息 */}
            <div className="flex-1">
              {!isEditing ? (
                <>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold text-gray-900">{currentUser.name}</h1>
                    <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-medium">
                      {currentUser.title}
                    </span>
                  </div>
                  
                  {/* 等级和XP */}
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-amber-500" />
                      <span className="font-semibold text-gray-700">Lv.{currentUser.level}</span>
                    </div>
                    <div className="flex-1 max-w-xs">
                      <div className="h-2 bg-warm-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full"
                          style={{ width: '65%' }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">650 / 1000 XP</p>
                    </div>
                  </div>

                  <p className="mt-3 text-gray-600">{currentUser.bio}</p>
                  
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>加入于 {formatDate(currentUser.joinDate)}</span>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
                    <textarea
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              )}

              {/* 统计数据 */}
              <div className="mt-4 grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{currentUser.stats.projects}</p>
                  <p className="text-xs text-gray-500">项目数</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{currentUser.stats.completed}</p>
                  <p className="text-xs text-gray-500">已完成</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{formatNumber(currentUser.stats.followers)}</p>
                  <p className="text-xs text-gray-500">粉丝</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{currentUser.stats.following}</p>
                  <p className="text-xs text-gray-500">关注</p>
                </div>
              </div>
            </div>

            {/* 编辑按钮 */}
            <div className="flex-shrink-0">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  编辑资料
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedName(currentUser.name);
                      setEditedBio(currentUser.bio);
                      setSelectedAvatar(currentUser.avatar);
                      setShowAvatarPicker(false);
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    保存
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 个人徽章 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-500" />
              <h2 className="text-lg font-bold text-gray-900">个人徽章</h2>
            </div>
            <span className="text-sm text-gray-500">{currentUser.badges.length} / {currentUser.badges.length + lockedBadges.length}</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* 已解锁徽章 */}
            {currentUser.badges.map((badge: Badge) => (
              <div
                key={badge.id}
                className={cn(
                  'p-4 rounded-xl border-2 transition-all hover:shadow-md',
                  rarityColors[badge.rarity]
                )}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h3 className="font-semibold text-sm">{badge.name}</h3>
                <p className="text-xs opacity-80 mt-1 line-clamp-2">{badge.description}</p>
                {badge.earnedDate && (
                  <p className="text-xs opacity-60 mt-2">{formatDate(badge.earnedDate)}</p>
                )}
                <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-white/50">
                  {rarityLabels[badge.rarity]}
                </span>
              </div>
            ))}

            {/* 未解锁徽章 */}
            {lockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="p-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-400"
              >
                <div className="text-3xl mb-2 grayscale opacity-50">{badge.icon}</div>
                <h3 className="font-semibold text-sm">{badge.name}</h3>
                <p className="text-xs opacity-70 mt-1 line-clamp-2">{badge.description}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Lock className="w-3 h-3" />
                  <span className="text-xs">未解锁</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 数据统计 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-brand-500" />
            <h2 className="text-lg font-bold text-gray-900">数据统计</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 本月编织时长 */}
            <div className="p-4 bg-warm-50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">本月编织时长</span>
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {weeklyHours}<span className="text-sm font-normal text-gray-500">小时</span> {weeklyMinutes}<span className="text-sm font-normal text-gray-500">分钟</span>
              </p>
              
              {/* 7天柱状图 */}
              <div className="mt-4 flex items-end justify-between h-20 gap-2">
                {weeklyKnittingData.map((minutes, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-brand-400 rounded-t hover:bg-brand-500 transition-colors"
                      style={{ height: `${(minutes / maxWeekly) * 100}%`, minHeight: '4px' }}
                    />
                    <span className="text-xs text-gray-500">{weekDays[index]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 完成项目趋势 */}
            <div className="p-4 bg-warm-50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">近6个月完成项目</span>
                <Trophy className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {sixMonthTotal}<span className="text-sm font-normal text-gray-500">件</span>
              </p>
              
              {/* 6个月柱状图 */}
              <div className="mt-4 flex items-end justify-between h-20 gap-2">
                {monthlyCompletedData.map((count, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-brand-500 rounded-t hover:bg-brand-600 transition-colors"
                      style={{ height: `${(count / maxMonthly) * 100}%`, minHeight: '4px' }}
                    />
                    <span className="text-xs text-gray-500">{monthLabels[index]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 收藏图解数 */}
            <div className="p-4 bg-warm-50 rounded-xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-brand-500" />
                  <span className="text-sm text-gray-600">收藏图解数</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{currentUser.stats.patterns}</p>
              </div>
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-brand-500" />
              </div>
            </div>

            {/* 社区活跃度 */}
            <div className="p-4 bg-warm-50 rounded-xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-brand-500" />
                  <span className="text-sm text-gray-600">社区活跃度</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{currentUser.stats.posts}</p>
                <p className="text-xs text-gray-500">发帖数</p>
              </div>
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-brand-500" />
              </div>
            </div>
          </div>
        </div>

        {/* 设置 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-brand-500" />
            <h2 className="text-lg font-bold text-gray-900">设置</h2>
          </div>

          <div className="space-y-6">
            {/* 通知设置 */}
            <div className="p-4 bg-warm-50 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-4 h-4 text-brand-500" />
                <h3 className="font-semibold text-gray-900">通知设置</h3>
              </div>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-700">项目提醒</span>
                  <button
                    onClick={() => toggleSetting('projectReminder')}
                    className={cn(
                      'w-11 h-6 rounded-full transition-colors relative',
                      settings.projectReminder ? 'bg-brand-500' : 'bg-gray-300'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                        settings.projectReminder ? 'left-6' : 'left-1'
                      )}
                    />
                  </button>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-700">社区通知</span>
                  <button
                    onClick={() => toggleSetting('communityNotification')}
                    className={cn(
                      'w-11 h-6 rounded-full transition-colors relative',
                      settings.communityNotification ? 'bg-brand-500' : 'bg-gray-300'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                        settings.communityNotification ? 'left-6' : 'left-1'
                      )}
                    />
                  </button>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-700">活动通知</span>
                  <button
                    onClick={() => toggleSetting('activityNotification')}
                    className={cn(
                      'w-11 h-6 rounded-full transition-colors relative',
                      settings.activityNotification ? 'bg-brand-500' : 'bg-gray-300'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                        settings.activityNotification ? 'left-6' : 'left-1'
                      )}
                    />
                  </button>
                </label>
              </div>
            </div>

            {/* 显示设置 */}
            <div className="p-4 bg-warm-50 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <Monitor className="w-4 h-4 text-brand-500" />
                <h3 className="font-semibold text-gray-900">显示设置</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-700 block mb-2">主题色调</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, theme: 'warm' }))}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                        settings.theme === 'warm'
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <Sun className="w-4 h-4" />
                      暖色
                    </button>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, theme: 'cool' }))}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                        settings.theme === 'cool'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <Moon className="w-4 h-4" />
                      冷色
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-700 block mb-2">字体大小</span>
                  <input
                    type="range"
                    min="12"
                    max="20"
                    value={settings.fontSize}
                    onChange={(e) => setSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>小</span>
                    <span>{settings.fontSize}px</span>
                    <span>大</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 隐私设置 */}
            <div className="p-4 bg-warm-50 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-brand-500" />
                <h3 className="font-semibold text-gray-900">隐私设置</h3>
              </div>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-700">公开作品</span>
                  <button
                    onClick={() => toggleSetting('publicWorks')}
                    className={cn(
                      'w-11 h-6 rounded-full transition-colors relative',
                      settings.publicWorks ? 'bg-brand-500' : 'bg-gray-300'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                        settings.publicWorks ? 'left-6' : 'left-1'
                      )}
                    />
                  </button>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-700">公开进度</span>
                  <button
                    onClick={() => toggleSetting('publicProgress')}
                    className={cn(
                      'w-11 h-6 rounded-full transition-colors relative',
                      settings.publicProgress ? 'bg-brand-500' : 'bg-gray-300'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                        settings.publicProgress ? 'left-6' : 'left-1'
                      )}
                    />
                  </button>
                </label>
              </div>
            </div>

            {/* 多端同步 */}
            <div className="p-4 bg-warm-50 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <GitFork className="w-4 h-4 text-brand-500" />
                <h3 className="font-semibold text-gray-900">多端同步</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Web 端</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">已同步</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">iOS App</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">已同步</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Android App</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-sm">未连接</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">最后同步: 刚刚</p>
            </div>

            {/* 数据管理 */}
            <div className="p-4 bg-warm-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-4">数据管理</h3>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-brand-400 transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  导出数据
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-brand-400 transition-colors text-sm">
                  <Upload className="w-4 h-4" />
                  导入数据
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
