import { useState, useEffect } from 'react';
import {
  Plus, Search, Heart, MessageCircle, Eye, Bookmark, Tag, Filter, ArrowUp,
  Crown, Trophy, Medal, Star, Users, Clock, CheckCircle, Copy, MoreHorizontal,
  Send, Image, X, Flame, Calendar, Award
} from 'lucide-react';
import { cn, formatDate, formatNumber, getCategoryLabel } from '@/utils/cn';
import { mockPosts, mockActivities, currentUser, mockUsers, mockProjects } from '@/data/mock';
import { getStorageData, setStorageData, STORAGE_KEYS } from '@/utils/storage';
import type { Post, Activity } from '@/types';

// ============== Types ==============
type CategoryFilter = 'all' | 'knitting' | 'crochet' | 'weaving' | 'embroidery';
type TypeFilter = 'all' | 'question' | 'tutorial' | 'discussion' | 'showcase';
type WorkTypeFilter = 'all' | 'clothing' | 'amigurumi' | 'accessories' | 'home_decor';

interface NewPostForm {
  title: string;
  content: string;
  type: Post['type'];
  category: Post['category'];
  tags: string;
}

// ============== Helper Components ==============
const PostTypeBadge = ({ type }: { type: Post['type'] }) => {
  const config: Record<Post['type'], { label: string; className: string }> = {
    help: { label: '求助', className: 'bg-rose-100 text-rose-700' },
    question: { label: '求助', className: 'bg-rose-100 text-rose-700' },
    tutorial: { label: '教程', className: 'bg-blue-100 text-blue-700' },
    discussion: { label: '讨论', className: 'bg-brand-100 text-brand-700' },
    showcase: { label: '展示', className: 'bg-green-100 text-green-700' },
  };
  const { label, className } = config[type] || { label: type, className: 'bg-gray-100 text-gray-700' };
  return <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', className)}>{label}</span>;
};

const CategoryBadge = ({ category }: { category: string }) => (
  <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
    {getCategoryLabel(category)}
  </span>
);

const StatusBadge = ({ status }: { status: Activity['status'] }) => {
  const config: Record<Activity['status'], { label: string; className: string }> = {
    active: { label: '进行中', className: 'bg-green-100 text-green-700' },
    upcoming: { label: '即将开始', className: 'bg-blue-100 text-blue-700' },
    ended: { label: '已结束', className: 'bg-gray-100 text-gray-500' },
  };
  const { label, className } = config[status];
  return <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', className)}>{label}</span>;
};

const MedalIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <span className="text-2xl">🥇</span>;
  if (rank === 2) return <span className="text-2xl">🥈</span>;
  if (rank === 3) return <span className="text-2xl">🥉</span>;
  return <span className="text-gray-400 font-bold">#{rank}</span>;
};

// ============== Discussion Forum Tab ==============
const DiscussionForum = () => {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [newPost, setNewPost] = useState<NewPostForm>({
    title: '',
    content: '',
    type: 'discussion',
    category: 'knitting',
    tags: '',
  });
  
  // 从 localStorage 加载帖子数据，fallback 到 mock 数据
  const loadPosts = (): Post[] => {
    const stored = getStorageData<Post[]>(STORAGE_KEYS.POSTS, []);
    if (stored.length > 0) {
      return stored;
    }
    return mockPosts;
  };
  
  const [posts, setPosts] = useState<Post[]>(loadPosts);
  const [newComment, setNewComment] = useState<Record<string, string>>({});

  // 持久化帖子数据到 localStorage
  useEffect(() => {
    setStorageData(STORAGE_KEYS.POSTS, posts);
  }, [posts]);

  const categoryOptions: { value: CategoryFilter; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'knitting', label: '棒针' },
    { value: 'crochet', label: '钩针' },
    { value: 'weaving', label: '梭织' },
    { value: 'embroidery', label: '刺绣' },
  ];

  const typeOptions: { value: TypeFilter; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'question', label: '求助' },
    { value: 'tutorial', label: '教程' },
    { value: 'discussion', label: '讨论' },
    { value: 'showcase', label: '展示' },
  ];

  const filteredPosts = posts.filter((post) => {
    const matchCategory = categoryFilter === 'all' || post.category === categoryFilter;
    const matchType = typeFilter === 'all' || post.type === typeFilter;
    const matchSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchType && matchSearch;
  });

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    
    const createdPost: Post = {
      id: `post-${Date.now()}`,
      author: currentUser,
      title: newPost.title,
      content: newPost.content,
      category: newPost.category as Post['category'],
      tags: newPost.tags.split(',').map(t => t.trim()).filter(Boolean),
      type: newPost.type,
      images: [],
      likes: 0,
      comments: [],
      views: 0,
      createdAt: new Date().toISOString(),
    };
    
    setPosts([createdPost, ...posts]);
    setShowNewPostModal(false);
    setNewPost({ title: '', content: '', type: 'discussion', category: 'knitting', tags: '' });
  };

  const handleAddComment = (postId: string) => {
    const commentText = newComment[postId];
    if (!commentText?.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: `comment-${Date.now()}`,
              author: currentUser,
              content: commentText,
              createdAt: new Date().toISOString(),
              likes: 0,
            }
          ]
        };
      }
      return post;
    }));
    setNewComment({ ...newComment, [postId]: '' });
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="搜索帖子..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>

      {/* Filter Tabs */}
      <div className="space-y-3">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categoryOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setCategoryFilter(opt.value)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                categoryFilter === opt.value
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {/* Type Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTypeFilter(opt.value)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
                typeFilter === opt.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Post List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
            >
              {/* Author Row */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{post.author.avatar}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{post.author.name}</div>
                  <div className="text-xs text-gray-400">{formatDate(post.createdAt)}</div>
                </div>
                <PostTypeBadge type={post.type} />
              </div>

              {/* Title */}
              <h3 className="font-bold text-lg text-gray-900 mb-2">{post.title}</h3>

              {/* Content Excerpt */}
              <p className="text-gray-600 text-sm line-clamp-3 mb-3">{post.content}</p>

              {/* Tags Row */}
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-orange-50 text-orange-600">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
                <CategoryBadge category={post.category} />
              </div>

              {/* Bottom Row */}
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <button
                  onClick={(e) => { e.stopPropagation(); handleLikePost(post.id); }}
                  className="flex items-center gap-1 hover:text-rose-500 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  {formatNumber(post.likes)}
                </button>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {post.comments.length}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {formatNumber(post.views)}
                </div>
                {post.linkedProject && (
                  <span className="flex items-center gap-1 text-blue-600">
                    <Bookmark className="w-4 h-4" />
                    关联项目
                  </span>
                )}
                {post.isResolved && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    已解决
                  </span>
                )}
              </div>
            </div>

            {/* Expanded Comments Section */}
            {expandedPostId === post.id && (
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                {/* Comments List */}
                <div className="space-y-3 mb-4">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className={cn(
                      "p-3 rounded-lg",
                      comment.isAnswer ? "bg-green-50 border border-green-200" : "bg-white"
                    )}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{comment.author.avatar}</span>
                        <span className="font-medium text-sm text-gray-900">{comment.author.name}</span>
                        {comment.isAnswer && (
                          <span className="px-1.5 py-0.5 rounded text-xs bg-green-100 text-green-700">最佳答案</span>
                        )}
                        <span className="text-xs text-gray-400 ml-auto">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700 ml-8">{comment.content}</p>
                      <div className="flex items-center gap-1 ml-8 mt-1 text-xs text-gray-400">
                        <Heart className="w-3 h-3" />
                        {comment.likes}
                      </div>
                    </div>
                  ))}
                  {post.comments.length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-4">暂无评论，快来抢沙发吧~</p>
                  )}
                </div>

                {/* Comment Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="写评论..."
                    value={newComment[post.id] || ''}
                    onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAddComment(post.id); }}
                    className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm hover:bg-brand-600 transition-colors flex items-center gap-1"
                  >
                    <Send className="w-4 h-4" />
                    发送
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>暂无相关帖子</p>
        </div>
      )}

      {/* Floating Post Button */}
      <button
        onClick={() => setShowNewPostModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand-500 text-white rounded-full shadow-lg hover:bg-brand-600 transition-all hover:scale-105 flex items-center justify-center z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">发布新帖</h2>
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="给帖子起个标题..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="分享你的编织心得、问题或作品..."
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  />
                </div>

                {/* Type Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">帖子类型</label>
                  <div className="flex flex-wrap gap-2">
                    {typeOptions.filter(o => o.value !== 'all').map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setNewPost({ ...newPost, type: opt.value as Post['type'] })}
                        className={cn(
                          'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                          newPost.type === opt.value
                            ? 'bg-brand-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                  <div className="flex flex-wrap gap-2">
                    {categoryOptions.filter(o => o.value !== 'all').map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setNewPost({ ...newPost, category: opt.value as Post['category'] })}
                        className={cn(
                          'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                          newPost.category === opt.value
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">标签（用逗号分隔）</label>
                  <input
                    type="text"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    placeholder="例如：棒针, 入门, 求助"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowNewPostModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPost.title.trim() || !newPost.content.trim()}
                    className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    发布
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============== Works Gallery Tab ==============
const WorksGallery = () => {
  const [typeFilter, setTypeFilter] = useState<WorkTypeFilter>('all');
  const [showCopyModal, setShowCopyModal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const workTypeOptions: { value: WorkTypeFilter; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'clothing', label: '衣物' },
    { value: 'amigurumi', label: '玩偶' },
    { value: 'accessories', label: '配饰' },
    { value: 'home_decor', label: '家居' },
  ];

  // Mock works data based on patterns and projects
  const works = [
    {
      id: 'w1',
      title: '春日花园开衫',
      author: mockUsers[1],
      pattern: mockPatterns[0],
      likes: 234,
      gradient: 'from-pink-200 via-rose-100 to-orange-100',
      linkedPattern: mockPatterns[0],
      yarns: ['樱花粉达夫棉DK', '鼠尾草绿自然棉线'],
      modifications: ['肩部蕾丝花样改为叶子花样'],
    },
    {
      id: 'w2',
      title: '小熊玩偶',
      author: mockUsers[0],
      pattern: mockPatterns[1],
      likes: 567,
      gradient: 'from-amber-200 via-yellow-100 to-orange-100',
      linkedPattern: mockPatterns[1],
      yarns: ['奶油白可爱圆球棉', '薰衣草紫柔软美利奴'],
      modifications: ['帽子颜色改成了蓝色'],
    },
    {
      id: 'w3',
      title: '费尔岛提花围巾',
      author: mockUsers[3],
      pattern: mockPatterns[2],
      likes: 345,
      gradient: 'from-green-200 via-teal-100 to-blue-100',
      linkedPattern: mockPatterns[2],
      yarns: ['樱花粉达夫棉DK', '鼠尾草绿自然棉线'],
      modifications: [],
    },
    {
      id: 'w4',
      title: '法式贝雷帽',
      author: mockUsers[2],
      pattern: mockPatterns[3],
      likes: 189,
      gradient: 'from-purple-200 via-violet-100 to-pink-100',
      linkedPattern: mockPatterns[3],
      yarns: ['鹅黄云朵宝宝绒'],
      modifications: ['加了一圈双层帽缘'],
    },
    {
      id: 'w5',
      title: '蕾丝夏衫',
      author: mockUsers[1],
      pattern: mockPatterns[4],
      likes: 456,
      gradient: 'from-sky-200 via-cyan-100 to-teal-100',
      linkedPattern: mockPatterns[4],
      yarns: ['雾蓝蕾丝棉线'],
      modifications: [],
    },
    {
      id: 'w6',
      title: '婴儿毯',
      author: mockUsers[0],
      pattern: mockPatterns[5],
      likes: 234,
      gradient: 'from-blue-200 via-indigo-100 to-purple-100',
      linkedPattern: mockPatterns[5],
      yarns: ['奶油白可爱圆球棉'],
      modifications: [],
    },
  ];

  const filteredWorks = typeFilter === 'all'
    ? works
    : works.filter((_, i) => i % 4 === ['clothing', 'amigurumi', 'accessories', 'home_decor'].indexOf(typeFilter) || typeFilter === 'all');

  const handleCopyWork = (workId: string) => {
    const work = works.find((w) => w.id === workId);
    if (!work) return;

    const copyData = {
      pattern: work.pattern?.title || '',
      yarns: work.yarns.join(' + '),
      modifications: work.modifications.length > 0 ? work.modifications.join(', ') : '无',
    };

    navigator.clipboard.writeText(JSON.stringify(copyData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateProject = (workId: string) => {
    // Create a new project based on the work
    setShowCopyModal(null);
    alert('项目创建成功！可以在"我的项目"中查看。');
  };

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {workTypeOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setTypeFilter(opt.value)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              typeFilter === opt.value
                ? 'bg-gradient-to-r from-brand-500 to-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {works.map((work) => (
          <div
            key={work.id}
            className="break-inside-avoid bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Gradient Image Area */}
            <div className={cn('h-48 bg-gradient-to-br', work.gradient)}>
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl opacity-50">{work.author.avatar}</span>
              </div>
            </div>

            <div className="p-4">
              {/* Title */}
              <h3 className="font-bold text-gray-900 mb-2">{work.title}</h3>

              {/* Author */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{work.author.avatar}</span>
                <span className="text-sm text-gray-600">{work.author.name}</span>
              </div>

              {/* Pattern Link */}
              {work.linkedPattern && (
                <div className="flex items-center gap-2 mb-3 text-sm text-blue-600">
                  <Bookmark className="w-4 h-4" />
                  <span>图解：{work.linkedPattern.title}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCopyModal(work.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-brand-50 text-brand-600 rounded-lg text-sm font-medium hover:bg-brand-100 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  仿织
                </button>
                <button className="flex items-center gap-1 px-3 py-2 text-gray-500 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  <Heart className="w-4 h-4" />
                  {work.likes}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Copy Modal */}
      {showCopyModal && (() => {
        const work = works.find((w) => w.id === showCopyModal);
        if (!work) return null;

        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">仿织详情</h2>
                  <button
                    onClick={() => setShowCopyModal(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Pattern */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-xs text-blue-600 mb-1">图解</div>
                    <div className="font-medium text-gray-900">{work.pattern?.title || '无'}</div>
                  </div>

                  {/* Yarns */}
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-xs text-green-600 mb-1">推荐用线</div>
                    <div className="font-medium text-gray-900">
                      {work.yarns.map((yarn, i) => (
                        <div key={i}>{yarn}</div>
                      ))}
                    </div>
                  </div>

                  {/* Modifications */}
                  {work.modifications.length > 0 && (
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="text-xs text-orange-600 mb-1">个人修改</div>
                      <div className="font-medium text-gray-900">
                        {work.modifications.map((mod, i) => (
                          <div key={i}>{mod}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopyWork(work.id)}
                    className={cn(
                      'w-full py-3 rounded-lg text-sm font-medium transition-all',
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-brand-500 text-white hover:bg-brand-600'
                    )}
                  >
                    {copied ? '✓ 已复制到剪贴板' : '复制参数'}
                  </button>

                  {/* Create Project Button */}
                  <button
                    onClick={() => handleCreateProject(work.id)}
                    className="w-full py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-500 to-orange-500 text-white hover:opacity-90 transition-opacity"
                  >
                    确认创建项目
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

// ============== Activity Center Tab ==============
const ActivityCenter = () => {
  const activities = mockActivities;

  return (
    <div className="space-y-6">
      {/* Featured Activity */}
      {activities[0] && (
        <div className="bg-gradient-to-br from-brand-500 via-rose-500 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5" />
              <span className="text-sm font-medium bg-white/20 px-2 py-0.5 rounded-full">热门活动</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">{activities[0].title}</h2>
            <p className="text-white/80 mb-4">{activities[0].description}</p>
            
            <div className="flex items-center gap-4 text-sm mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {activities[0].startDate} ~ {activities[0].endDate}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {activities[0].participantCount}人参加
              </div>
            </div>

            {/* Prize List */}
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">🏆 奖励</div>
              <div className="flex flex-wrap gap-2">
                {activities[0].prizes.map((prize, i) => (
                  <span key={i} className="px-2 py-1 bg-white/20 rounded text-sm">
                    {prize}
                  </span>
                ))}
              </div>
            </div>

            <button className="px-6 py-2 bg-white text-brand-600 rounded-full font-medium hover:bg-white/90 transition-colors">
              参加活动
            </button>
          </div>
        </div>
      )}

      {/* Activity Cards */}
      <div className="space-y-4">
        {activities.map((activity, index) => (
          index > 0 && (
            <div
              key={activity.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg text-gray-900">{activity.title}</h3>
                <StatusBadge status={activity.status} />
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{activity.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {activity.startDate} ~ {activity.endDate}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {activity.participantCount}人
                </div>
              </div>

              {/* Progress Bar */}
              {activity.status === 'active' && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>参与进度</span>
                    <span>{Math.min(activity.participantCount, 1000)}/1000</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-orange-500 rounded-full transition-all"
                      style={{ width: `${Math.min(activity.participantCount / 10, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Prizes */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-1">奖励</div>
                <div className="flex flex-wrap gap-2">
                  {activity.prizes.map((prize, i) => (
                    <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs">
                      <Award className="w-3 h-3 inline mr-1" />
                      {prize}
                    </span>
                  ))}
                </div>
              </div>

              <button className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activity.status === 'active'
                  ? 'bg-brand-500 text-white hover:bg-brand-600'
                  : activity.status === 'upcoming'
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-100 text-gray-500'
              )}>
                {activity.status === 'active' ? '参加活动' : '查看详情'}
              </button>
            </div>
          )
        ))}
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-lg text-gray-900">排行榜</h3>
        </div>

        <div className="space-y-3">
          {mockLeaderboard.map((entry) => (
            <div
              key={entry.user.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10">
                <MedalIcon rank={entry.rank} />
              </div>
              <span className="text-2xl">{entry.user.avatar}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{entry.user.name}</div>
                <div className="text-xs text-gray-500">
                  {entry.completedProjects}件作品 · {entry.badges}枚徽章
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-brand-600">{formatNumber(entry.points)}</div>
                <div className="text-xs text-gray-400">积分</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============== Main Community Page Component ==============
type TabType = 'discussion' | 'works' | 'activities';

export const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('discussion');

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'discussion', label: '讨论区', icon: <MessageCircle className="w-5 h-5" /> },
    { id: 'works', label: '作品展示', icon: <Star className="w-5 h-5" /> },
    { id: 'activities', label: '活动中心', icon: <Trophy className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4">
          {/* Page Title */}
          <div className="py-4">
            <h1 className="text-2xl font-bold text-gray-900">🧶 织趣社区</h1>
            <p className="text-sm text-gray-500">与织友们分享、交流、成长</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                  activeTab === tab.id
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'discussion' && <DiscussionForum />}
        {activeTab === 'works' && <WorksGallery />}
        {activeTab === 'activities' && <ActivityCenter />}
      </div>
    </div>
  );
};
