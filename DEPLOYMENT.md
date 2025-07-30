# 穿云箭GH 部署指南

## 📋 部署前准备

### 1. 环境要求
- Node.js 18.0+ 
- MySQL 8.0+
- Git
- 域名（可选，推荐）

### 2. 数据库准备
确保您的MySQL数据库已经创建并可以连接：
\`\`\`sql
-- 数据库连接信息
Server: api.archxy.com
Database: api_chuanyunjian
Username: api_chuanyunjian
Password: mKksdketErLf8njF
SSL: Required
\`\`\`

## 🚀 方式一：Vercel部署（推荐）

### 步骤1：准备代码
\`\`\`bash
# 克隆项目
git clone <your-repo-url>
cd chuanyunjian-redesign

# 安装依赖
npm install
\`\`\`

### 步骤2：配置环境变量
在项目根目录创建 `.env.local` 文件：
\`\`\`env
# JWT密钥（请生成一个强密码）
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# 数据库连接（已配置）
DB_HOST=api.archxy.com
DB_DATABASE=api_chuanyunjian
DB_USER=api_chuanyunjian
DB_PASSWORD=mKksdketErLf8njF

# 应用配置
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
\`\`\`

### 步骤3：本地测试
\`\`\`bash
# 开发模式测试
npm run dev

# 访问 http://localhost:3000 测试功能
# 访问 http://localhost:3000/api/init-db 初始化数据库
\`\`\`

### 步骤4：部署到Vercel
\`\`\`bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 部署
vercel

# 按提示配置：
# ? Set up and deploy "~/chuanyunjian-redesign"? [Y/n] y
# ? Which scope do you want to deploy to? [选择您的账户]
# ? Link to existing project? [N/y] n
# ? What's your project's name? chuanyunjian-gh
# ? In which directory is your code located? ./
\`\`\`

### 步骤5：配置Vercel环境变量
在Vercel Dashboard中：
1. 进入项目设置 → Environment Variables
2. 添加以下变量：
\`\`\`
JWT_SECRET = your-super-secret-jwt-key-here-make-it-long-and-random
NEXT_PUBLIC_APP_URL = https://your-vercel-app.vercel.app
\`\`\`

### 步骤6：重新部署
\`\`\`bash
vercel --prod
\`\`\`

## 🖥️ 方式二：自托管服务器部署

### 步骤1：服务器准备
\`\`\`bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装PM2（进程管理器）
sudo npm install -g pm2

# 安装Nginx
sudo apt install nginx -y
\`\`\`

### 步骤2：部署应用
\`\`\`bash
# 克隆代码
git clone <your-repo-url>
cd chuanyunjian-redesign

# 安装依赖
npm install

# 构建应用
npm run build

# 创建环境变量文件
nano .env.local
# 添加上述环境变量内容
\`\`\`

### 步骤3：配置PM2
创建 `ecosystem.config.js`：
\`\`\`javascript
module.exports = {
  apps: [{
    name: 'chuanyunjian-gh',
    script: 'npm',
    args: 'start',
    cwd: '/path/to/chuanyunjian-redesign',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
\`\`\`

启动应用：
\`\`\`bash
# 创建日志目录
mkdir logs

# 启动应用
pm2 start ecosystem.config.js

# 设置开机自启
pm2 startup
pm2 save
\`\`\`

### 步骤4：配置Nginx
创建Nginx配置文件：
\`\`\`bash
sudo nano /etc/nginx/sites-available/chuanyunjian-gh
\`\`\`

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
