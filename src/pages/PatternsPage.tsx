import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Heart, Bookmark, Star, Clock, Users, 
  Filter, Search, ChevronRight, Share2, Play
} from 'lucide-react';
import { cn, formatDate, formatNumber, getDifficultyStars, getDifficultyLabel, getCategoryLabel } from '@/utils/cn';
import { mockPatterns, mockUsers } from '@/data/mock';
import type { Pattern } from '@/types';

// ============== Gradient Placeholder ==============
const GradientPlaceholder = ({ className, gradient }: { className?: string; gradient?: string }) => (
  <div
    className={cn('bg-gradient-to-br flex items-center justify-center', className)}
    style={{
      backgroundImage: gradient || 'linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #f43f5e 100%)',
    }}
  >
    <Star className="w-8 h-8 text-white/60" />
  </div>
);

// ============== Pattern Detail View ==============
const PatternDetail = ({ pattern, onBack }: { pattern: Pattern; onBack: () => void }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        返回图解库
      </button>

      {/* Hero Section */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="h-64 md:h-80">
          <GradientPlaceholder className="w-full h-full" />
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-sm font-medium">
              {getCategoryLabel(pattern.category)}
            </span>
            <span className="flex items-center gap-1 text-amber-500">
              {getDifficultyStars(pattern.difficulty)}
              <span className="text-sm text-gray-500 ml-1">{getDifficultyLabel(pattern.difficulty)}</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">{pattern.title}</h1>
          <p className="text-gray-600 mb-4">{pattern.description}</p>

          {/* Author */}
          <Link to={`/users/${pattern.author.id}`} className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-rose-400 flex items-center justify-center text-xl">
              {pattern.author.avatar}
            </div>
            <div>
              <div className="font-medium text-gray-900">{pattern.author.name}</div>
              <div className="text-sm text-gray-500">{pattern.author.title}</div>
            </div>
          </Link>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {formatNumber(pattern.likes)} 喜欢
            </span>
            <span className="flex items-center gap-1">
              <Bookmark className="w-4 h-4" />
              {formatNumber(pattern.saves)} 收藏
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDate(pattern.updatedAt)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setLiked(!liked)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                liked ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              <Heart className={cn('w-4 h-4', liked && 'fill-current')} />
              {liked ? '已喜欢' : '喜欢'}
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                saved ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              <Bookmark className={cn('w-4 h-4', saved && 'fill-current')} />
              {saved ? '已收藏' : '收藏'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
              <Share2 className="w-4 h-4" />
              分享
            </button>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Tags & Tools */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-4">标签与工具</h2>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">标签</h3>
            <div className="flex flex-wrap gap-2">
              {pattern.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">所需工具</h3>
            <div className="flex flex-wrap gap-2">
              {pattern.tools.map((tool) => (
                <span key={tool} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Gauge */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-4">编织密度</h2>
          
          {pattern.gauge && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">10cm =</span>
                <span className="font-medium">{pattern.gauge.stitchesPer10cm} 针</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">10cm =</span>
                <span className="font-medium">{pattern.gauge.rowsPer10cm} 行</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">推荐棒针</span>
                <span className="font-medium">{pattern.gauge.needleSize}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Yarn */}
      {pattern.yarns.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-4">推荐用线</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {pattern.yarns.map((yarn) => (
              <div key={yarn.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-gray-200"
                  style={{ backgroundColor: yarn.colorCode }}
                />
                <div>
                  <div className="font-medium text-gray-900">{yarn.brand} {yarn.name}</div>
                  <div className="text-sm text-gray-500">{yarn.composition} · {yarn.color}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-4">编织步骤</h2>
        
        <div className="space-y-4">
          {pattern.steps.map((step, index) => (
            <div key={step.id} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-medium">
                {index + 1}
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                    {step.stitchType}
                  </span>
                  <span className="text-sm text-gray-500">
                    {step.stitchCount} 针
                  </span>
                </div>
                <p className="text-gray-700">{step.instruction}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============== Main Patterns Page ==============
type CategoryFilter = 'all' | 'cardigan' | 'amigurumi' | 'scarf' | 'hat' | 'sweater' | 'blanket';
type DifficultyFilter = 'all' | 1 | 2 | 3 | 4 | 5;

export const PatternsPage = () => {
  const { id } = useParams();
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedPatterns, setLikedPatterns] = useState<Set<string>>(new Set());
  const [savedPatterns, setSavedPatterns] = useState<Set<string>>(new Set());

  // If ID is provided, show detail view
  if (id) {
    const pattern = mockPatterns.find(p => p.id === id);
    if (!pattern) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">未找到该图解</p>
          <Link to="/patterns" className="text-brand-600 hover:underline mt-2 inline-block">
            返回图解库
          </Link>
        </div>
      );
    }
    return <PatternDetail pattern={pattern} onBack={() => window.history.back()} />;
  }

  const toggleLike = (id: string) => {
    setLikedPatterns(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSave = (id: string) => {
    setSavedPatterns(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredPatterns = mockPatterns.filter(pattern => {
    const matchCategory = categoryFilter === 'all' || pattern.category === categoryFilter;
    const matchDifficulty = difficultyFilter === 'all' || pattern.difficulty === difficultyFilter;
    const matchSearch = searchQuery === '' || 
      pattern.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pattern.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchDifficulty && matchSearch;
  });

  const categories: { value: CategoryFilter; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'cardigan', label: '开衫' },
    { value: 'amigurumi', label: '玩偶' },
    { value: 'scarf', label: '围巾' },
    { value: 'hat', label: '帽子' },
    { value: 'sweater', label: '毛衣' },
    { value: 'blanket', label: '毯子' },
  ];

  const difficulties: { value: DifficultyFilter; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 1, label: '入门' },
    { value: 2, label: '初级' },
    { value: 3, label: '中级' },
    { value: 4, label: '进阶' },
    { value: 5, label: '大师' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">🧶 编织图解库</h1>
          <p className="text-gray-500">发现灵感，开启你的编织之旅</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索图解..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Category Filters */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">分类</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategoryFilter(cat.value)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                    categoryFilter === cat.value
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filters */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">难度</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((diff) => (
                <button
                  key={diff.value}
                  onClick={() => setDifficultyFilter(diff.value)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                    difficultyFilter === diff.value
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {diff.value === 'all' ? diff.label : getDifficultyLabel(diff.value as number)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between">
          <p className="text-gray-500">
            共找到 <span className="font-medium text-gray-900">{filteredPatterns.length}</span> 个图解
          </p>
        </div>

        {/* Pattern Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatterns.map((pattern) => (
            <div key={pattern.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
              <Link to={`/patterns/${pattern.id}`}>
                <div className="h-44">
                  <GradientPlaceholder className="w-full h-full" />
                </div>
              </Link>

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

                <Link to={`/patterns/${pattern.id}`}>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 hover:text-brand-600 transition-colors">
                    {pattern.title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 mb-3">by {pattern.author.name}</p>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <button
                    onClick={() => toggleLike(pattern.id)}
                    className={cn('inline-flex items-center gap-1 transition-colors', likedPatterns.has(pattern.id) ? 'text-rose-500' : 'hover:text-rose-500')}
                  >
                    <Heart className={cn('w-4 h-4', likedPatterns.has(pattern.id) && 'fill-current')} />
                    <span>{formatNumber(pattern.likes + (likedPatterns.has(pattern.id) ? 1 : 0))}</span>
                  </button>
                  <button
                    onClick={() => toggleSave(pattern.id)}
                    className={cn('inline-flex items-center gap-1 transition-colors', savedPatterns.has(pattern.id) ? 'text-brand-500' : 'hover:text-brand-500')}
                  >
                    <Bookmark className={cn('w-4 h-4', savedPatterns.has(pattern.id) && 'fill-current')} />
                    <span>{formatNumber(pattern.saves + (savedPatterns.has(pattern.id) ? 1 : 0))}</span>
                  </button>
                </div>

                <Link
                  to={`/patterns/${pattern.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-50 text-brand-600 px-4 py-2.5 rounded-xl font-medium hover:bg-brand-100 transition-colors"
                >
                  查看图解
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredPatterns.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">没有找到符合条件的图解</p>
          </div>
        )}
      </div>
    </div>
  );
};
