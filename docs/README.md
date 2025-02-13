<div align="center">
  <h1>WebNR - Web Novel Reader<br/>网文阅读器</h1>
  <p>
    A modern, privacy-focused, cross-platform web novel reader that works entirely offline, client-side in browser.<br/>
    一个现代化的、注重隐私的、跨平台的网文阅读器，完全离线运行，基于浏览器。<br/>
    Built with Next.js and TypeScript.<br/>
    使用 Next.js 和 TypeScript 构建。<br/>
    No installation needed, open with one click.<br/>
    无需安装，一键即用。
  </p>
  
  <p>
    <a href="README.zh.md">中文文档</a> |
    <a href="https://app.webnovel.win">Live Demo 在线演示</a>
  </p>
</div>

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 16px;">
  <img src="imgs/Screenshot%202025-02-09%20174735.png" alt="Screenshot 2" style="width: 100%; border-radius: 8px;"/>
  <img src="imgs/Screenshot%202025-02-09%20174807.png" alt="Screenshot 3" style="width: 100%; border-radius: 8px;"/>
  <img src="imgs/Screenshot%202025-02-09%20174820.png" alt="Screenshot 4" style="width: 100%; border-radius: 8px;"/>
  <img src="imgs/Screenshot%202025-02-09%20174833.png" alt="Screenshot 5" style="width: 100%; border-radius: 8px;"/>
  <img src="imgs/Screenshot%202025-02-09%20174855.png" alt="Screenshot 6" style="width: 100%; border-radius: 8px;"/>
  <img src="imgs/Screenshot%202025-02-09%20174925.png" alt="Screenshot 7" style="width: 100%; border-radius: 8px;"/>
  <img src="imgs/Screenshot%202025-02-09%20174556.png" alt="Screenshot 1" style="width: 100%; border-radius: 8px;"/>
</div>


## ✨ Key Features 主要特点

<table>
<tr>
<td>
<h3>🔒 Privacy First 隐私优先</h3>

- All data processed locally<br/>所有数据本地处理
- No login required<br/>无需登录
- No tracking or analytics<br/>无跟踪和分析
- Works offline as PWA<br/>支持离线 PWA 应用
</td>
<td>
<h3>📚 Multi-Source Reading 多源阅读</h3>

- Import from local files<br/>从本地文件导入
- Import from URLs<br/>从网址导入
- Connect to Sources<br/>连接到源
- Multiple text encodings<br/>多种文本编码支持
</td>
</tr>
<tr>
<td>
<h3>🌐 Source System 源系统</h3>

- Multiple novel Sources<br/>多小说源支持
- Browse popular/latest novels<br/>浏览热门/最新小说
- Cross-source search<br/>跨源搜索
- Auto source syncing<br/>自动源同步
</td>
<td>
<h3>📖 Rich Reading Experience 丰富的阅读体验</h3>

- Paged and Scroll modes<br/>翻页和滚动模式
- Customizable font size<br/>自定义字体大小
- Dark/Light themes<br/>深色/浅色主题
- Progress tracking<br/>阅读进度追踪
</td>
</tr>
</table>

<details>
<summary><h2>🔗 URL Parameters URL参数</h2></summary>

The app supports several URL parameters for direct actions:<br/>
应用支持多个URL参数进行直接操作：

```
# Add Sources 添加源
https://app.webnovel.win?repos=https://repo1.com,https://repo2.com

# Import novel 导入小说
https://app.webnovel.win?add=https://example.com/novel.txt

# Open search 打开搜索
https://app.webnovel.win?search=https://repo1.com
```

</details>

<details>
<summary><h2>🚀 Getting Started 开始使用</h2></summary>

1. Clone the source 克隆源码:
```bash
git clone https://github.com/yourusername/webnr.git
```

2. Install dependencies 安装依赖:
```bash
npm install
# or 或者
yarn install
```

3. Run the development server 运行开发服务器:
```bash
npm run dev
# or 或者
yarn dev
```

4. Open 打开 [http://localhost:3000](http://localhost:3000) with your browser 使用浏览器访问。

</details>

<details>
<summary><h2>🛠️ Technology Stack 技术栈</h2></summary>

- **Frontend Framework 前端框架**: Next.js with TypeScript
- **Styling 样式**: Tailwind CSS
- **Storage 存储**: IndexedDB
- **State Management 状态管理**: React Context
- **Internationalization 国际化**: Custom i18n
- **Text-to-Speech 文字转语音**: Web Speech API

</details>

<div align="center">

## 📝 License 许可证

This project is licensed under the [MIT License](LICENSE).<br/>
本项目采用 [MIT 许可证](LICENSE)。

<p>
  <a href="#top">Back to top 返回顶部</a>
</p>

</div>
