# WebNR - Web小说阅读器

一个现代化的、注重隐私的 SPA/PWA 跨平台网页小说阅读器，完全在浏览器中本地运行。使用 Next.js 和 TypeScript 构建。

[English Documentation](README.md)


## Demo Screenshots

<div align="center">

![Screenshot 1](imgs/Screenshot%202025-02-09%20174556.png)

![Screenshot 2](imgs/Screenshot%202025-02-09%20174735.png)

![Screenshot 3](imgs/Screenshot%202025-02-09%20174807.png)

![Screenshot 4](imgs/Screenshot%202025-02-09%20174820.png)

![Screenshot 5](imgs/Screenshot%202025-02-09%20174833.png)

![Screenshot 6](imgs/Screenshot%202025-02-09%20174855.png)

![Screenshot 7](imgs/Screenshot%202025-02-09%20174925.png)

![Screenshot 8](imgs/Screenshot%202025-02-09%20174925.png)

</div>

## 主要特性

🔒 **隐私优先**

- 所有数据本地处理
- 无需登录
- 无跟踪分析
- 支持离线运行（PWA）

📚 **多源阅读**

- 导入本地文件
- 从URL导入
- 连接兼容的小说仓库
- 支持多种文本编码（UTF-8、GB18030、Big5）

📚 **书源系统**

- 连接多个小说仓库
- 浏览热门和最新小说
- 跨仓库搜索
- 自动仓库同步
- 支持分类和标签

> 注意：书源由外部维护，WebNR 仅提供书源的搜索和导入功能，不对书源内容负责与承担任何责任。

📖 **丰富的阅读体验**
  
- 两种阅读模式：分页和滚动
- 自定义字体大小
- 深色/浅色主题（支持跟随系统）
- 进度追踪
- 文字转语音(TTS)支持，可调节速度和选择声音
- 一键访问网络资源和定义

🔍 **高级搜索**

- 跨仓库全文搜索
- 多种排序选项（相关度、最新、热门、评分）
- 分页结果
- 快速仓库筛选

🌍 **国际化**

- 多语言支持
- 当前支持中文和英文
- 易于添加新翻译

📱 **跨平台**

- 支持 PWA 安装
- 响应式设计，适配所有屏幕尺寸
- 可安装到任何设备
- 支持离线使用

## URL 参数

应用支持多个 URL 参数来执行直接操作：

- `?repos=URL1,URL2,...` - 添加一个或多个仓库URL
  ```
  https://app.webnovel.win?repos=https://repo1.com,https://repo2.com
  ```

- `?add=URL` - 直接从URL导入小说
  ```
  https://app.webnovel.win?add=https://example.com/novel.txt
  ```

- `?search=REPO_URL` - 打开特定仓库的搜索视图
  ```
  https://app.webnovel.win?search=https://repo1.com
  ```

## 开始使用

1. 克隆仓库：
```bash
git clone https://github.com/yourusername/webnr.git
```

2. 安装依赖：
```bash
npm install
# 或
yarn install
```

3. 运行开发服务器：
```bash
npm run dev
# 或
yarn dev
```

4. 用浏览器打开 [http://localhost:3000](http://localhost:3000) 开始使用。

## 技术栈

- **前端框架**: Next.js with TypeScript
- **样式**: Tailwind CSS
- **存储**: IndexedDB 本地存储
- **状态管理**: React Context
- **国际化**: 自定义 i18n 实现
- **文字转语音**: Web Speech API

## 贡献

欢迎贡献！请随时提交 Pull Request。

## 许可证

本项目采用 MIT 许可证 - 详见 LICENSE 文件。 
