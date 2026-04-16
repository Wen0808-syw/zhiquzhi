import { Link, useLocation } from 'react-router-dom'
import { Home, Wrench, FolderKanban, Users, BookOpen, User, Menu, X, Bell, Search } from 'lucide-react'
import { cn } from '@/utils/cn'

interface LayoutProps {
  children: React.ReactNode
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/tools', label: '编织工具', icon: Wrench },
  { path: '/projects', label: '我的项目', icon: FolderKanban },
  { path: '/community', label: '社区', icon: Users },
  { path: '/resources', label: '资源库', icon: BookOpen },
  { path: '/profile', label: '个人中心', icon: User },
]

export function Layout({ children, mobileMenuOpen, setMobileMenuOpen }: LayoutProps) {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-knitting-cream">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-brand-100 z-40">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          {/* Left: Logo & Mobile Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-brand-50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-brand-600" /> : <Menu className="w-6 h-6 text-brand-600" />}
            </button>
            
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-brand-600">
              <span className="text-2xl">🧶</span>
              <span className="hidden sm:inline">织趣织</span>
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索编织图案、教程..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-brand-50 border border-brand-100 
                         focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                         placeholder:text-gray-400 text-sm"
              />
            </div>
          </div>

          {/* Right: Notifications & User */}
          <div className="flex items-center gap-3">
            <button
              className="relative p-2 rounded-lg hover:bg-brand-50 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            
            <button className="w-9 h-9 rounded-full bg-brand-500 text-white flex items-center justify-center font-medium text-sm">
              用户
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar (visible on mobile) */}
      <div className="lg:hidden fixed top-16 left-0 right-0 h-14 bg-white border-b border-brand-100 z-30 px-4 flex items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-brand-50 border border-brand-100 
                     focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                     placeholder:text-gray-400 text-sm"
          />
        </div>
      </div>

      {/* Sidebar Navigation */}
      <>
        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed top-16 left-0 h-[calc(100vh-4rem)] w-60 bg-[#FFF8F0] z-50 transition-transform duration-300 border-r border-orange-100',
            'hidden lg:block lg:translate-x-0',
            mobileMenuOpen ? 'block translate-x-0' : 'hidden'
          )}
        >
          <nav className="flex flex-col h-full pt-4">
            <div className="px-4 py-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">导航</p>
            </div>
            
            <ul className="flex-1 px-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                        active
                          ? 'bg-brand-50 text-brand-600 font-medium'
                          : 'text-gray-600 hover:bg-brand-100 hover:text-brand-700'
                      )}
                    >
                      <Icon className={cn('w-5 h-5', active ? 'text-brand-600' : 'text-gray-400')} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-brand-100">
              <div className="text-xs text-gray-400 text-center">
                织趣织 v1.0.0
              </div>
            </div>
          </nav>
        </aside>
      </>

      {/* Main Content Area */}
      <main className="pt-16 lg:pt-16 lg:pl-60 min-h-screen">
        {/* Mobile content offset for search bar */}
        <div className="md:hidden h-14" />
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
