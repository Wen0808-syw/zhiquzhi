import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Users, Calendar, Award, Trophy, Clock,
  ChevronRight, Flame, CheckCircle, Star
} from 'lucide-react';
import { cn, formatDate } from '@/utils/cn';
import { mockActivities, mockLeaderboard } from '@/data/mock';
import type { Activity } from '@/types';

// ============== Medal Icon ==============
const MedalIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <span className="text-3xl">🥇</span>;
  if (rank === 2) return <span className="text-3xl">🥈</span>;
  if (rank === 3) return <span className="text-3xl">🥉</span>;
  return <span className="text-gray-400 font-bold text-lg">#{rank}</span>;
};

// ============== Status Badge ==============
const StatusBadge = ({ status }: { status: Activity['status'] }) => {
  const config: Record<Activity['status'], { label: string; className: string }> = {
    active: { label: '进行中', className: 'bg-green-100 text-green-700' },
    upcoming: { label: '即将开始', className: 'bg-blue-100 text-blue-700' },
    ended: { label: '已结束', className: 'bg-gray-100 text-gray-500' },
  };
  const { label, className } = config[status];
  return <span className={cn('px-3 py-1 rounded-full text-sm font-medium', className)}>{label}</span>;
};

// ============== Activity Type Badge ==============
const ActivityTypeBadge = ({ type }: { type: string }) => {
  const config: Record<string, { label: string; className: string }> = {
    challenge: { label: '挑战赛', className: 'bg-rose-100 text-rose-700' },
    along: { label: '编织活动', className: 'bg-blue-100 text-blue-700' },
    contest: { label: '大赛', className: 'bg-yellow-100 text-yellow-700' },
  };
  const { label, className } = config[type] || { label: type, className: 'bg-gray-100 text-gray-700' };
  return <span className={cn('px-3 py-1 rounded-full text-sm font-medium', className)}>{label}</span>;
};

// ============== Gradient Placeholder ==============
const GradientPlaceholder = ({ className, gradient }: { className?: string; gradient?: string }) => (
  <div
    className={cn('bg-gradient-to-br flex items-center justify-center', className)}
    style={{
      backgroundImage: gradient || 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%)',
    }}
  >
    <Trophy className="w-12 h-12 text-white/60" />
  </div>
);

// ============== Activity Detail View ==============
const ActivityDetail = ({ activity, onBack }: { activity: Activity; onBack: () => void }) => {
  const startDate = new Date(activity.startDate);
  const endDate = new Date(activity.endDate);
  const now = new Date();
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const progress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
  const remainingDays = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        返回活动中心
      </button>

      {/* Hero */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="h-48 md:h-64">
          <GradientPlaceholder className="w-full h-full" />
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <ActivityTypeBadge type={activity.type} />
            <StatusBadge status={activity.status} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">{activity.title}</h1>
          <p className="text-gray-600 mb-4">{activity.description}</p>

          {/* Date & Participants */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-6">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(activity.startDate)} ~ {formatDate(activity.endDate)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {activity.participantCount} 人参与
            </span>
            {remainingDays > 0 && activity.status === 'active' && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                剩余 {remainingDays} 天
              </span>
            )}
          </div>

          {/* Progress */}
          {activity.status === 'active' && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>活动进度</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-orange-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Join Button */}
          {activity.status === 'active' && (
            <button className="px-6 py-3 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 transition-colors">
              立即参加
            </button>
          )}
          {activity.status === 'upcoming' && (
            <button className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors">
              提前报名
            </button>
          )}
        </div>
      </div>

      {/* Prizes */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-6 h-6 text-amber-500" />
          <h2 className="font-bold text-lg text-gray-900">活动奖励</h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {activity.prizes.map((prize, index) => (
            <div
              key={index}
              className={cn(
                'p-4 rounded-xl text-center',
                index === 0 ? 'bg-amber-50 border-2 border-amber-200' :
                index === 1 ? 'bg-gray-50 border border-gray-200' :
                'bg-orange-50 border border-orange-200'
              )}
            >
              <div className="text-2xl mb-2">
                {index === 0 ? '🏆' : index === 1 ? '🥈' : '🥉'}
              </div>
              <div className="font-medium text-gray-900">{prize}</div>
              {index === 0 && <div className="text-xs text-amber-600 mt-1">冠军专属</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-4">活动规则</h2>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span>使用织趣织平台记录你的编织过程</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span>在活动截止日期前完成作品并提交</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span>拍摄清晰的成品照片并上传</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span>遵守社区规范，积极参与讨论</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

// ============== Main Activities Page ==============
export const ActivitiesPage = () => {
  const { id } = useParams();

  // If ID is provided, show detail view
  if (id) {
    const activity = mockActivities.find(a => a.id === id);
    if (!activity) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">未找到该活动</p>
          <Link to="/activities" className="text-brand-600 hover:underline mt-2 inline-block">
            返回活动中心
          </Link>
        </div>
      );
    }
    return <ActivityDetail activity={activity} onBack={() => window.history.back()} />;
  }

  // Group activities by status
  const activeActivities = mockActivities.filter(a => a.status === 'active');
  const upcomingActivities = mockActivities.filter(a => a.status === 'upcoming');
  const endedActivities = mockActivities.filter(a => a.status === 'ended');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-500 via-rose-500 to-orange-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8" />
            <h1 className="text-2xl font-bold">活动中心</h1>
          </div>
          <p className="text-white/80">参与精彩活动，赢取专属奖励</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Featured Activity */}
        {activeActivities[0] && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg">
            <div className="md:flex">
              <div className="md:w-1/3 h-48 md:h-auto">
                <GradientPlaceholder className="w-full h-full" />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-rose-500" />
                  <span className="text-sm font-medium text-rose-600">🔥 热门活动</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{activeActivities[0].title}</h2>
                <p className="text-gray-600 mb-4">{activeActivities[0].description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(activeActivities[0].startDate)} ~ {formatDate(activeActivities[0].endDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {activeActivities[0].participantCount} 人
                  </span>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/activities/${activeActivities[0].id}`}
                    className="px-5 py-2.5 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 transition-colors"
                  >
                    查看详情
                  </Link>
                  <button className="px-5 py-2.5 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors">
                    立即参加
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ongoing Activities */}
        {activeActivities.length > 1 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-bold text-gray-900">正在进行中</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {activeActivities.slice(1).map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Activities */}
        {upcomingActivities.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900">即将开始</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {upcomingActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </section>
        )}

        {/* Past Activities */}
        {endedActivities.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl font-bold text-gray-900">已结束活动</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {endedActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// ============== Activity Card ==============
function ActivityCard({ activity }: { activity: Activity }) {
  const startDate = new Date(activity.startDate);
  const endDate = new Date(activity.endDate);
  const now = new Date();
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const progress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
  const remainingDays = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-40">
        <GradientPlaceholder className="w-full h-full" />
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <ActivityTypeBadge type={activity.type} />
          <StatusBadge status={activity.status} />
        </div>

        <h3 className="font-bold text-lg text-gray-900 mb-2">{activity.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{activity.description}</p>

        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(activity.startDate)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {activity.participantCount}人
          </span>
          {remainingDays > 0 && activity.status === 'active' && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              剩{remainingDays}天
            </span>
          )}
        </div>

        {activity.status === 'active' && (
          <div className="mb-4">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-orange-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <Link
          to={`/activities/${activity.id}`}
          className="w-full inline-flex items-center justify-center gap-2 bg-brand-50 text-brand-600 px-4 py-2.5 rounded-xl font-medium hover:bg-brand-100 transition-colors"
        >
          查看详情
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
