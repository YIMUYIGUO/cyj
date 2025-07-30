#!/bin/bash

# 宝塔面板数据备份脚本
# 建议在宝塔计划任务中每天执行

PROJECT_NAME="chuanyunjian-gh"
PROJECT_DIR="/www/wwwroot/$PROJECT_NAME"
BACKUP_DIR="/www/backup"
DATE=$(date +%Y%m%d_%H%M%S)

echo "开始备份 $PROJECT_NAME..."

# 创建备份目录
mkdir -p $BACKUP_DIR/files
mkdir -p $BACKUP_DIR/database

# 备份项目文件
echo "备份项目文件..."
tar -czf "$BACKUP_DIR/files/project-$DATE.tar.gz" -C /www/wwwroot $PROJECT_NAME

# 备份数据库
echo "备份数据库..."
mysqldump -h api.archxy.com -u api_chuanyunjian -p'mKksdketErLf8njF' api_chuanyunjian > "$BACKUP_DIR/database/db-$DATE.sql"

# 备份Nginx配置
echo "备份Nginx配置..."
cp /www/server/panel/vhost/nginx/$PROJECT_NAME.conf "$BACKUP_DIR/nginx-$DATE.conf" 2>/dev/null || true

# 清理旧备份（保留7天）
echo "清理旧备份..."
find $BACKUP_DIR/files -name "project-*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR/database -name "db-*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "nginx-*.conf" -mtime +7 -delete

echo "备份完成！"
echo "文件备份: $BACKUP_DIR/files/project-$DATE.tar.gz"
echo "数据库备份: $BACKUP_DIR/database/db-$DATE.sql"
