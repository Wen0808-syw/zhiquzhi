# 织趣织 - 部署指南

## 快速部署

### 方式一：Vercel（推荐，最快）

1. 安装 Vercel CLI：
```bash
npm i -g vercel
```

2. 在项目目录执行：
```bash
cd zhiquzhi
vercel
```

3. 按照提示完成部署

**或使用 GitHub 集成：**
- 将代码推送到 GitHub 仓库
- 访问 [vercel.com](https://vercel.com)
- 点击 "Import Project"
- 选择仓库即可自动部署

### 方式二：Netlify

1. 安装 Netlify CLI：
```bash
npm i -g netlify-cli
```

2. 在项目目录执行：
```bash
cd zhiquzhi
netlify deploy --prod
```

**或使用 GitHub 集成：**
- 将代码推送到 GitHub 仓库
- 访问 [netlify.com](https://netlify.com)
- 点击 "Add new site" → "Import an existing project"
- 选择仓库，配置文件 `netlify.toml` 会自动被识别

### 方式三：传统服务器

1. 构建项目：
```bash
cd zhiquzhi
npm install
npm run build
```

2. 将 `dist` 目录部署到服务器
3. 配置 Web 服务器（参考下方 Nginx 配置）

## 静态部署配置

### Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/zhiquzhi/dist;
    index index.html;

    # 开启 gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 安全头
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### Apache 配置 (.htaccess)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# 安全头
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "DENY"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>

# 缓存
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

## 环境变量

复制 `.env.example` 为 `.env.local` 并配置：

```bash
cp .env.example .env.local
```

常用变量：
- `VITE_APP_TITLE` - 应用标题
- `VITE_SUPABASE_URL` - Supabase 项目地址（需要后端时）
- `VITE_SUPABASE_ANON_KEY` - Supabase 匿名密钥（需要后端时）

## 中国大陆部署（需要 ICP 备案）

### 方案一：阿里云/腾讯云 + OSS/CDN

1. 构建项目：`npm run build`
2. 上传 `dist` 目录到 OSS
3. 配置 CDN 和域名
4. 需要完成 ICP 备案

### 方案二：腾讯云静态网站托管

1. 访问腾讯云控制台
2. 选择 "静态网站托管"
3. 上传 `dist` 目录内容

## 后续扩展

### 添加后端（Supabase）

1. 在 [supabase.com](https://supabase.com) 创建项目
2. 复制 `.env.example` 中的 Supabase 配置
3. 创建数据库表（参考下方 SQL）
4. 更新前端代码使用真实 API

```sql
-- 示例：用户表
create table profiles (
  id uuid references auth.users primary key,
  username text unique,
  avatar text,
  level integer default 1,
  title text,
  bio text,
  created_at timestamp with time zone default now()
);

-- 示例：项目表
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  title text not null,
  description text,
  status text default 'planning',
  progress integer default 0,
  created_at timestamp with time zone default now()
);
```

## 常见问题

**Q: 刷新页面 404？**
A: 确保 Web 服务器配置了 SPA 路由支持，参考上方的 Nginx/Apache 配置。

**Q: 部署后样式错乱？**
A: 清除浏览器缓存，或检查是否有缓存配置问题。

**Q: 如何自定义域名？**
A: Vercel/Netlify 后台都有域名配置选项，按提示添加 CNAME 记录即可。

---

如有其他问题，请联系技术支持。
