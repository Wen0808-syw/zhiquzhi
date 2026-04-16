import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Clock,
  Star,
  TrendingUp,
  Flame,
  ArrowRight,
  ChevronRight,
  Play,
  BookOpen,
  Users,
  Award,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { cn, formatDate, getDifficultyStars, getDifficultyLabel, getStatusLabel, getCategoryLabel, formatNumber } from '@/utils/cn';
import { mockPatterns, mockProjects, mockActivities, mockPosts, currentUser, mockLeaderboard } from '@/data/mock';
import type { Pattern, Project, Post, Activity, LeaderboardEntry } from '@/types';

// Gradient placeholder for pattern/project covers
const GradientPlaceholder = ({ className, gradient }: { className?: string; gradient?: string }) => (
  <div
    className={cn('bg-gradient-to-br flex items-center justify-center', className)}
    style={{
      backgroundImage: gradient || 'linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #f43f5e 100%)',
    }}
  >
    <Sparkles className="w-8 h-8 text-white/60" />
  </div>
);

// Post type badge
const PostTypeBadge = ({ type }: { type: string }) => {
  const config: Record<string, { label: string; className: string }> = {
    help: { label: '求助', className: 'bg-rose-100 text-rose-700' },
    question: { label: '求助', className: 'bg-rose-100 text-rose-700' },
    tutorial: { label: '教程', className: 'bg-blue-100 text-blue-700' },
    discussion: { label: '讨论', className: 'bg-brand-100 text-brand-700' },
    showcase: { label: '展示', className: 'bg-green-100 text-green-700' },
  };
  const { label, className } = config[type] || { label: type, className: 'bg-gray-100 text-gray-700' };
  return <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', className)}>{label}</span>;
};

// Activity type badge
const ActivityTypeBadge = ({ type }: { type: string }) => {
  const config: Record<string, { label: string; className: string }> = {
    challenge: { label: '挑战赛', className: 'bg-rose-100 text-rose-700' },
    along: { label: '编织活动', className: 'bg-blue-100 text-blue-700' },
    contest: { label: '大赛', className: 'bg-yellow-100 text-yellow-700' },
  };
  const { label, className } = config[type] || { label: type, className: 'bg-gray-100 text-gray-700' };
  return <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', className)}>{label}</span>;
};

export function HomePage() {
  const [likedPatterns, setLikedPatterns] = useState<Set<string>>(new Set());
  const [savedPatterns, setSavedPatterns] = useState<Set<string>>(new Set());

  // Toggle like/save handlers
  const toggleLike = (id: string) => {
    setLikedPatterns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSave = (id: string) => {
    setSavedPatterns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Get user's own projects
  const userProjects = mockProjects.filter((p) => p.owner.id === currentUser.id);
  // Get trending patterns (top 6 by likes)
  const trendingPatterns = [...mockPatterns].sort((a, b) => b.likes - a.likes).slice(0, 6);
  // Get latest posts
  const latestPosts = [...mockPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);
  // Get active activities
  const activeActivities = mockActivities.filter((a) => a.status === 'active');
  // Get leaderboard top 4
  const topUsers = mockLeaderboard.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ==================== Hero Section ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-500 via-brand-400 to-rose-500">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-rose-300 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white/90 text-sm">欢迎来到织趣织编织社区</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in-up">
              欢迎回来，{currentUser.name}
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              与志同道合的编织爱好者一起，分享创意、学习技巧、完成作品。
              这里有丰富的图解库、活跃的社区，以及无限的设计灵感。
            </p>

            <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 bg-white text-brand-600 px-6 py-3 rounded-full font-semibold hover:bg-white/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <BookOpen className="w-5 h-5" />
                开始新项目
              </Link>
              <Link
                to="/patterns"
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all border border-white/30"
              >
                <TrendingUp className="w-5 h-5" />
                浏览图解
              </Link>
              <Link
                to="/community"
                className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-rose-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Users className="w-5 h-5" />
                加入社区
              </Link>
            </div>

            {/* Quick stats */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{currentUser.stats.projects}</div>
                <div className="text-white/70 text-sm">我的项目</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{currentUser.stats.completed}</div>
                <div className="text-white/70 text-sm">已完成</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{formatNumber(currentUser.stats.followers)}</div>
                <div className="text-white/70 text-sm">粉丝</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{currentUser.stats.following}</div>
                <div className="text-white/70 text-sm">关注</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 50L60 45C120 40 240 30 360 35C480 40 600 60 720 65C840 70 960 60 1080 50C1200 40 1320 30 1380 25L1440 20V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* ==================== 我的项目概览 ==================== */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">我的项目概览</h2>
              <p className="text-gray-500 mt-1">继续你未完成的编织之旅</p>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium transition-colors"
            >
              查看全部
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Horizontal scroll container */}
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {userProjects.length > 0 ? (
              userProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <div className="w-full text-center py-12 bg-white rounded-2xl border border-gray-100">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">还没有项目，开始你的第一个编织吧！</p>
                <Link
                  to="/projects/new"
                  className="inline-flex items-center gap-2 mt-4 text-brand-600 hover:text-brand-700 font-medium"
                >
                  创建项目
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ==================== 热门图解推荐 ==================== */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">热门图解推荐</h2>
              <p className="text-gray-500 mt-1">发现最新最热的编织灵感</p>
            </div>
            <Link
              to="/patterns"
              className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium transition-colors"
            >
              浏览更多
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingPatterns.map((pattern) => (
              <PatternCard
                key={pattern.id}
                pattern={pattern}
                isLiked={likedPatterns.has(pattern.id)}
                isSaved={savedPatterns.has(pattern.id)}
                onLike={() => toggleLike(pattern.id)}
                onSave={() => toggleSave(pattern.id)}
              />
            ))}
          </div>
        </section>

        {/* ==================== 社区精选 ==================== */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">社区精选</h2>
              <p className="text-gray-500 mt-1">来自织女们的精彩分享</p>
            </div>
            <Link
              to="/community"
              className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium transition-colors"
            >
              进入社区
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        {/* ==================== 正在进行的活动 ==================== */}
        {activeActivities.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">正在进行的活动</h2>
                <p className="text-gray-500 mt-1">参与活动赢取奖励</p>
              </div>
              <Link
                to="/activities"
                className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium transition-colors"
              >
                查看全部
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </section>
        )}

        {/* ==================== 编织排行榜 ==================== */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">编织排行榜</h2>
              <p className="text-gray-500 mt-1">本周最活跃的织女们</p>
            </div>
            <Link
              to="/leaderboard"
              className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-medium transition-colors"
            >
              查看完整排名
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topUsers.map((entry) => (
              <LeaderboardCard key={entry.rank} entry={entry} />
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">🧶 织趣织</h3>
              <p className="text-gray-400 text-sm">让每一针每一线，都成为温暖的回忆</p>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link to="/about" className="hover:text-white transition-colors">关于我们</Link>
              <Link to="/help" className="hover:text-white transition-colors">帮助中心</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">隐私政策</Link>
              <Link to="/contact" className="hover:text-white transition-colors">联系我们</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            © 2026 织趣织. 用爱编织，温暖生活
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==================== Sub-components ====================

function ProjectCard({ project }: { project: Project }) {
  const statusInfo = getStatusLabel(project.status);

  return (
    <div className="flex-shrink-0 w-72 bg-white rounded-2xl border border-gray-100 overflow-hidden card hover:shadow-lg transition-shadow">
      {/* Cover */}
      <div className="h-36">
        <GradientPlaceholder className="w-full h-full rounded-none" gradient={project.pattern ? undefined : undefined} />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{project.title}</h3>
          <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0', statusInfo.color)}>
            {statusInfo.label}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>进度</span>
            <span>{project.progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <Link
          to={`/projects/${project.id}`}
          className="mt-3 inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium"
        >
          查看详情
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

function PatternCard({
  pattern,
  isLiked,
  isSaved,
  onLike,
  onSave,
}: {
  pattern: Pattern;
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onSave: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden card hover:shadow-lg transition-all hover:-translate-y-1">
      {/* Cover */}
      <div className="h-44">
        <GradientPlaceholder className="w-full h-full rounded-none" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full text-xs font-medium">
            {getCategoryLabel(pattern.category)}
          </span>
          <div className="flex items-center gap-1 text-amber-500 text-sm">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{getDifficultyLabel(pattern.difficulty)}</span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{pattern.title}</h3>
        <p className="text-sm text-gray-500 mb-3">by {pattern.author.name}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
          <button
            onClick={onLike}
            className={cn('inline-flex items-center gap-1 transition-colors', isLiked ? 'text-rose-500' : 'hover:text-rose-500')}
          >
            <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
            <span>{formatNumber(pattern.likes + (isLiked ? 1 : 0))}</span>
          </button>
          <button
            onClick={onSave}
            className={cn('inline-flex items-center gap-1 transition-colors', isSaved ? 'text-brand-500' : 'hover:text-brand-500')}
          >
            <BookOpen className={cn('w-4 h-4', isSaved && 'fill-current')} />
            <span>{formatNumber(pattern.saves + (isSaved ? 1 : 0))}</span>
          </button>
        </div>

        <Link
          to={`/patterns/${pattern.id}`}
          className="w-full inline-flex items-center justify-center gap-2 bg-brand-50 text-brand-600 px-4 py-2.5 rounded-xl font-medium hover:bg-brand-100 transition-colors"
        >
          查看图解
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link
      to={`/community/${post.id}`}
      className="block bg-white rounded-2xl border border-gray-100 p-5 card hover:shadow-lg transition-all hover:-translate-y-0.5"
    >
      {/* Author */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-rose-400 flex items-center justify-center text-lg">
          {post.author.avatar}
        </div>
        <div>
          <div className="font-medium text-gray-900">{post.author.name}</div>
          <div className="text-xs text-gray-400">{formatDate(post.createdAt)}</div>
        </div>
        <div className="ml-auto">
          <PostTypeBadge type={post.type} />
        </div>
      </div>

      {/* Content */}
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.content}</p>

      {/* Footer stats */}
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span className="inline-flex items-center gap-1">
          <Heart className="w-4 h-4" />
          {post.likes}
        </span>
        <span className="inline-flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          {post.comments.length}
        </span>
        <span className="inline-flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {formatNumber(post.views)}
        </span>
      </div>
    </Link>
  );
}

function ActivityCard({ activity }: { activity: Activity }) {
  const startDate = new Date(activity.startDate);
  const endDate = new Date(activity.endDate);
  const now = new Date();
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const progress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
  const remainingDays = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden card hover:shadow-lg transition-all">
      {/* Cover */}
      <div className="h-40">
        <GradientPlaceholder className="w-full h-full rounded-none" gradient="linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%)" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <ActivityTypeBadge type={activity.type} />
          <span className="text-sm text-gray-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {remainingDays > 0 ? `剩余 ${remainingDays} 天` : '即将结束'}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">{activity.title}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{activity.description}</p>

        {/* Participant count */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Users className="w-4 h-4" />
          <span>{activity.participantCount} 人参与</span>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Link
          to={`/activities/${activity.id}`}
          className="w-full inline-flex items-center justify-center gap-2 bg-violet-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-violet-700 transition-colors"
        >
          参加活动
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function LeaderboardCard({ entry }: { entry: LeaderboardEntry }) {
  const { rank, user, points, completedProjects } = entry;

  // Gradient backgrounds for top 3
  const gradients: Record<number, string> = {
    1: 'from-amber-400 via-yellow-300 to-amber-400',
    2: 'from-slate-300 via-gray-200 to-slate-300',
    3: 'from-orange-400 via-amber-300 to-orange-400',
  };

  const rankEmojis: Record<number, string> = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
  };

  const gradient = gradients[rank] || 'from-brand-100 to-brand-50';
  const emoji = rankEmojis[rank];

  return (
    <div
      className={cn(
        'relative bg-gradient-to-br rounded-2xl p-5 text-center overflow-hidden',
        gradient
      )}
    >
      {/* Rank badge */}
      <div className="absolute top-3 right-3 text-2xl">{emoji}</div>

      {/* Avatar */}
      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/80 shadow-lg flex items-center justify-center text-2xl">
        {user.avatar}
      </div>

      {/* Name */}
      <h3 className="font-bold text-gray-900 mb-1">{user.name}</h3>
      <p className="text-sm text-gray-600 mb-3">{user.title}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-white/60 rounded-lg py-2">
          <div className="font-bold text-gray-900">{formatNumber(points)}</div>
          <div className="text-gray-500">积分</div>
        </div>
        <div className="bg-white/60 rounded-lg py-2">
          <div className="font-bold text-gray-900">{completedProjects}</div>
          <div className="text-gray-500">作品</div>
        </div>
      </div>

      {/* View profile */}
      <Link
        to={`/users/${user.id}`}
        className="mt-3 inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium"
      >
        查看主页
        <ChevronRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

// Missing Eye icon helper
function Eye({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
