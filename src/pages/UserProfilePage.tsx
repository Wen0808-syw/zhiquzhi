import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Heart, MessageCircle, Star, Calendar, 
  Users, BookOpen, Award, Settings, Edit2, Check
} from 'lucide-react';
import { cn, formatDate, formatNumber } from '@/utils/cn';
import { mockUsers, mockProjects, mockPosts, mockPatterns, currentUser } from '@/data/mock';
import type { User } from '@/types';

// ============== Rarity Badge ==============
const RarityBadge = ({ rarity }: { rarity: string }) => {
  const config: Record<string, { label: string; className: string }> = {
    common: { label: '普通', className: 'bg-gray-100 text-gray-600' },
    rare: { label: '稀有', className: 'bg-blue-100 text-blue-600' },
    epic: { label: '史诗', className: 'bg-purple-100 text-purple-600' },
    legendary: { label: '传说', className: 'bg-amber-100 text-amber-600' },
  };
  const { label, className } = config[rarity] || config.common;
  return <span className={cn('px-2 py-0.5 rounded text-xs font-medium', className)}>{label}</span>;
};

// ============== Gradient Placeholder ==============
const GradientPlaceholder = ({ className }: { className?: string }) => (
  <div
    className={cn('bg-gradient-to-br flex items-center justify-center', className)}
    style={{
      backgroundImage: 'linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #f43f5e 100%)',
    }}
  />
);

// ============== User Profile View ==============
const UserProfileView = ({ user }: { user: User }) => {
  const isCurrentUser = user.id === currentUser.id;
  
  // Get user's projects
  const userProjects = mockProjects.filter(p => p.owner.id === user.id);
  const completedProjects = userProjects.filter(p => p.status === 'completed');
  
  // Get user's posts
  const userPosts = mockPosts.filter(p => p.author.id === user.id);

  return (
    <div className="space-y-6">
      {/* Back Button (for other users) */}
      {!isCurrentUser && (
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          返回
        </button>
      )}

      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Cover */}
        <div className="h-32 md:h-48">
          <GradientPlaceholder className="w-full h-full" />
        </div>

        {/* Avatar & Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 md:-mt-16">
            {/* Avatar */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-5xl">
              {user.avatar}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <span className="px-2 py-0.5 bg-brand-100 text-brand-700 rounded-full text-sm font-medium">
                  Lv.{user.level}
                </span>
              </div>
              <p className="text-gray-500 mb-2">{user.title}</p>
              <p className="text-gray-600 text-sm">{user.bio}</p>
            </div>

            {/* Actions */}
            {isCurrentUser ? (
              <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                编辑资料
              </button>
            ) : (
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
                  + 关注
                </button>
                <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{user.stats.projects}</div>
              <div className="text-sm text-gray-500">项目</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{user.stats.completed}</div>
              <div className="text-sm text-gray-500">已完成</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{formatNumber(user.stats.followers)}</div>
              <div className="text-sm text-gray-500">粉丝</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{user.stats.following}</div>
              <div className="text-sm text-gray-500">关注</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{user.stats.posts}</div>
              <div className="text-sm text-gray-500">帖子</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{user.stats.patterns}</div>
              <div className="text-sm text-gray-500">图解</div>
            </div>
          </div>

          {/* Join Date */}
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            加入于 {formatDate(user.joinDate)}
          </div>
        </div>
      </div>

      {/* Badges */}
      {user.badges.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-6 h-6 text-amber-500" />
            <h2 className="font-bold text-lg text-gray-900">徽章墙</h2>
            <span className="text-sm text-gray-400">({user.badges.length}枚)</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user.badges.map((badge) => (
              <div
                key={badge.id}
                className="p-4 bg-gray-50 rounded-xl text-center hover:bg-gray-100 transition-colors"
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className="font-medium text-gray-900 mb-1">{badge.name}</div>
                <div className="text-xs text-gray-500 mb-2">{badge.description}</div>
                <RarityBadge rarity={badge.rarity} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Projects */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-500" />
            <h2 className="font-bold text-lg text-gray-900">项目作品</h2>
          </div>
          {userProjects.length > 3 && (
            <Link to={`/users/${user.id}/projects`} className="text-sm text-brand-600 hover:text-brand-700">
              查看全部 →
            </Link>
          )}
        </div>

        {userProjects.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {userProjects.slice(0, 3).map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="h-24 rounded-lg bg-gradient-to-br from-brand-400 to-rose-400 mb-3 flex items-center justify-center text-3xl opacity-80 group-hover:opacity-100 transition-opacity">
                  {project.pattern?.category === 'amigurumi' ? '🧸' : 
                   project.pattern?.category === 'hat' ? '🎩' :
                   project.pattern?.category === 'scarf' ? '🧣' : '🧶'}
                </div>
                <h3 className="font-medium text-gray-900 line-clamp-1">{project.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{project.progress}%</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>暂无项目</p>
          </div>
        )}
      </div>

      {/* Recent Posts */}
      {userPosts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-500" />
              <h2 className="font-bold text-lg text-gray-900">最近帖子</h2>
            </div>
          </div>

          <div className="space-y-4">
            {userPosts.slice(0, 3).map((post) => (
              <Link
                key={post.id}
                to={`/community/post/${post.id}`}
                className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <h3 className="font-medium text-gray-900 line-clamp-1 mb-1">{post.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {post.comments.length}
                  </span>
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============== Main User Profile Page ==============
export const UserProfilePage = () => {
  const { id } = useParams();

  // Find user by ID
  const user = id 
    ? mockUsers.find(u => u.id === id)
    : currentUser;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">未找到该用户</p>
          <Link to="/" className="text-brand-600 hover:underline">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <UserProfileView user={user} />
      </div>
    </div>
  );
};
