import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Heart, Users, BookOpen, Star } from 'lucide-react';

// ============== About Page ==============
export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-5 h-5" />
          返回首页
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🧶</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">关于织趣织</h1>
          <p className="text-gray-500">让每一针每一线，都成为温暖的回忆</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-8">
          {/* Mission */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">我们的使命</h2>
            <p className="text-gray-600 leading-relaxed">
              织趣织是一个专为编织爱好者打造的社区平台。我们相信，编织不仅是一种技艺，更是一种生活方式，
              一种让生活变得更有温度的方式。在这里，无论你是编织新手还是资深织女，都能找到属于自己的编织乐趣。
            </p>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">平台特色</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-brand-50 rounded-xl">
                <BookOpen className="w-8 h-8 text-brand-500 mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">丰富图解库</h3>
                <p className="text-sm text-gray-500">涵盖各种难度的编织图解，从入门到大师级</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-xl">
                <Users className="w-8 h-8 text-rose-500 mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">活跃社区</h3>
                <p className="text-sm text-gray-500">与志同道合的织女们分享、交流、成长</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl">
                <Star className="w-8 h-8 text-amber-500 mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">创作工具</h3>
                <p className="text-sm text-gray-500">实用的编织计算器和图解处理工具</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <Heart className="w-8 h-8 text-green-500 mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">精彩活动</h3>
                <p className="text-sm text-gray-500">定期举办的编织活动，赢取专属奖励</p>
              </div>
            </div>
          </section>

          {/* Team */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">创始团队</h2>
            <p className="text-gray-600 leading-relaxed">
              织趣织由一群热爱编织的开发者创立。我们中有编织多年的资深织女，
              也有热爱技术的程序员。我们希望通过技术与传统的结合，
              让编织这项美好的技艺被更多人了解和喜爱。
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">联系我们</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5 text-brand-500" />
                <span>contact@zhiquzhi.com</span>
              </div>
              <p className="text-sm text-gray-400">
                如果您有任何问题或建议，欢迎通过邮件联系我们。
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>© 2026 织趣织 · 用爱编织，温暖生活</p>
        </div>
      </div>
    </div>
  );
};

// ============== Help Page ==============
export const HelpPage = () => {
  const faqs = [
    {
      q: '如何开始我的第一个编织项目？',
      a: '点击首页的"开始新项目"按钮，选择你喜欢的图解，然后按照图解步骤开始编织。你也可以使用我们的编织计算器来估算所需材料。',
    },
    {
      q: '如何发布帖子到社区？',
      a: '进入社区页面，点击右下角的"+ "按钮，你可以发布求助帖、教程、展示作品或发起讨论。',
    },
    {
      q: '如何获得徽章？',
      a: '完成特定成就即可获得徽章，例如完成第一个项目、连续编织一定天数等。徽章会在你达成成就时自动发放。',
    },
    {
      q: '图解中的编织密度是什么？',
      a: '编织密度指在特定针号下，10cm×10cm区域内有多少针和多少行。这是确保成品尺寸正确的重要参考。',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-5 h-5" />
          返回首页
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">帮助中心</h1>
          <p className="text-gray-500">常见问题解答</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="bg-white rounded-xl border border-gray-100 p-6 group">
              <summary className="font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                {faq.q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-8 p-6 bg-brand-50 rounded-xl text-center">
          <p className="text-gray-600 mb-2">还有其他问题？</p>
          <a href="mailto:help@zhiquzhi.com" className="text-brand-600 hover:underline">
            联系我们 →
          </a>
        </div>
      </div>
    </div>
  );
};

// ============== Privacy Page ==============
export const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-5 h-5" />
          返回首页
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">隐私政策</h1>
          <p className="text-gray-500">最后更新日期：2026年1月1日</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">信息收集</h2>
            <p className="text-gray-600 leading-relaxed">
              我们收集您在使用织趣织服务时主动提供的信息，包括但不限于：注册信息、个人资料、项目数据等。
              这些信息帮助我们更好地为您提供个性化的服务体验。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">信息使用</h2>
            <p className="text-gray-600 leading-relaxed">
              我们使用收集的信息来：提供、维护和改进我们的服务；处理您的请求和交易；
              向您发送与服务相关的信息；以及保护我们的合法权益。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">信息保护</h2>
            <p className="text-gray-600 leading-relaxed">
              我们采用行业标准的安全措施来保护您的个人信息。
              但是请注意，没有任何通过互联网传输的方法是完全安全的。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">联系我们</h2>
            <p className="text-gray-600 leading-relaxed">
              如果您对本隐私政策有任何疑问，请通过 privacy@zhiquzhi.com 与我们联系。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

// ============== Contact Page ==============
export const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-5 h-5" />
          返回首页
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">联系我们</h1>
          <p className="text-gray-500">我们很乐意听到您的声音</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">商务合作</h2>
              <p className="text-gray-600">business@zhiquzhi.com</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">客户服务</h2>
              <p className="text-gray-600">support@zhiquzhi.com</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">媒体采访</h2>
              <p className="text-gray-600">media@zhiquzhi.com</p>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-400">
                我们通常会在1-3个工作日内回复您的邮件。感谢您的耐心等待！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
