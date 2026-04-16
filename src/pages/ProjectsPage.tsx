import { useState, useEffect } from 'react';
import {
  Plus,
  FolderKanban,
  Calendar,
  Clock,
  Edit3,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  ChevronRight,
  FileText,
  Camera,
  Heart,
  GitBranch,
  MoreHorizontal,
  Target,
} from 'lucide-react';
import { cn, formatDate, getStatusLabel, getDifficultyStars } from '@/utils/cn';
import { mockProjects, currentUser, mockPatterns } from '@/data/mock';
import { getStorageData, setStorageData, STORAGE_KEYS } from '@/utils/storage';
import type { Project, JournalEntry } from '@/types';

type FilterTab = 'all' | 'in_progress' | 'completed' | 'planning';
type DetailTab = 'overview' | 'journal' | 'progress';
type MoodType = 'happy' | 'frustrated' | 'proud' | 'neutral';

const moodEmojis: Record<MoodType, string> = {
  happy: '😊',
  frustrated: '😤',
  proud: '🥰',
  neutral: '😐',
};

const moodLabels: Record<MoodType, string> = {
  happy: '开心',
  frustrated: '沮丧',
  proud: '自豪',
  neutral: '平静',
};

export function ProjectsPage() {
  // 从 localStorage 加载项目数据，fallback 到 mock 数据
  const loadProjects = (): Project[] => {
    const stored = getStorageData<Project[]>(STORAGE_KEYS.PROJECTS, []);
    if (stored.length > 0) {
      return stored;
    }
    // 首次加载，返回当前用户的 mock 数据
    return mockProjects.filter(p => p.owner.id === currentUser.id);
  };

  const [projects, setProjects] = useState<Project[]>(loadProjects);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('overview');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // New project form state
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectPatternId, setNewProjectPatternId] = useState('');
  const [newProjectTargetDate, setNewProjectTargetDate] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState<Project['status']>('planning');
  
  // Journal form state
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [journalTitle, setJournalTitle] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [journalMood, setJournalMood] = useState<MoodType>('happy');
  const [journalStitch, setJournalStitch] = useState('');
  const [journalProgress, setJournalProgress] = useState(0);
  
  // Timer state
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Milestones state
  const [milestones, setMilestones] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [newMilestone, setNewMilestone] = useState('');

  // 持久化项目数据到 localStorage
  useEffect(() => {
    setStorageData(STORAGE_KEYS.PROJECTS, projects);
  }, [projects]);

  const filteredProjects = projects.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'in_progress': return 'from-brand-400 to-brand-600';
      case 'completed': return 'from-green-400 to-green-600';
      case 'planning': return 'from-blue-400 to-blue-600';
      case 'paused': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const handleCreateProject = () => {
    if (!newProjectTitle.trim()) return;
    
    const pattern = mockPatterns.find(p => p.id === newProjectPatternId);
    const newProject: Project = {
      id: `proj${Date.now()}`,
      title: newProjectTitle,
      description: newProjectDescription,
      coverImage: '',
      owner: currentUser,
      pattern: pattern,
      status: newProjectStatus,
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      targetDate: newProjectTargetDate || undefined,
      yarnsUsed: [],
      modifications: [],
      journal: [],
      totalTime: 0,
      images: [],
    };
    
    setProjects([...projects, newProject]);
    setShowNewProjectModal(false);
    resetNewProjectForm();
  };
  const [filter, setFilter] = useState<FilterTab>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('overview');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // New project form state
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectPatternId, setNewProjectPatternId] = useState('');
  const [newProjectTargetDate, setNewProjectTargetDate] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState<Project['status']>('planning');
  
  // Journal form state
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [journalTitle, setJournalTitle] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [journalMood, setJournalMood] = useState<MoodType>('happy');
  const [journalStitch, setJournalStitch] = useState('');
  const [journalProgress, setJournalProgress] = useState(0);
  
  // Timer state
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Milestones state
  const [milestones, setMilestones] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [newMilestone, setNewMilestone] = useState('');

  const filteredProjects = projects.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'in_progress': return 'from-brand-400 to-brand-600';
      case 'completed': return 'from-green-400 to-green-600';
      case 'planning': return 'from-blue-400 to-blue-600';
      case 'paused': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const handleCreateProject = () => {
    if (!newProjectTitle.trim()) return;
    
    const pattern = mockPatterns.find(p => p.id === newProjectPatternId);
    const newProject: Project = {
      id: `proj${Date.now()}`,
      title: newProjectTitle,
      description: newProjectDescription,
      coverImage: '',
      owner: currentUser,
      pattern: pattern,
      status: newProjectStatus,
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      targetDate: newProjectTargetDate || undefined,
      yarnsUsed: [],
      modifications: [],
      journal: [],
      totalTime: 0,
      images: [],
    };
    
    setProjects([...projects, newProject]);
    setShowNewProjectModal(false);
    resetNewProjectForm();
  };

  const resetNewProjectForm = () => {
    setNewProjectTitle('');
    setNewProjectDescription('');
    setNewProjectPatternId('');
    setNewProjectTargetDate('');
    setNewProjectStatus('planning');
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
    setEditingProject(null);
  };

  const handleAddJournalEntry = () => {
    if (!selectedProject || !journalTitle.trim()) return;
    
    const newEntry: JournalEntry = {
      id: `j${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: journalTitle,
      content: journalContent,
      images: [],
      stitches: journalStitch,
      mood: journalMood,
      progress: journalProgress,
    };
    
    const updatedProject = {
      ...selectedProject,
      journal: [...selectedProject.journal, newEntry],
      progress: Math.max(selectedProject.progress, journalProgress),
    };
    
    handleUpdateProject(updatedProject);
    setShowJournalForm(false);
    resetJournalForm();
  };

  const resetJournalForm = () => {
    setJournalTitle('');
    setJournalContent('');
    setJournalMood('happy');
    setJournalStitch('');
    setJournalProgress(selectedProject?.progress || 0);
  };

  const toggleTimer = () => {
    if (timerRunning) {
      if (timerInterval) clearInterval(timerInterval);
      setTimerInterval(null);
      setTimerRunning(false);
      
      // Add time to project
      if (selectedProject) {
        const hoursAdded = timerSeconds / 3600;
        handleUpdateProject({
          ...selectedProject,
          totalTime: selectedProject.totalTime + hoursAdded,
        });
      }
      setTimerSeconds(0);
    } else {
      setTimerRunning(true);
      const interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
      setTimerInterval(interval);
    }
  };

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addMilestone = () => {
    if (!newMilestone.trim()) return;
    setMilestones([...milestones, { id: `m${Date.now()}`, text: newMilestone, completed: false }]);
    setNewMilestone('');
  };

  const toggleMilestone = (id: string) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, completed: !m.completed } : m));
  };

  const deleteMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-cream-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-100 rounded-xl">
                <FolderKanban className="w-6 h-6 text-brand-600" />
              </div>
              <h1 className="text-2xl font-bold text-stone-800">我的项目</h1>
            </div>
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="btn-primary flex items-center justify-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              新建项目
            </button>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {[
              { key: 'all', label: '全部' },
              { key: 'in_progress', label: '编织中' },
              { key: 'completed', label: '已完成' },
              { key: 'planning', label: '计划中' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as FilterTab)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  filter === tab.key
                    ? 'bg-brand-500 text-white'
                    : 'bg-cream-100 text-stone-600 hover:bg-cream-200'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const statusInfo = getStatusLabel(project.status);
            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="pattern-card bg-white rounded-2xl shadow-sm border border-cream-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                {/* Cover Image Placeholder */}
                <div className={cn('h-32 bg-gradient-to-br', getStatusGradient(project.status))}>
                  <div className="h-full flex items-center justify-center">
                    <FolderKanban className="w-12 h-12 text-white/50" />
                  </div>
                </div>
                
                <div className="p-5">
                  {/* Title & Status */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-stone-800 line-clamp-1">{project.title}</h3>
                    <span className={cn('px-2 py-1 rounded-full text-xs font-medium shrink-0', statusInfo.color)}>
                      {statusInfo.label}
                    </span>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-stone-500 line-clamp-2 mb-4">{project.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                      <span>进度</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Timeline Info */}
                  <div className="flex items-center gap-4 text-xs text-stone-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{project.startDate}</span>
                    </div>
                    {project.targetDate && (
                      <div className="flex items-center gap-1">
                        <Target className="w-3.5 h-3.5" />
                        <span>{project.targetDate}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{project.totalTime}h</span>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-cream-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProject(project);
                      }}
                      className="p-2 text-stone-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                      className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {project.status === 'in_progress' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateProject({ ...project, status: 'paused' });
                        }}
                        className="p-2 text-stone-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                    ) : project.status === 'paused' || project.status === 'planning' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateProject({ ...project, status: 'in_progress' });
                        }}
                        className="p-2 text-stone-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    ) : null}
                    <div className="flex-1" />
                    <ChevronRight className="w-4 h-4 text-stone-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <FolderKanban className="w-16 h-16 text-cream-300 mx-auto mb-4" />
            <p className="text-stone-500">暂无项目</p>
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="mt-4 text-brand-500 hover:text-brand-600 font-medium"
            >
              创建第一个项目 →
            </button>
          </div>
        )}
      </div>

      {/* Project Detail View */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Detail Header */}
            <div className="p-6 border-b border-cream-200 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-stone-800">{selectedProject.title}</h2>
                <div className="flex items-center gap-3 mt-2 text-sm text-stone-500">
                  <span className={cn('px-2 py-0.5 rounded-full text-xs', getStatusLabel(selectedProject.status).color)}>
                    {getStatusLabel(selectedProject.status).label}
                  </span>
                  <span>开始于 {selectedProject.startDate}</span>
                  {selectedProject.targetDate && (
                    <span>目标完成 {selectedProject.targetDate}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-cream-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            
            {/* Detail Tabs */}
            <div className="flex border-b border-cream-200">
              {[
                { key: 'overview', label: '项目概览', icon: FileText },
                { key: 'journal', label: '编织日志', icon: Camera },
                { key: 'progress', label: '进度管理', icon: Target },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setDetailTab(tab.key as DetailTab)}
                  className={cn(
                    'flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors',
                    detailTab === tab.key
                      ? 'border-brand-500 text-brand-600'
                      : 'border-transparent text-stone-500 hover:text-stone-700'
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* Detail Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Overview Tab */}
              {detailTab === 'overview' && (
                <div className="space-y-6">
                  {/* Pattern Info */}
                  {selectedProject.pattern && (
                    <div className="bg-cream-50 rounded-xl p-4">
                      <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
                        <GitBranch className="w-4 h-4" />
                        关联图解
                      </h3>
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-brand-300 to-brand-500 rounded-lg flex items-center justify-center">
                          <FolderKanban className="w-8 h-8 text-white/50" />
                        </div>
                        <div>
                          <h4 className="font-medium text-stone-800">{selectedProject.pattern.title}</h4>
                          <p className="text-sm text-stone-500 mt-1">难度: {getDifficultyStars(selectedProject.pattern.difficulty)}</p>
                          <p className="text-sm text-stone-500">作者: {selectedProject.pattern.author.name}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Yarns Used */}
                  {selectedProject.yarnsUsed.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-stone-800 mb-3">使用线材</h3>
                      <div className="flex flex-wrap gap-3">
                        {selectedProject.yarnsUsed.map((yarn) => (
                          <div key={yarn.id} className="flex items-center gap-2 bg-white border border-cream-200 rounded-lg px-3 py-2">
                            <div
                              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: yarn.colorCode }}
                            />
                            <span className="text-sm text-stone-700">{yarn.name}</span>
                            <span className="text-xs text-stone-400">{yarn.color}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Modifications */}
                  {selectedProject.modifications.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-stone-800 mb-3">个人修改</h3>
                      <ul className="space-y-2">
                        {selectedProject.modifications.map((mod, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-stone-600">
                            <span className="text-brand-500 mt-0.5">•</span>
                            {mod}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-cream-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-brand-600">{selectedProject.progress}%</div>
                      <div className="text-xs text-stone-500">完成进度</div>
                    </div>
                    <div className="bg-cream-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-brand-600">{selectedProject.totalTime}h</div>
                      <div className="text-xs text-stone-500">总用时</div>
                    </div>
                    <div className="bg-cream-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-brand-600">{selectedProject.journal.length}</div>
                      <div className="text-xs text-stone-500">日志数量</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Journal Tab */}
              {detailTab === 'journal' && (
                <div className="space-y-6">
                  {/* Add Journal Button */}
                  {!showJournalForm && (
                    <button
                      onClick={() => setShowJournalForm(true)}
                      className="w-full py-3 border-2 border-dashed border-brand-300 rounded-xl text-brand-600 font-medium hover:bg-brand-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      添加日志
                    </button>
                  )}
                  
                  {/* Journal Form */}
                  {showJournalForm && (
                    <div className="bg-cream-50 rounded-xl p-4 space-y-4">
                      <input
                        type="text"
                        placeholder="日志标题"
                        value={journalTitle}
                        onChange={(e) => setJournalTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <textarea
                        placeholder="记录今天的编织心得..."
                        value={journalContent}
                        onChange={(e) => setJournalContent(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <select
                          value={journalMood}
                          onChange={(e) => setJournalMood(e.target.value as MoodType)}
                          className="px-3 py-2 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                          {Object.entries(moodLabels).map(([key, label]) => (
                            <option key={key} value={key}>{moodEmojis[key as MoodType]} {label}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="针法类型"
                          value={journalStitch}
                          onChange={(e) => setJournalStitch(e.target.value)}
                          className="px-3 py-2 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-stone-500">进度: {journalProgress}%</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={journalProgress}
                          onChange={(e) => setJournalProgress(Number(e.target.value))}
                          className="w-full mt-1"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddJournalEntry}
                          className="flex-1 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                        >
                          保存
                        </button>
                        <button
                          onClick={() => {
                            setShowJournalForm(false);
                            resetJournalForm();
                          }}
                          className="flex-1 py-2 bg-cream-200 text-stone-600 rounded-lg hover:bg-cream-300 transition-colors"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Journal Timeline */}
                  <div className="space-y-4">
                    {selectedProject.journal.length === 0 ? (
                      <p className="text-center text-stone-400 py-8">还没有日志，添加第一条吧！</p>
                    ) : (
                      selectedProject.journal.slice().reverse().map((entry, idx) => (
                        <div key={entry.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-lg">
                              {entry.mood ? moodEmojis[entry.mood] : '📝'}
                            </div>
                            {idx < selectedProject.journal.length - 1 && (
                              <div className="w-0.5 flex-1 bg-cream-200 my-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="bg-cream-50 rounded-xl p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-stone-800">{entry.title}</h4>
                                <span className="text-xs text-stone-400">{entry.date}</span>
                              </div>
                              <p className="text-sm text-stone-600 mb-2">{entry.content}</p>
                              <div className="flex items-center gap-3 text-xs text-stone-400">
                                {entry.stitches && <span>针法: {entry.stitches}</span>}
                                {entry.progress !== undefined && <span>进度: {entry.progress}%</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Progress Mini Chart */}
                  {selectedProject.journal.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium text-stone-700 mb-3">进度变化</h4>
                      <div className="h-24 flex items-end gap-1">
                        {selectedProject.journal.map((entry, idx) => (
                          <div
                            key={entry.id}
                            className="flex-1 bg-brand-400 rounded-t hover:bg-brand-500 transition-colors relative group"
                            style={{ height: `${entry.progress || 0}%` }}
                          >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-stone-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {entry.date}: {entry.progress}%
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-stone-400 mt-2">
                        <span>{selectedProject.journal[0]?.date}</span>
                        <span>{selectedProject.journal[selectedProject.journal.length - 1]?.date}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Progress Tab */}
              {detailTab === 'progress' && (
                <div className="space-y-6">
                  {/* Circular Progress */}
                  <div className="flex flex-col items-center py-6">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          stroke="#f5f5dc"
                          strokeWidth="12"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          stroke="url(#progressGradient)"
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 70 * selectedProject.progress / 100} ${2 * Math.PI * 70}`}
                          className="transition-all duration-500"
                        />
                        <defs>
                          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f4a261" />
                            <stop offset="100%" stopColor="#e76f51" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-stone-800">{selectedProject.progress}%</span>
                        <span className="text-xs text-stone-500">完成度</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Slider */}
                  <div className="bg-cream-50 rounded-xl p-4">
                    <label className="text-sm font-medium text-stone-700">调整进度</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedProject.progress}
                      onChange={(e) => handleUpdateProject({ ...selectedProject, progress: Number(e.target.value) })}
                      className="w-full mt-2"
                    />
                    <div className="flex justify-between text-xs text-stone-400 mt-1">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  
                  {/* Target Date */}
                  <div className="bg-cream-50 rounded-xl p-4">
                    <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      目标完成日期
                    </label>
                    <input
                      type="date"
                      value={selectedProject.targetDate || ''}
                      onChange={(e) => handleUpdateProject({ ...selectedProject, targetDate: e.target.value })}
                      className="mt-2 px-3 py-2 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  
                  {/* Timer */}
                  <div className="bg-cream-50 rounded-xl p-4">
                    <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      计时器
                    </label>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="text-3xl font-mono font-bold text-stone-800">
                        {formatTimer(timerSeconds)}
                      </div>
                      <button
                        onClick={toggleTimer}
                        className={cn(
                          'px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors',
                          timerRunning
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-brand-500 text-white hover:bg-brand-600'
                        )}
                      >
                        {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {timerRunning ? '停止' : '开始'}
                      </button>
                    </div>
                    <p className="text-xs text-stone-500 mt-2">
                      已累计投入 {selectedProject.totalTime} 小时
                    </p>
                  </div>
                  
                  {/* Milestones */}
                  <div>
                    <h4 className="font-medium text-stone-700 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      里程碑
                    </h4>
                    <div className="space-y-2 mb-3">
                      {milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="flex items-center gap-3 bg-cream-50 rounded-lg p-3"
                        >
                          <button
                            onClick={() => toggleMilestone(milestone.id)}
                            className={cn(
                              'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                              milestone.completed
                                ? 'bg-brand-500 border-brand-500 text-white'
                                : 'border-stone-300 hover:border-brand-400'
                            )}
                          >
                            {milestone.completed && <CheckCircle className="w-3.5 h-3.5" />}
                          </button>
                          <span className={cn(
                            'flex-1 text-sm',
                            milestone.completed ? 'text-stone-400 line-through' : 'text-stone-700'
                          )}>
                            {milestone.text}
                          </span>
                          <button
                            onClick={() => deleteMilestone(milestone.id)}
                            className="text-stone-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="添加新里程碑..."
                        value={newMilestone}
                        onChange={(e) => setNewMilestone(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addMilestone()}
                        className="flex-1 px-3 py-2 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <button
                        onClick={addMilestone}
                        className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-cream-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-stone-800">新建项目</h2>
              <button
                onClick={() => {
                  setShowNewProjectModal(false);
                  resetNewProjectForm();
                }}
                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-cream-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">项目名称 *</label>
                <input
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="给项目起个名字"
                  className="w-full px-3 py-2 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">项目描述</label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="描述一下这个项目..."
                  rows={3}
                  className="w-full px-3 py-2 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">关联图解</label>
                <select
                  value={newProjectPatternId}
                  onChange={(e) => setNewProjectPatternId(e.target.value)}
                  className="w-full px-3 py-2 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">不关联图解</option>
                  {mockPatterns.map((pattern) => (
                    <option key={pattern.id} value={pattern.id}>
                      {pattern.title} - {pattern.author.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">目标完成日期</label>
                <input
                  type="date"
                  value={newProjectTargetDate}
                  onChange={(e) => setNewProjectTargetDate(e.target.value)}
                  className="w-full px-3 py-2 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">初始状态</label>
                <select
                  value={newProjectStatus}
                  onChange={(e) => setNewProjectStatus(e.target.value as Project['status'])}
                  className="w-full px-3 py-2 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="planning">计划中</option>
                  <option value="in_progress">编织中</option>
                  <option value="paused">已暂停</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-cream-200 flex gap-3">
              <button
                onClick={() => {
                  setShowNewProjectModal(false);
                  resetNewProjectForm();
                }}
                className="flex-1 py-2 bg-cream-200 text-stone-600 rounded-xl hover:bg-cream-300 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProjectTitle.trim()}
                className="flex-1 py-2 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-cream-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-stone-800">编辑项目</h2>
              <button
                onClick={() => setEditingProject(null)}
                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-cream-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">项目名称</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-3 py-2 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">项目描述</label>
                <textarea
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">状态</label>
                <select
                  value={editingProject.status}
                  onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as Project['status'] })}
                  className="w-full px-3 py-2 border border-cream-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="planning">计划中</option>
                  <option value="in_progress">编织中</option>
                  <option value="paused">已暂停</option>
                  <option value="completed">已完成</option>
                  <option value="abandoned">已放弃</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-cream-200 flex gap-3">
              <button
                onClick={() => setEditingProject(null)}
                className="flex-1 py-2 bg-cream-200 text-stone-600 rounded-xl hover:bg-cream-300 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleUpdateProject(editingProject)}
                className="flex-1 py-2 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
