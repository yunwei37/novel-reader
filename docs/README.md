# WebNR - Web Novel Reader

A modern, privacy-focused, cross-platform web novel reader that works entirely client-side in browser. Built with Next.js and TypeScript.

[中文文档](README.zh.md)


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

## Key Features

🔒 **Privacy First**
  
- All data processed locally
- No login required
- No tracking or analytics
- Works offline as PWA

📚 **Multi-Source Reading**

- Import from local files
- Import from URLs
- Connect to compatible novel repositories
- Support for multiple text encodings (UTF-8, GB18030, Big5)

🌐 **Repository System**
  
  - Connect to multiple novel repositories
  - Browse popular and latest novels
  - Search across repositories
  - Automatic repository syncing
  - Categories and tags support

📖 **Rich Reading Experience**

  - Two reading modes: Paged and Scroll
  - Customizable font size
  - Dark/Light theme with system preference detection
  - Progress tracking
  - Clean, distraction-free interface
  - Text-to-Speech support with adjustable speed and voice selection
  - One-click access to web resources and definitions

🔍 **Advanced Search**

  - Full-text search across all repositories
  - Multiple sorting options (relevance, newest, popular, rating)
  - Paginated results
  - Quick repository filtering

🌍 **Internationalization**

  - Multi-language support
  - Currently supports English and Chinese
  - Easy to add new translations

📱 **Cross-Platform**

  - Works as Progressive Web App (PWA)
  - Responsive design for all screen sizes
  - Installable on any device
  - Offline support


## URL Parameters

The app supports several URL parameters for direct actions:

- `?repos=URL1,URL2,...` - Add one or more repository URLs
  ```
  https://app.webnovel.win?repos=https://repo1.com,https://repo2.com
  ```

- `?add=URL` - Import novel directly from URL

  ```
  https://app.webnovel.win?add=https://example.com/novel.txt
  ```

- `?search=REPO_URL` - Open search view for specific repository

  ```
  https://app.webnovel.win?search=https://repo1.com
  ```

## Getting Started

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

4. Open [http://localhost:3000](http://localhost:3000) with your browser to start using the app.

## Technology Stack

- **Frontend Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB for local data storage
- **State Management**: React Context
- **Internationalization**: Custom i18n implementation
- **Text-to-Speech**: Web Speech API

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
