#!/bin/bash

# 穿云箭GH - 宝塔面板自动部署脚本
# 使用方法: ./baota-deploy.sh

set -e

PROJECT_NAME="chuanyunjian-gh"
PROJECT_DIR="/www/wwwroot/$PROJECT_NAME"
BACKUP_DIR="/www/backup"
LOG_FILE="/www/wwwlogs/deploy.log"

echo "🚀 开始部署穿云箭GH到宝塔面板..." | tee -a $LOG_FILE

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用root用户运行此脚本" | tee -a $LOG_FILE
    exit 1
fi

# 检查宝塔面板是否安装
if [ ! -f "/www/server/panel/BT-Panel" ]; then
    echo "❌ 未检测到宝塔面板，请先安装宝塔面板" | tee -a $LOG_FILE
    exit 1
fi

# 创建必要目录
mkdir -p $BACKUP_DIR
mkdir -p /www/wwwlogs

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "📦 安装Node.js..." | tee -a $LOG_FILE
    curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
    yum install -y nodejs
fi

# 检查PM2是否安装
if ! command -v pm2 &> /dev/null; then
    echo "📦 安装PM2..." | tee -a $LOG_FILE
    npm install -g pm2
fi

# 备份现有项目（如果存在）
if [ -d "$PROJECT_DIR" ]; then
    echo "💾 备份现有项目..." | tee -a $LOG_FILE
    tar -czf "$BACKUP_DIR/backup-$(date +%Y%m%d_%H%M%S).tar.gz" -C /www/wwwroot $PROJECT_NAME
fi

# 创建项目目录
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# 克隆或更新代码
if [ -d ".git" ]; then
    echo "🔄 更新代码..." | tee -a $LOG_FILE
    git pull origin main
else
    echo "📥 克隆代码..." | tee -a $LOG_FILE
    git clone https://github.com/your-username/chuanyunjian-redesign.git .
fi

# 安装依赖
echo "📦 安装依赖..." | tee -a $LOG_FILE
npm install

# 创建环境变量文件
if [ ! -f ".env.local" ]; then
    echo "⚙️ 创建环境变量文件..." | tee -a $LOG_FILE
    cat > .env.local << EOF
# JWT密钥（请修改为您自己的密钥）
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random-32-chars-minimum

# 应用配置
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
PORT=3000

# 数据库连接
DB_HOST=api.archxy.com
DB_DATABASE=api_chuanyunjian
DB_USER=api_chuanyunjian
DB_PASSWORD=mKksdketErLf8njF
EOF
    echo "⚠️  请编辑 .env.local 文件，修改JWT_SECRET和域名配置" | tee -a $LOG_FILE
fi

# 构建项目
echo "🔨 构建项目..." | tee -a $LOG_FILE
npm run build

# 创建PM2配置文件
echo "⚙️ 创建PM2配置..." | tee -a $LOG_FILE
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$PROJECT_NAME',
    script: 'npm',
    args: 'start',
    cwd: '$PROJECT_DIR',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '$PROJECT_DIR/logs/err.log',
    out_file: '$PROJECT_DIR/logs/out.log',
    log_file: '$PROJECT_DIR/logs/combined.log',
    time: true
  }]
}
EOF

# 创建日志目录
mkdir -p logs

# 停止现有进程（如果存在）
pm2 delete $PROJECT_NAME 2>/dev/null || true

# 启动应用
echo "🚀 启动应用..." | tee -a $LOG_FILE
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 创建Nginx配置
echo "🌐 创建Nginx配置..." | tee -a $LOG_FILE
NGINX_CONF="/www/server/panel/vhost/nginx/$PROJECT_NAME.conf"
cat > $NGINX_CONF << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL配置（需要在宝塔面板中配置证书）
    ssl_certificate /www/server/panel/vhost/cert/your-domain.com/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_ciphers EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # 安全头部
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # 限流配置
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
    
    # 静态文件缓存
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API接口
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 登录接口特殊限流
    location /api/auth/login {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 主应用
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 日志配置
    access_log /www/wwwlogs/your-domain.com.log;
    error_log /www/wwwlogs/your-domain.com.error.log;
}
EOF

echo "⚠️  请在宝塔面板中修改域名配置和SSL证书设置" | tee -a $LOG_FILE

# 重载Nginx
nginx -t && nginx -s reload

# 创建更新脚本
echo "📝 创建更新脚本..." | tee -a $LOG_FILE
cat > update.sh << 'EOF'
#!/bin/bash
cd /www/wwwroot/chuanyunjian-gh

echo "开始更新应用..."

# 备份当前版本
tar -czf "/www/backup/app-backup-$(date +%Y%m%d_%H%M%S).tar.gz" .

# 拉取最新代码
git pull origin main

# 安装依赖
npm install

# 构建应用
npm run build

# 重启应用
pm2 restart chuanyunjian-gh

echo "更新完成！"
EOF

chmod +x update.sh

# 创建健康检查脚本
echo "🏥 创建健康检查脚本..." | tee -a $LOG_FILE
cat > health-check.sh << 'EOF'
#!/bin/bash
if ! curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "$(date): 应用无响应，正在重启..." >> /www/wwwroot/chuanyunjian-gh/logs/health.log
    pm2 restart chuanyunjian-gh
fi
EOF

chmod +x health-check.sh

# 设置文件权限
chown -R www:www $PROJECT_DIR
chmod -R 755 $PROJECT_DIR

# 等待应用启动
echo "⏳ 等待应用启动..." | tee -a $LOG_FILE
sleep 10

# 健康检查
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ 应用部署成功！" | tee -a $LOG_FILE
    echo "🌐 请访问: http://your-server-ip:3000" | tee -a $LOG_FILE
    echo "📋 PM2状态:" | tee -a $LOG_FILE
    pm2 status
else
    echo "❌ 应用启动失败，请检查日志:" | tee -a $LOG_FILE
    pm2 logs $PROJECT_NAME --lines 20
fi

echo "📚 部署完成！请按照以下步骤完成配置:" | tee -a $LOG_FILE
echo "1. 编辑 $PROJECT_DIR/.env.local 文件，设置正确的JWT_SECRET和域名" | tee -a $LOG_FILE
echo "2. 在宝塔面板中配置域名和SSL证书" | tee -a $LOG_FILE
echo "3. 访问 https://your-domain.com/api/init-db 初始化数据库" | tee -a $LOG_FILE
echo "4. 设置定时任务进行健康检查和备份" | tee -a $LOG_FILE
