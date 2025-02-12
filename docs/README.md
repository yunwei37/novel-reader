<div align="center">
  <h1>WebNR - Web Novel Reader</h1>
  <p>A modern, privacy-focused, cross-platform web novel reader that works entirely offline, client-side in browser.<br/>Built with Next.js and TypeScript.
  <br/>No installation needed, open with one click.
  </p>
  
  <p>
    <a href="README.zh.md">中文文档</a> |
    <a href="https://app.webnovel.win">Live Demo</a>
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


## ✨ Key Features

<table>
<tr>
<td>
<h3>🔒 Privacy First</h3>

- All data processed locally
- No login required
- No tracking or analytics
- Works offline as PWA
</td>
<td>
<h3>📚 Multi-Source Reading</h3>

- Import from local files
- Import from URLs
- Connect to repositories
- Multiple text encodings
</td>
</tr>
<tr>
<td>
<h3>🌐 Repository System</h3>

- Multiple novel repositories
- Browse popular/latest novels
- Cross-repository search
- Auto repository syncing
</td>
<td>
<h3>📖 Rich Reading Experience</h3>

- Paged and Scroll modes
- Customizable font size
- Dark/Light themes
- Progress tracking
</td>
</tr>
</table>

<details>
<summary><h2>🔗 URL Parameters</h2></summary>

The app supports several URL parameters for direct actions:

```
# Add repositories
https://app.webnovel.win?repos=https://repo1.com,https://repo2.com

# Import novel
https://app.webnovel.win?add=https://example.com/novel.txt

# Open search
https://app.webnovel.win?search=https://repo1.com
```

</details>

<details>
<summary><h2>🚀 Getting Started</h2></summary>

1. Clone the repository:
```bash
git clone https://github.com/yourusername/webnr.git
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

</details>

<details>
<summary><h2>🛠️ Technology Stack</h2></summary>

- **Frontend Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB
- **State Management**: React Context
- **Internationalization**: Custom i18n
- **Text-to-Speech**: Web Speech API

</details>

<div align="center">

## 📝 License

This project is licensed under the [MIT License](LICENSE).

<p>
  <a href="#top">Back to top</a>
</p>

</div>
