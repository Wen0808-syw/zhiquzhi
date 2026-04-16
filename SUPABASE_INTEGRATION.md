# 织趣织 - Supabase 后端集成方案

## 概述

本文档描述如何将织趣织从纯前端应用升级为完整的后端应用，使用 Supabase 作为 Backend-as-a-Service 解决方案。

## 为什么选择 Supabase？

- ✅ 开源，免费额度充足
- ✅ 支持 PostgreSQL 数据库
- ✅ 内置认证系统
- ✅ 实时订阅功能
- ✅ 存储服务（图片、视频）
- ✅ Row Level Security (RLS) 数据安全

## 数据库设计

### 表结构

```sql
-- 用户资料表
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique,
  display_name text,
  avatar text,
  bio text,
  level integer default 1,
  title text default '新手织女',
  points integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 图解表
create table patterns (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  cover_image text,
  difficulty integer check (difficulty between 1 and 5),
  category text,
  tags text[],
  tools text[],
  gauge_stitches_per_10cm integer,
  gauge_rows_per_10cm integer,
  gauge_needle_size text,
  likes_count integer default 0,
  saves_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 项目表
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  cover_image text,
  pattern_id uuid references patterns(id) on delete set null,
  status text default 'planning' check (status in ('planning', 'in_progress', 'paused', 'completed', 'abandoned')),
  progress integer default 0 check (progress between 0 and 100),
  start_date date,
  target_date date,
  completed_date date,
  total_time decimal(10,2) default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 编织日志表
create table journal_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  content text,
  mood text,
  stitches text,
  progress integer,
  images text[],
  journal_date date,
  created_at timestamp with time zone default now()
);

-- 帖子表
create table posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id) on delete cascade,
  title text not null,
  content text,
  category text,
  tags text[],
  type text,
  images text[],
  likes_count integer default 0,
  views_count integer default 0,
  is_resolved boolean default false,
  linked_project_id uuid references projects(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 评论表
create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  author_id uuid references profiles(id) on delete cascade,
  content text not null,
  likes_count integer default 0,
  is_answer boolean default false,
  created_at timestamp with time zone default now()
);

-- 活动表
create table activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_image text,
  type text,
  start_date date,
  end_date date,
  prizes text[],
  status text default 'upcoming' check (status in ('upcoming', 'active', 'ended')),
  participant_count integer default 0,
  created_at timestamp with time zone default now()
);

-- 活动参与表
create table activity_participants (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid references activities(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  joined_at timestamp with time zone default now(),
  unique(activity_id, user_id)
);

-- 用户徽章表
create table user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  badge_name text,
  badge_icon text,
  badge_description text,
  rarity text check (rarity in ('common', 'rare', 'epic', 'legendary')),
  earned_at timestamp with time zone default now(),
  unique(user_id, badge_name)
);

-- 用户关注表
create table follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid references profiles(id) on delete cascade,
  following_id uuid references profiles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(follower_id, following_id)
);

-- 用户喜欢/收藏表
create table likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  target_type text not null check (target_type in ('pattern', 'post', 'comment')),
  target_id uuid not null,
  created_at timestamp with time zone default now(),
  unique(user_id, target_type, target_id)
);

create table saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  target_type text not null check (target_type in ('pattern', 'post', 'tutorial')),
  target_id uuid not null,
  created_at timestamp with time zone default now(),
  unique(user_id, target_type, target_id)
);

-- 线材表
create table yarns (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  series text,
  name text not null,
  color text,
  color_code text,
  composition text,
  weight_grams integer,
  yardage integer,
  suitable_needle text,
  price decimal(10,2),
  rating decimal(2,1),
  reviews_count integer default 0,
  image_url text,
  created_at timestamp with time zone default now()
);

-- 教程表
create table tutorials (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  cover_image text,
  difficulty integer check (difficulty between 1 and 5),
  type text,
  category text,
  tags text[],
  duration_minutes integer,
  likes_count integer default 0,
  saves_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 索引
create index idx_projects_user_id on projects(user_id);
create index idx_patterns_author_id on patterns(author_id);
create index idx_posts_author_id on posts(author_id);
create index idx_posts_created_at on posts(created_at desc);
create index idx_comments_post_id on comments(post_id);
create index idx_likes_user_id on likes(user_id);
create index idx_follows_follower_id on follows(follower_id);
create index idx_follows_following_id on follows(following_id);
```

### Row Level Security (RLS) 策略

```sql
-- 启用 RLS
alter table profiles enable row level security;
alter table projects enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;
alter table likes enable row level security;
alter table saves enable row level security;

-- profiles: 公开读取，个人资料只能本人修改
create policy "Profiles are viewable by everyone" on profiles
  for select using (true);

create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

-- projects: 公开读取，个人项目只能本人修改
create policy "Projects are viewable by everyone" on projects
  for select using (true);

create policy "Users can insert their own projects" on projects
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own projects" on projects
  for update using (auth.uid() = user_id);

create policy "Users can delete their own projects" on projects
  for delete using (auth.uid() = user_id);

-- posts: 公开读取，帖子只能作者修改
create policy "Posts are viewable by everyone" on posts
  for select using (true);

create policy "Users can insert their own posts" on posts
  for insert with check (auth.uid() = author_id);

create policy "Users can update their own posts" on posts
  for update using (auth.uid() = author_id);

create policy "Users can delete their own posts" on posts
  for delete using (auth.uid() = author_id);

-- likes: 只能看到自己的点赞
create policy "Users can view their own likes" on likes
  for select using (auth.uid() = user_id);

create policy "Users can like" on likes
  for insert with check (auth.uid() = user_id);

create policy "Users can unlike" on likes
  for delete using (auth.uid() = user_id);

-- follows: 只能看到自己的关注
create policy "Users can view their own follows" on follows
  for select using (auth.uid() = follower_id);

create policy "Users can follow" on follows
  for insert with check (auth.uid() = follower_id);

create policy "Users can unfollow" on follows
  for delete using (auth.uid() = follower_id);
```

## 前端集成

### 1. 安装 Supabase 客户端

```bash
npm install @supabase/supabase-js
```

### 2. 创建 Supabase 客户端

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 3. 认证流程

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取初始会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }
}
```

### 4. 数据操作示例

```typescript
// 获取项目列表
async function fetchProjects(userId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*, patterns(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// 创建项目
async function createProject(project: Partial<Project>) {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// 点赞/取消点赞
async function toggleLike(userId: string, targetType: string, targetId: string) {
  // 先检查是否已点赞
  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .single()

  if (existing) {
    // 取消点赞
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('id', existing.id)
    return { liked: false, error }
  } else {
    // 添加点赞
    const { error } = await supabase
      .from('likes')
      .insert({ user_id: userId, target_type: targetType, target_id: targetId })
    return { liked: true, error }
  }
}
```

### 5. 实时订阅

```typescript
// 监听帖子更新
function subscribeToPosts(callback: (post: Post) => void) {
  const subscription = supabase
    .channel('posts')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'posts'
    }, (payload) => {
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        callback(payload.new as Post)
      }
    })
    .subscribe()

  return () => subscription.unsubscribe()
}
```

## 存储服务（图片上传）

```typescript
// 上传图片
async function uploadImage(userId: string, file: File) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, file)

  if (error) throw error

  // 获取公开 URL
  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(data.path)

  return publicUrl
}
```

## 环境变量配置

```bash
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 部署步骤

1. 在 [supabase.com](https://supabase.com) 创建项目
2. 在 SQL Editor 中运行上方的数据库 schema
3. 复制项目 URL 和 anon key 到环境变量
4. 配置存储桶（images 桶，设置为公开）
5. 部署前端到 Vercel/Netlify

## 成本估算

| 服务 | 免费额度 | 超出后价格 |
|------|---------|-----------|
| 数据库 | 500MB | $0.016/GB/小时 |
| 认证 | 50K 月活用户 | 免费 |
| 存储 | 1GB | $0.021/GB |
| 传输 | 2GB | $0.09/GB |

对于个人项目或小型社区，免费额度通常足够。

## 后续扩展建议

1. **搜索功能**：使用 Supabase 的全文搜索或集成 Algolia
2. **推送通知**：使用 Supabase Edge Functions + Web Push
3. **支付功能**：集成 Stripe（付费徽章、捐赠等）
4. **AI 功能**：集成 OpenAI API（智能图解推荐）

---

如需进一步帮助，请联系开发团队。
