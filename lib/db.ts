import mysql from "mysql2/promise"

const dbConfig = {
  host: "api.archxy.com",
  database: "api_chuanyunjian",
  user: "api_chuanyunjian",
  password: "mKksdketErLf8njF",
  ssl: {
    rejectUnauthorized: false,
  },
  charset: "utf8mb4",
  timezone: "+08:00",
}

let connection: mysql.Connection | null = null

export async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection(dbConfig)
  }
  return connection
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const conn = await getConnection()
  const [rows] = await conn.execute(sql, params)
  return rows as T[]
}

export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const results = await query<T>(sql, params)
  return results.length > 0 ? results[0] : null
}

// 初始化数据库表结构
export async function initDatabase() {
  const conn = await getConnection()

  // 用户表
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      is_admin BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  // API密钥表
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS api_keys (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      api_key VARCHAR(255) UNIQUE NOT NULL,
      api_key_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      api_key_expiration TIMESTAMP NOT NULL,
      note TEXT,
      is_expired BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_api_key (api_key),
      INDEX idx_user_id (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  // 项目表
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      project_name VARCHAR(100) NOT NULL,
      project_serial VARCHAR(255) UNIQUE NOT NULL,
      creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      remark TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_id (user_id),
      INDEX idx_project_serial (project_serial)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  // 设备表
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS devices (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      device_mac VARCHAR(17) NOT NULL,
      authorization_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      remark TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      UNIQUE KEY unique_project_mac (project_id, device_mac),
      INDEX idx_device_mac (device_mac)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  // 文章分类表
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      color VARCHAR(7) DEFAULT '#3B82F6',
      created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_slug (slug)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  // 文章表
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS articles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      excerpt TEXT,
      content LONGTEXT NOT NULL,
      featured_image VARCHAR(500),
      author VARCHAR(100) NOT NULL,
      author_avatar VARCHAR(500),
      author_bio TEXT,
      publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      category_id INT,
      views INT DEFAULT 0,
      comments_count INT DEFAULT 0,
      likes_count INT DEFAULT 0,
      status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
      is_featured BOOLEAN DEFAULT FALSE,
      meta_description TEXT,
      meta_keywords TEXT,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
      INDEX idx_slug (slug),
      INDEX idx_status (status),
      INDEX idx_category_id (category_id),
      INDEX idx_publish_date (publish_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  // 文章标签表
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS article_tags (
      id INT AUTO_INCREMENT PRIMARY KEY,
      article_id INT NOT NULL,
      tag_name VARCHAR(50) NOT NULL,
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
      UNIQUE KEY unique_article_tag (article_id, tag_name),
      INDEX idx_tag_name (tag_name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  // 版本表
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS versions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      version VARCHAR(50) UNIQUE NOT NULL,
      release_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      download_url VARCHAR(500) NOT NULL,
      file_size VARCHAR(20),
      file_name VARCHAR(255) NOT NULL,
      is_latest BOOLEAN DEFAULT FALSE,
      is_stable BOOLEAN DEFAULT TRUE,
      changelog TEXT,
      requirements JSON,
      download_count INT DEFAULT 0,
      INDEX idx_version (version),
      INDEX idx_is_latest (is_latest),
      INDEX idx_release_date (release_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  // 版本功能表
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS version_features (
      id INT AUTO_INCREMENT PRIMARY KEY,
      version_id INT NOT NULL,
      feature_type ENUM('new_feature', 'improvement', 'bug_fix') NOT NULL,
      description TEXT NOT NULL,
      FOREIGN KEY (version_id) REFERENCES versions(id) ON DELETE CASCADE,
      INDEX idx_version_id (version_id),
      INDEX idx_feature_type (feature_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  // 评论表
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      article_id INT NOT NULL,
      parent_id INT NULL,
      user_name VARCHAR(100) NOT NULL,
      user_avatar VARCHAR(500),
      content TEXT NOT NULL,
      created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      likes INT DEFAULT 0,
      is_author BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
      INDEX idx_article_id (article_id),
      INDEX idx_parent_id (parent_id),
      INDEX idx_created_date (created_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  console.log("Database tables initialized successfully")
}
