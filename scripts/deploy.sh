#!/bin/bash

# 穿云箭GH 自动部署脚本
# 使用方法: ./deploy.sh [production|staging]

set -e

ENVIRONMENT=${1:-production}
PROJECT_NAME="chuanyunjian-gh"
BACKUP_DIR="/backup"
LOG_FILE="/var/log/deploy.log"

echo "开始部署 $PROJECT_NAME 到 $ENVIRONMENT 环境..." | tee -a $LOG_FILE

# 检查环境
if [ "$ENVIRONMENT" != "production" ] && [ "$ENVIRONMENT" != "staging" ]; then
    echo "错误: 环境参数必须是 'production' 或 'staging'" | tee -a $LOG_FILE
    exit 1
fi

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份当前版本
if [ -d "/var/www/$PROJECT_NAME" ]; then
    echo "备份当前版本..." | tee -a $LOG_FILE
    tar -czf "$BACKUP_DIR/backup-$(date +%Y%m%d_%H%M%S).tar.gz" -C /var/www $PROJECT_NAME
fi

# 拉取最新代码
echo "拉取最新代码..." | tee -a $LOG_FILE
cd /var/www/$PROJECT_NAME
git pull origin main

# 安装依赖
echo "安装依赖..." | tee -a $LOG_FILE
npm ci --only=production

# 构建应用
echo "构建应用..." | tee -a $LOG_FILE
npm run build

# 数据库迁移（如果需要）
echo "检查数据库..." | tee -a $LOG_FILE
curl -f http://localhost:3000/api/init-db || echo "数据库初始化完成"

# 重启应用
echo "重启应用..." | tee -a $LOG_FILE
pm2 restart $PROJECT_NAME

# 等待应用启动
sleep 10

# 健康检查
echo "执行健康检查..." | tee -a $LOG_FILE
if curl -f http://localhost:3000/api/health; then
    echo "✅ 部署成功！应用正常运行" | tee -a $LOG_FILE
else
    echo "❌ 部署失败！应用无法访问" | tee -a $LOG_FILE
    
    # 回滚到备份版本
    echo "正在回滚..." | tee -a $LOG_FILE
    LATEST_BACKUP=$(ls -t $BACKUP_DIR/backup-*.tar.gz | head -1)
    if [ -n "$LATEST_BACKUP" ]; then
        cd /var/www
        rm -rf $PROJECT_NAME
        tar -xzf "$LATEST_BACKUP"
        pm2 restart $PROJECT_NAME
        echo "已回滚到之前版本" | tee -a $LOG_FILE
    fi
    exit 1
fi

# 清理旧备份（保留最近5个）
echo "清理旧备份..." | tee -a $LOG_FILE
ls -t $BACKUP_DIR/backup-*.tar.gz | tail -n +6 | xargs -r rm

echo "🎉 部署完成！" | tee -a $LOG_FILE
