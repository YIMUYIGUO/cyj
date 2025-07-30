# 穿云箭GH - 宝塔面板部署指南

## 📋 部署前准备

### 1. 服务器要求
- **操作系统**：CentOS 7+/Ubuntu 18+/Debian 9+
- **内存**：至少 1GB RAM（推荐 2GB+）
- **硬盘**：至少 10GB 可用空间
- **网络**：公网IP，开放 80、443、8888 端口

### 2. 宝塔面板安装
如果还未安装宝塔面板，请先安装：

#### CentOS安装命令：
\`\`\`bash
yum install -y wget && wget -O install.sh https://download.bt.cn/install/install_6.0.sh && sh install.sh ed8484bec
\`\`\`

#### Ubuntu/Debian安装命令：
\`\`\`bash
wget -O install.sh https://download.bt.cn/install/install-ubuntu_6.0.sh && sudo bash install.sh ed8484bec
\`\`\`

安装完成后记录：
- 面板地址：http://your-server-ip:8888
- 用户名和密码

## 🚀 宝塔面板部署步骤

### 步骤1：登录宝塔面板并安装软件

1. **登录宝塔面板**
   - 访问：`http://your-server-ip:8888`
   - 输入用户名和密码

2. **安装必要软件**
   进入 `软件商店`，安装以下软件：
   - ✅ **Nginx** 1.20+
   - ✅ **Node.js版本管理器** 
   - ✅ **PM2管理器** 4.0+
   - ✅ **宝塔SSH终端**（可选，方便命令行操作）

### 步骤2：配置Node.js环境

1. **安装Node.js**
   - 进入 `软件商店` → `运行环境`
   - 找到 `Node.js版本管理器`，点击 `设置`
   - 安装 `Node.js 18.x` 版本
   - 设置为默认版本

2. **验证安装**
   在 `SSH终端` 中执行：
   \`\`\`bash
   node -v  # 应显示 v18.x.x
   npm -v   # 应显示 npm 版本
   \`\`\`

### 步骤3：创建网站和上传代码

1. **创建网站**
   - 进入 `网站` → `添加站点`
   - 域名：填入您的域名（如：chuanyunjian.com）
   - 根目录：`/www/wwwroot/chuanyunjian-gh`
   - PHP版本：选择 `纯静态`
   - 点击 `提交`

2. **上传项目代码**
   
   **方法一：使用Git（推荐）**
   在SSH终端中执行：
   \`\`\`bash
   cd /www/wwwroot
   git clone https://github.com/your-username/chuanyunjian-redesign.git chuanyunjian-gh
   cd chuanyunjian-gh
   \`\`\`

   **方法二：文件上传**
   - 将项目打包为 `.zip` 文件
   - 在宝塔 `文件` 管理中上传到 `/www/wwwroot/chuanyunjian-gh`
   - 解压文件

### 步骤4：配置项目环境

1. **安装项目依赖**
   在SSH终端中执行：
   \`\`\`bash
   cd /www/wwwroot/chuanyunjian-gh
   npm install
   \`\`\`

2. **创建环境变量文件**
   在宝塔文件管理中，进入项目目录，创建 `.env.local` 文件：
   \`\`\`env
   # JWT密钥（请生成一个强密码）
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random-32-chars-minimum
   
   # 应用配置
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   NODE_ENV=production
   PORT=3000
   
   # 数据库连接（已配置）
   DB_HOST=api.archxy.com
   DB_DATABASE=api_chuanyunjian
   DB_USER=api_chuanyunjian
   DB_PASSWORD=mKksdketErLf8njF
   \`\`\`

3. **构建项目**
   \`\`\`bash
   cd /www/wwwroot/chuanyunjian-gh
   npm run build
   \`\`\`

### 步骤5：配置PM2进程管理

1. **创建PM2配置文件**
   在项目根目录创建 `ecosystem.config.js`：
   \`\`\`javascript
   module.exports = {
     apps: [{
       name: 'chuanyunjian-gh',
       script: 'npm',
       args: 'start',
       cwd: '/www/wwwroot/chuanyunjian-gh',
       instances: 1,
       autorestart: true,
       watch: false,
       max_memory_restart: '1G',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       },
       error_file: '/www/wwwroot/chuanyunjian-gh/logs/err.log',
       out_file: '/www/wwwroot/chuanyunjian-gh/logs/out.log',
       log_file: '/www/wwwroot/chuanyunjian-gh/logs/combined.log',
       time: true
     }]
   }
   \`\`\`

2. **创建日志目录**
   \`\`\`bash
   mkdir -p /www/wwwroot/chuanyunjian-gh/logs
   \`\`\`

3. **启动应用**
   \`\`\`bash
   cd /www/wwwroot/chuanyunjian-gh
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   \`\`\`

4. **在宝塔PM2管理器中查看**
   - 进入 `软件商店` → `PM2管理器` → `设置`
   - 应该能看到 `chuanyunjian-gh` 应用正在运行

### 步骤6：配置Nginx反向代理

1. **修改网站配置**
   - 进入 `网站` → 找到您的站点 → `设置`
   - 点击 `配置文件`
   - 替换配置内容：

\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # HTTP重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL证书配置（稍后配置）
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
    
    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # API限流
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
    
    # 静态文件缓存
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API接口限流
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
    
    # 主应用代理
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
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 错误页面
    error_page 502 503 504 /50x.html;
    location = /50x.html {
        root /www/server/nginx/html;
    }
    
    # 访问日志
    access_log /www/wwwlogs/your-domain.com.log;
    error_log /www/wwwlogs/your-domain.com.error.log;
}
\`\`\`

2. **重载Nginx配置**
   点击 `保存` 后，Nginx会自动重载配置

### 步骤7：配置SSL证书

1. **申请Let's Encrypt免费证书**
   - 在网站设置中，点击 `SSL`
   - 选择 `Let's Encrypt`
   - 填入域名：`your-domain.com,www.your-domain.com`
   - 点击 `申请`
   - 开启 `强制HTTPS`

2. **或上传自有证书**
   - 选择 `其他证书`
   - 粘贴证书内容和私钥
   - 点击 `保存`

### 步骤8：初始化数据库

1. **访问初始化接口**
   在浏览器中访问：`https://your-domain.com/api/init-db`
   
2. **验证数据库连接**
   检查是否返回成功信息

### 步骤9：配置防火墙和安全

1. **配置宝塔防火墙**
   - 进入 `安全` → `防火墙`
   - 确保开放端口：80、443、8888
   - 可以关闭 3000 端口（因为通过Nginx代理）

2. **配置系统防火墙**
   \`\`\`bash
   # CentOS/RHEL
   firewall-cmd --permanent --add-port=80/tcp
   firewall-cmd --permanent --add-port=443/tcp
   firewall-cmd --permanent --add-port=8888/tcp
   firewall-cmd --reload
   
   # Ubuntu/Debian
   ufw allow 80
   ufw allow 443
   ufw allow 8888
   ufw enable
   \`\`\`

## 🔧 宝塔面板管理功能

### 1. 进程监控
- **PM2管理器**：查看应用状态、重启、查看日志
- **系统监控**：CPU、内存、磁盘使用情况
- **网站监控**：访问统计、错误日志

### 2. 文件管理
- **在线编辑**：直接编辑配置文件
- **文件上传**：拖拽上传文件
- **权限管理**：设置文件权限

### 3. 数据库管理
- **phpMyAdmin**：图形化数据库管理
- **数据库备份**：定时备份数据库
- **性能监控**：查看数据库性能

### 4. 日志管理
- **访问日志**：`/www/wwwlogs/your-domain.com.log`
- **错误日志**：`/www/wwwlogs/your-domain.com.error.log`
- **应用日志**：`/www/wwwroot/chuanyunjian-gh/logs/`

## 📊 部署后配置

### 1. 创建管理员账户
\`\`\`bash
# 连接数据库
mysql -h api.archxy.com -u api_chuanyunjian -p api_chuanyunjian

# 创建管理员（密码需要先用bcrypt加密）
INSERT INTO users (username, email, password_hash, is_admin) 
VALUES ('admin', 'admin@yourdomain.com', '$2a$12$your_hashed_password_here', true);
\`\`\`

### 2. 设置定时任务
在宝塔 `计划任务` 中添加：

**数据库备份**（每天凌晨2点）：
\`\`\`bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/www/backup/mysql"
mkdir -p $BACKUP_DIR
mysqldump -h api.archxy.com -u api_chuanyunjian -p'mKksdketErLf8njF' api_chuanyunjian > $BACKUP_DIR/backup_$DATE.sql
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
\`\`\`

**应用健康检查**（每5分钟）：
\`\`\`bash
#!/bin/bash
if ! curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    pm2 restart chuanyunjian-gh
    echo "$(date): 应用重启" >> /www/wwwroot/chuanyunjian-gh/logs/health.log
fi
\`\`\`

### 3. 性能优化
在宝塔面板中：
- **开启Nginx缓存**：网站设置 → 性能优化
- **开启Gzip压缩**：已在配置中启用
- **设置浏览器缓存**：静态资源缓存1年

## 🔄 更新部署流程

### 自动更新脚本
创建 `/www/wwwroot/chuanyunjian-gh/update.sh`：
\`\`\`bash
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
\`\`\`

\`\`\`bash
chmod +x /www/wwwroot/chuanyunjian-gh/update.sh
\`\`\`

## 🆘 故障排除

### 常见问题及解决方案

1. **应用无法启动**
   \`\`\`bash
   # 查看PM2日志
   pm2 logs chuanyunjian-gh
   
   # 检查端口占用
   netstat -tlnp | grep :3000
   \`\`\`

2. **数据库连接失败**
   - 检查网络连接
   - 验证数据库凭据
   - 确认SSL连接

3. **Nginx配置错误**
   \`\`\`bash
   # 测试配置
   nginx -t
   
   # 重载配置
   nginx -s reload
   \`\`\`

4. **SSL证书问题**
   - 检查域名解析
   - 重新申请证书
   - 验证证书有效期

### 监控命令
\`\`\`bash
# 查看应用状态
pm2 status

# 查看系统资源
htop
df -h
free -h

# 查看Nginx状态
systemctl status nginx

# 查看访问日志
tail -f /www/wwwlogs/your-domain.com.log
\`\`\`

## 🎉 部署完成检查

部署完成后，请检查以下项目：

- ✅ 网站可以正常访问：`https://your-domain.com`
- ✅ SSL证书有效且强制HTTPS
- ✅ 用户注册登录功能正常
- ✅ API接口响应正常
- ✅ 管理后台可以访问
- ✅ 数据库连接正常
- ✅ PM2进程管理正常
- ✅ 日志记录正常
- ✅ 防火墙配置正确
- ✅ 定时任务设置完成

恭喜！您的穿云箭GH应用已成功部署到宝塔面板！
