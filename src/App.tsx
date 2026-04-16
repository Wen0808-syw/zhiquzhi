import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { ToolsPage } from '@/pages/ToolsPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { CommunityPage } from '@/pages/CommunityPage';
import { ResourcePage } from '@/pages/ResourcePage';
import { ProfilePage } from '@/pages/ProfilePage';
import { PatternsPage } from '@/pages/PatternsPage';
import { ActivitiesPage } from '@/pages/ActivitiesPage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { UserProfilePage } from '@/pages/UserProfilePage';
import { AboutPage, HelpPage, PrivacyPage, ContactPage } from '@/pages/StaticPages';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Set page title
    document.title = '织趣织 - 编织爱好者社区平台';
  }, []);

  return (
    <Router>
      <Layout mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/tools/chart" element={<ToolsPage />} />
          <Route path="/tools/calculator" element={<ToolsPage />} />
          <Route path="/tools/materials" element={<ToolsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectsPage />} />
          <Route path="/projects/new" element={<ProjectsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/post/:id" element={<CommunityPage />} />
          <Route path="/community/new" element={<CommunityPage />} />
          <Route path="/community/activity/:id" element={<CommunityPage />} />
          <Route path="/resources" element={<ResourcePage />} />
          <Route path="/resources/patterns" element={<ResourcePage />} />
          <Route path="/resources/tutorials" element={<ResourcePage />} />
          <Route path="/resources/yarns" element={<ResourcePage />} />
          <Route path="/patterns" element={<PatternsPage />} />
          <Route path="/patterns/:id" element={<PatternsPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/activities/:id" element={<ActivitiesPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/users/:id" element={<UserProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          {/* Static Pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* Catch-all for 404 */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="text-6xl mb-4">🧶</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">页面不存在</h1>
                <p className="text-gray-500 mb-4">抱歉，您访问的页面不存在</p>
                <a href="/" className="text-brand-600 hover:underline">返回首页</a>
              </div>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
