import { Link } from 'react-router-dom';
import { Trophy, Medal, Star, TrendingUp, Users, Award, Crown } from 'lucide-react';
import { cn, formatNumber } from '@/utils/cn';
import { mockLeaderboard, mockUsers, currentUser } from '@/data/mock';

// ============== Rank Medal ==============
const RankMedal = ({ rank }: { rank: number }) => {
  const gradients: Record<number, string> = {
    1: 'from-amber-400 via-yellow-300 to-amber-400',
    2: 'from-slate-300 via-gray-200 to-slate-300',
    3: 'from-orange-400 via-amber-300 to-orange-400',
  };

  const emojis: Record<number, string> = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
  };

  if (rank <= 3) {
    return (
      <div className={cn(
        'w-16 h-16 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg',
        gradients[rank]
      )}>
        <span className="text-3xl">{emojis[rank]}</span>
      </div>
    );
  }

  return (
    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
      <span className="text-xl font-bold text-gray-500">#{rank}</span>
    </div>
  );
};

// ============== Top Three Section ==============
const TopThreeSection = () => {
  const topThree = mockLeaderboard.slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-brand-500 via-rose-500 to-orange-500 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Crown className="w-8 h-8 text-amber-300" />
        <h2 className="text-2xl font-bold text-white">🏆 荣耀殿堂</h2>
      </div>

      <div className="flex items-end justify-center gap-4">
        {/* 2nd Place */}
        {topThree[1] && (
          <div className="flex-1 max-w-[200px] text-center order-2">
            <div className="bg-white/20 backdrop-blur rounded-2xl p-4 mb-2">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-slate-300 via-gray-200 to-slate-300 flex items-center justify-center text-4xl shadow-lg mb-3">
                {topThree[1].user.avatar}
              </div>
              <h3 className="font-bold text-white truncate">{topThree[1].user.name}</h3>
              <p className="text-white/70 text-sm">{topThree[1].user.title}</p>
              <div className="mt-2 text-2xl">🥈</div>
              <div className="mt-2 font-bold text-white text-lg">
                {formatNumber(topThree[1].points)}
              </div>
              <div className="text-white/60 text-xs">积分</div>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {topThree[0] && (
          <div className="flex-1 max-w-[240px] text-center order-1">
            <div className="bg-white/30 backdrop-blur rounded-2xl p-5 mb-2 transform scale-110">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-400 flex items-center justify-center text-5xl shadow-xl mb-3 ring-4 ring-amber-200">
                {topThree[0].user.avatar}
              </div>
              <h3 className="font-bold text-white text-lg truncate">{topThree[0].user.name}</h3>
              <p className="text-white/80 text-sm">{topThree[0].user.title}</p>
              <div className="mt-2 text-3xl">🥇</div>
              <div className="mt-2 font-bold text-white text-2xl">
                {formatNumber(topThree[0].points)}
              </div>
              <div className="text-white/60 text-sm">积分</div>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <div className="flex-1 max-w-[200px] text-center order-3">
            <div className="bg-white/20 backdrop-blur rounded-2xl p-4 mb-2">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-orange-400 via-amber-300 to-orange-400 flex items-center justify-center text-4xl shadow-lg mb-3">
                {topThree[2].user.avatar}
              </div>
              <h3 className="font-bold text-white truncate">{topThree[2].user.name}</h3>
              <p className="text-white/70 text-sm">{topThree[2].user.title}</p>
              <div className="mt-2 text-2xl">🥉</div>
              <div className="mt-2 font-bold text-white text-lg">
                {formatNumber(topThree[2].points)}
              </div>
              <div className="text-white/60 text-xs">积分</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============== Full Leaderboard ==============
const FullLeaderboard = () => {
  const currentUserRank = mockLeaderboard.findIndex(e => e.user.id === currentUser.id) + 1;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-amber-500" />
          <h2 className="text-xl font-bold text-gray-900">完整排行榜</h2>
        </div>
      </div>

      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-sm font-medium text-gray-500">
        <div className="col-span-1">排名</div>
        <div className="col-span-5">用户</div>
        <div className="col-span-2 text-center">作品</div>
        <div className="col-span-2 text-center">徽章</div>
        <div className="col-span-2 text-right">积分</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-50">
        {mockLeaderboard.map((entry, index) => {
          const isCurrentUser = entry.user.id === currentUser.id;
          const isTopThree = entry.rank <= 3;

          return (
            <div
              key={entry.user.id}
              className={cn(
                'grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors',
                isCurrentUser ? 'bg-brand-50' : 'hover:bg-gray-50'
              )}
            >
              {/* Rank */}
              <div className="col-span-1">
                {isTopThree ? (
                  <RankMedal rank={entry.rank} />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="font-bold text-gray-500">{entry.rank}</span>
                  </div>
                )}
              </div>

              {/* User */}
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-rose-400 flex items-center justify-center text-lg">
                  {entry.user.avatar}
                </div>
                <div>
                  <Link
                    to={`/users/${entry.user.id}`}
                    className={cn(
                      'font-medium hover:text-brand-600 transition-colors',
                      isCurrentUser ? 'text-brand-600' : 'text-gray-900'
                    )}
                  >
                    {entry.user.name}
                    {isCurrentUser && <span className="text-xs text-brand-500 ml-1">(你)</span>}
                  </Link>
                  <div className="text-xs text-gray-400">{entry.user.title}</div>
                </div>
              </div>

              {/* Completed Projects */}
              <div className="col-span-2 text-center">
                <span className="inline-flex items-center gap-1 text-gray-600">
                  <Star className="w-4 h-4 text-amber-500" />
                  {entry.completedProjects}
                </span>
              </div>

              {/* Badges */}
              <div className="col-span-2 text-center">
                <span className="inline-flex items-center gap-1 text-gray-600">
                  <Award className="w-4 h-4 text-purple-500" />
                  {entry.badges}
                </span>
              </div>

              {/* Points */}
              <div className="col-span-2 text-right">
                <span className="font-bold text-brand-600">
                  {formatNumber(entry.points)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current User Position Hint */}
      {currentUserRank === 0 && (
        <div className="p-4 bg-gray-50 text-center text-gray-500 text-sm">
          当前用户暂未上榜，继续努力！💪
        </div>
      )}
    </div>
  );
};

// ============== Stats Cards ==============
const StatsCards = () => {
  const totalProjects = mockLeaderboard.reduce((sum, e) => sum + e.completedProjects, 0);
  const totalBadges = mockLeaderboard.reduce((sum, e) => sum + e.badges, 0);
  const totalPoints = mockLeaderboard.reduce((sum, e) => sum + e.points, 0);

  const stats = [
    { icon: Star, label: '本周完成作品', value: totalProjects, color: 'text-amber-500', bg: 'bg-amber-50' },
    { icon: Award, label: '已获得徽章', value: totalBadges, color: 'text-purple-500', bg: 'bg-purple-50' },
    { icon: TrendingUp, label: '积分总值', value: formatNumber(totalPoints), color: 'text-brand-500', bg: 'bg-brand-50' },
    { icon: Users, label: '活跃织女', value: mockLeaderboard.length, color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className={cn('w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2', stat.bg)}>
              <Icon className={cn('w-6 h-6', stat.color)} />
            </div>
            <div className="font-bold text-gray-900 text-lg">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
};

// ============== Main Leaderboard Page ==============
export const LeaderboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-amber-500" />
            <h1 className="text-2xl font-bold text-gray-900">🏆 编织排行榜</h1>
          </div>
          <p className="text-gray-500">本周最活跃的织女们，看看谁榜上有名！</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Top Three */}
        <TopThreeSection />

        {/* Stats */}
        <StatsCards />

        {/* Full List */}
        <FullLeaderboard />
      </div>
    </div>
  );
};
