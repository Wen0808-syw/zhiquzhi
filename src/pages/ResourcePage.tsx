import { useState } from 'react';
import {
  Search,
  Star,
  Heart,
  Bookmark,
  Play,
  FileText,
  Download,
  Filter,
  ChevronDown,
  Grid,
  List,
  BookOpen,
  Video,
  Image as ImageIcon,
  ThumbsUp,
  ExternalLink,
  Package,
  Palette,
  Ruler,
  Tag,
  Clock,
  Eye,
} from 'lucide-react';
import { cn, formatDate, getDifficultyStars, getDifficultyLabel, formatNumber } from '@/utils/cn';
import { mockPatterns, mockTutorials, mockYarns } from '@/data/mock';
import type { Pattern, Tutorial, YarnInfo } from '@/types';

type TabType = 'patterns' | 'tutorials' | 'materials';
type ViewType = 'grid' | 'list';
type SortType = 'latest' | 'popular' | 'rating';
type PatternCategory = 'all' | 'sweater' | 'cardigan' | 'scarf' | 'hat' | 'socks' | 'blanket' | 'amigurumi' | 'shawl' | 'vest';
type TutorialType = 'all' | 'article' | 'video' | 'photo';
type CompositionType = 'all' | '棉' | '羊毛' | '腈纶' | '混纺';

const categoryLabels: Record<string, string> = {
  all: '全部',
  sweater: '毛衣',
  cardigan: '开衫',
  scarf: '围巾',
  hat: '帽子',
  socks: '袜子',
  blanket: '毯子',
  amigurumi: '玩偶',
  shawl: '披肩',
  vest: '背心',
  other: '其他',
};

const tutorialTypeLabels: Record<string, string> = {
  all: '全部',
  article: '图文',
  video: '视频',
  photo: '图解',
};

const compositionLabels: Record<string, string> = {
  all: '全部成分',
  '棉': '棉',
  '羊毛': '羊毛',
  '腈纶': '腈纶',
  '混纺': '混纺',
};

export function ResourcePage() {
  const [activeTab, setActiveTab] = useState<TabType>('patterns');

  // Pattern states
  const [patternSearch, setPatternSearch] = useState('');
  const [patternDifficulty, setPatternDifficulty] = useState<number | null>(null);
  const [patternCategory, setPatternCategory] = useState<PatternCategory>('all');
  const [patternSort, setPatternSort] = useState<SortType>('latest');
  const [patternView, setPatternView] = useState<ViewType>('grid');
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);

  // Tutorial states
  const [tutorialType, setTutorialType] = useState<TutorialType>('all');
  const [tutorialDifficulty, setTutorialDifficulty] = useState<number | null>(null);
  const [tutorialCategory, setTutorialCategory] = useState<string>('all');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Material states
  const [materialSearch, setMaterialSearch] = useState('');
  const [materialBrand, setMaterialBrand] = useState<string>('all');
  const [materialComposition, setMaterialComposition] = useState<CompositionType>('all');
  const [materialWeight, setMaterialWeight] = useState<string>('all');
  const [selectedYarn, setSelectedYarn] = useState<YarnInfo | null>(null);
  const [compareYarns, setCompareYarns] = useState<YarnInfo[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  // Filter patterns
  const filteredPatterns = mockPatterns.filter((pattern) => {
    const matchesSearch = pattern.title.toLowerCase().includes(patternSearch.toLowerCase()) ||
                         pattern.tags.some(tag => tag.includes(patternSearch));
    const matchesDifficulty = patternDifficulty === null || pattern.difficulty === patternDifficulty;
    const matchesCategory = patternCategory === 'all' || pattern.category === patternCategory;
    return matchesSearch && matchesDifficulty && matchesCategory;
  }).sort((a, b) => {
    if (patternSort === 'latest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (patternSort === 'popular') return b.likes - a.likes;
    if (patternSort === 'rating') return b.saves - a.saves;
    return 0;
  });

  // Filter tutorials
  const filteredTutorials = mockTutorials.filter((tutorial) => {
    const matchesType = tutorialType === 'all' || tutorial.type === tutorialType;
    const matchesDifficulty = tutorialDifficulty === null || tutorial.difficulty === tutorialDifficulty;
    const matchesCategory = tutorialCategory === 'all' || tutorial.category === tutorialCategory;
    return matchesType && matchesDifficulty && matchesCategory;
  });

  // Filter materials
  const filteredYarns = mockYarns.filter((yarn) => {
    const matchesSearch = yarn.name.toLowerCase().includes(materialSearch.toLowerCase()) ||
                         yarn.brand.includes(materialSearch);
    const matchesBrand = materialBrand === 'all' || yarn.brand === materialBrand;
    const matchesComposition = materialComposition === 'all' || 
                               (materialComposition === '混纺' ? yarn.composition.includes('%') && !yarn.composition.includes('100%') : yarn.composition.includes(materialComposition));
    return matchesSearch && matchesBrand && matchesComposition;
  });

  const brands = Array.from(new Set(mockYarns.map(y => y.brand)));

  const toggleCompareYarn = (yarn: YarnInfo) => {
    if (compareYarns.find(y => y.id === yarn.id)) {
      setCompareYarns(compareYarns.filter(y => y.id !== yarn.id));
    } else if (compareYarns.length < 3) {
      setCompareYarns([...compareYarns, yarn]);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              'w-4 h-4',
              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
            )}
          />
        ))}
      </div>
    );
  };

  const renderDifficultySelector = (value: number | null, onChange: (v: number | null) => void) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((level) => (
        <button
          key={level}
          onClick={() => onChange(value === level ? null : level)}
          className={cn(
            'p-1 rounded transition-colors',
            value === level ? 'text-amber-500' : 'text-gray-300 hover:text-amber-300'
          )}
        >
          <Star className={cn('w-5 h-5', value && level <= value && 'fill-current')} />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-500">
        {value ? getDifficultyLabel(value) : '全部难度'}
      </span>
    </div>
  );

  // Pattern Detail Modal
  const renderPatternDetail = () => {
    if (!selectedPattern) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedPattern.title}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="text-lg">{selectedPattern.author.avatar}</span>
                    {selectedPattern.author.name}
                  </span>
                  <span>{formatDate(selectedPattern.createdAt)}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPattern(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="aspect-[4/3] bg-gradient-to-br from-rose-100 to-amber-100 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-16 h-16 text-rose-300" />
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedPattern.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">图解说明</h3>
                  <p className="text-gray-600">{selectedPattern.description}</p>
                </div>

                {selectedPattern.gauge && (
                  <div className="bg-amber-50 rounded-xl p-4">
                    <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                      <Ruler className="w-4 h-4" />
                      密度信息
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-amber-700/70">行数/10cm</span>
                        <p className="font-medium text-amber-900">{selectedPattern.gauge.rowsPer10cm}</p>
                      </div>
                      <div>
                        <span className="text-amber-700/70">针数/10cm</span>
                        <p className="font-medium text-amber-900">{selectedPattern.gauge.stitchesPer10cm}</p>
                      </div>
                      <div>
                        <span className="text-amber-700/70">推荐针号</span>
                        <p className="font-medium text-amber-900">{selectedPattern.gauge.needleSize}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    所需工具
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPattern.tools.map((tool) => (
                      <span key={tool} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    推荐线材
                  </h3>
                  <div className="space-y-2">
                    {selectedPattern.yarns.map((yarn) => (
                      <div key={yarn.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: yarn.colorCode }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{yarn.name}</p>
                          <p className="text-xs text-gray-500">{yarn.brand} · {yarn.color}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-4">编织步骤预览</h3>
              <div className="space-y-3">
                {selectedPattern.steps.slice(0, 3).map((step, idx) => (
                  <div key={step.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                    <span className="flex-shrink-0 w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-medium text-sm">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-gray-900">{step.instruction}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {step.stitchType} · {step.stitchCount}针
                      </p>
                    </div>
                  </div>
                ))}
                {selectedPattern.steps.length > 3 && (
                  <p className="text-center text-gray-500 text-sm py-2">
                    还有 {selectedPattern.steps.length - 3} 个步骤...
                  </p>
                )}
              </div>
              <button className="w-full mt-4 py-3 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors flex items-center justify-center gap-2">
                <BookOpen className="w-5 h-5" />
                查看完整图解
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Tutorial Detail Modal
  const renderTutorialDetail = () => {
    if (!selectedTutorial) return null;
    const currentStep = selectedTutorial.steps[tutorialStep];
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {selectedTutorial.type === 'video' && <Video className="w-5 h-5 text-rose-500" />}
                  {selectedTutorial.type === 'article' && <FileText className="w-5 h-5 text-blue-500" />}
                  {selectedTutorial.type === 'photo' && <ImageIcon className="w-5 h-5 text-green-500" />}
                  <span className="text-sm text-gray-500">{selectedTutorial.category}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedTutorial.title}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="text-lg">{selectedTutorial.author.avatar}</span>
                    {selectedTutorial.author.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedTutorial.duration}分钟
                  </span>
                </div>
              </div>
              <button
                onClick={() => { setSelectedTutorial(null); setTutorialStep(0); }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ×
              </button>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span>学习进度</span>
                <span>{tutorialStep + 1} / {selectedTutorial.steps.length}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-300"
                  style={{ width: `${((tutorialStep + 1) / selectedTutorial.steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Content */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold">
                  {tutorialStep + 1}
                </span>
                <h3 className="text-xl font-semibold text-gray-900">{currentStep.title}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">{currentStep.content}</p>
              {currentStep.tip && (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                  <p className="text-amber-800 text-sm">
                    <span className="font-semibold">💡 小贴士：</span>
                    {currentStep.tip}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setTutorialStep(Math.max(0, tutorialStep - 1))}
                disabled={tutorialStep === 0}
                className="px-6 py-2 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                上一步
              </button>
              <button
                onClick={() => setTutorialStep(Math.min(selectedTutorial.steps.length - 1, tutorialStep + 1))}
                disabled={tutorialStep === selectedTutorial.steps.length - 1}
                className="px-6 py-2 bg-rose-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-rose-600"
              >
                下一步
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Yarn Detail Modal
  const renderYarnDetail = () => {
    if (!selectedYarn) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg"
                  style={{ backgroundColor: selectedYarn.colorCode }}
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedYarn.name}</h2>
                  <p className="text-gray-500">{selectedYarn.brand} · {selectedYarn.series}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(Math.round(selectedYarn.rating))}
                    <span className="text-sm text-gray-500">({selectedYarn.reviews}条评价)</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedYarn(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <p className="text-sm text-gray-500">成分</p>
                <p className="font-semibold text-gray-900">{selectedYarn.composition}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <p className="text-sm text-gray-500">重量</p>
                <p className="font-semibold text-gray-900">{selectedYarn.weight}g/团</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <p className="text-sm text-gray-500">长度</p>
                <p className="font-semibold text-gray-900">{selectedYarn.yardage}m/团</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <p className="text-sm text-gray-500">参考价格</p>
                <p className="font-semibold text-rose-600">¥{selectedYarn.price}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">用户评价</h3>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🧶</span>
                    <span className="font-medium">编织爱好者</span>
                    {renderStars(5)}
                  </div>
                  <p className="text-gray-600 text-sm">手感非常柔软，颜色也很正，织出来的成品很显档次！</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🌸</span>
                    <span className="font-medium">苏小暖</span>
                    {renderStars(4)}
                  </div>
                  <p className="text-gray-600 text-sm">性价比不错，就是稍微有点起球，总体还是很满意的。</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">搭配建议</h3>
              <p className="text-gray-600 text-sm">适合编织{selectedYarn.composition.includes('棉') ? '夏季衣物、婴儿用品' : selectedYarn.composition.includes('羊毛') ? '冬季保暖衣物、围巾' : '四季通用衣物、配饰'}。</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Compare Modal
  const renderCompareModal = () => {
    if (!showCompare || compareYarns.length === 0) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">线材对比</h2>
              <button
                onClick={() => setShowCompare(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {compareYarns.map((yarn) => (
                <div key={yarn.id} className="border rounded-xl p-4">
                  <div
                    className="w-16 h-16 rounded-xl mx-auto mb-4"
                    style={{ backgroundColor: yarn.colorCode }}
                  />
                  <h3 className="font-semibold text-center mb-4">{yarn.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">品牌</span>
                      <span>{yarn.brand}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">成分</span>
                      <span>{yarn.composition}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">重量</span>
                      <span>{yarn.weight}g</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">长度</span>
                      <span>{yarn.yardage}m</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">针号</span>
                      <span>{yarn.suitableNeedle}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">价格</span>
                      <span className="text-rose-600 font-medium">¥{yarn.price}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">评分</span>
                      <span>{yarn.rating}分</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900">资源中心</h1>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {[
              { id: 'patterns', label: '📖 图解库', icon: BookOpen },
              { id: 'tutorials', label: '📚 教程库', icon: Video },
              { id: 'materials', label: '🧶 材料数据库', icon: Package },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  'flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-rose-500 text-rose-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Pattern Library Tab */}
        {activeTab === 'patterns' && (
          <div className="space-y-6">
            {/* Search & Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索图解、标签..."
                    value={patternSearch}
                    onChange={(e) => setPatternSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPatternView('grid')}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      patternView === 'grid' ? 'bg-rose-100 text-rose-600' : 'text-gray-500 hover:bg-gray-100'
                    )}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPatternView('list')}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      patternView === 'list' ? 'bg-rose-100 text-rose-600' : 'text-gray-500 hover:bg-gray-100'
                    )}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">难度:</span>
                  {renderDifficultySelector(patternDifficulty, setPatternDifficulty)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">分类:</span>
                  <select
                    value={patternCategory}
                    onChange={(e) => setPatternCategory(e.target.value as PatternCategory)}
                    className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">排序:</span>
                  <select
                    value={patternSort}
                    onChange={(e) => setPatternSort(e.target.value as SortType)}
                    className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="latest">最新</option>
                    <option value="popular">最热</option>
                    <option value="rating">评分</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pattern Grid */}
            <div className={cn(
              'grid gap-4',
              patternView === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
            )}>
              {filteredPatterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className={cn(
                    'bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow',
                    patternView === 'list' && 'flex'
                  )}
                >
                  <div className={cn(
                    'relative bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center',
                    patternView === 'grid' ? 'aspect-[4/3]' : 'w-48 flex-shrink-0'
                  )}>
                    <BookOpen className="w-12 h-12 text-rose-300" />
                    <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-medium">
                      {getDifficultyStars(pattern.difficulty)}
                    </div>
                    <div className="absolute top-3 left-3 px-2 py-1 bg-rose-500 text-white rounded-lg text-xs">
                      {categoryLabels[pattern.category]}
                    </div>
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{pattern.title}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{pattern.author.avatar}</span>
                      <span className="text-sm text-gray-500">{pattern.author.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {pattern.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {formatNumber(pattern.likes)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bookmark className="w-4 h-4" />
                        {formatNumber(pattern.saves)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {formatNumber(pattern.likes * 3)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 border border-rose-200 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-50 flex items-center justify-center gap-1">
                        <Bookmark className="w-4 h-4" />
                        收藏
                      </button>
                      <button
                        onClick={() => setSelectedPattern(pattern)}
                        className="flex-1 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 flex items-center justify-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        查看
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tutorial Library Tab */}
        {activeTab === 'tutorials' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">类型:</span>
                  <select
                    value={tutorialType}
                    onChange={(e) => setTutorialType(e.target.value as TutorialType)}
                    className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {Object.entries(tutorialTypeLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">难度:</span>
                  {renderDifficultySelector(tutorialDifficulty, setTutorialDifficulty)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">分类:</span>
                  <select
                    value={tutorialCategory}
                    onChange={(e) => setTutorialCategory(e.target.value)}
                    className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="all">全部</option>
                    <option value="棒针基础">棒针基础</option>
                    <option value="钩针进阶">钩针进阶</option>
                    <option value="棒针进阶">棒针进阶</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tutorial Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTutorials.map((tutorial) => (
                <div
                  key={tutorial.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    {tutorial.type === 'video' && <Play className="w-12 h-12 text-rose-400" />}
                    {tutorial.type === 'article' && <FileText className="w-12 h-12 text-blue-400" />}
                    {tutorial.type === 'photo' && <ImageIcon className="w-12 h-12 text-green-400" />}
                    <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur rounded-lg text-xs">
                      {tutorial.duration}分钟
                    </div>
                    <div className="absolute top-3 left-3 px-2 py-1 bg-gray-900/70 text-white rounded-lg text-xs flex items-center gap-1">
                      {tutorial.type === 'video' && <Video className="w-3 h-3" />}
                      {tutorial.type === 'article' && <FileText className="w-3 h-3" />}
                      {tutorial.type === 'photo' && <ImageIcon className="w-3 h-3" />}
                      {tutorialTypeLabels[tutorial.type]}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{tutorial.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{tutorial.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{tutorial.author.avatar}</span>
                      <span className="text-sm text-gray-500">{tutorial.author.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{getDifficultyStars(tutorial.difficulty)}</span>
                      <span>{tutorial.steps.length}个步骤</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {formatNumber(tutorial.likes)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bookmark className="w-4 h-4" />
                          {formatNumber(tutorial.saves)}
                        </span>
                      </div>
                      <button
                        onClick={() => { setSelectedTutorial(tutorial); setTutorialStep(0); }}
                        className="px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600"
                      >
                        开始学习
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Material Database Tab */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
            {/* Search & Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索线材名称、品牌..."
                    value={materialSearch}
                    onChange={(e) => setMaterialSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">品牌:</span>
                  <select
                    value={materialBrand}
                    onChange={(e) => setMaterialBrand(e.target.value)}
                    className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="all">全部品牌</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">成分:</span>
                  <select
                    value={materialComposition}
                    onChange={(e) => setMaterialComposition(e.target.value as CompositionType)}
                    className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {Object.entries(compositionLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                {compareYarns.length > 0 && (
                  <button
                    onClick={() => setShowCompare(true)}
                    className="px-4 py-1.5 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600"
                  >
                    对比 ({compareYarns.length})
                  </button>
                )}
              </div>
            </div>

            {/* Yarn Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">颜色</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">线材信息</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">成分</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">规格</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">针号</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">价格</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">评分</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredYarns.map((yarn) => (
                      <tr key={yarn.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div
                            className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: yarn.colorCode }}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-medium text-gray-900">{yarn.name}</p>
                          <p className="text-sm text-gray-500">{yarn.brand} · {yarn.series}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">{yarn.composition}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {yarn.weight}g / {yarn.yardage}m
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">{yarn.suitableNeedle}</td>
                        <td className="px-4 py-4">
                          <span className="font-medium text-rose-600">¥{yarn.price}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {renderStars(Math.round(yarn.rating))}
                            <span className="text-sm text-gray-500">({yarn.reviews})</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg">
                              <Heart className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleCompareYarn(yarn)}
                              className={cn(
                                'p-2 rounded-lg',
                                compareYarns.find(y => y.id === yarn.id)
                                  ? 'text-rose-500 bg-rose-50'
                                  : 'text-gray-400 hover:text-rose-500 hover:bg-rose-50'
                              )}
                            >
                              <span className="text-xs font-medium">对比</span>
                            </button>
                            <button
                              onClick={() => setSelectedYarn(yarn)}
                              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {renderPatternDetail()}
      {renderTutorialDetail()}
      {renderYarnDetail()}
      {renderCompareModal()}
    </div>
  );
}
