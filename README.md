# WebNR - Web Novel Reader

A modern, privacy-focused, cross-platform web novel reader that works entirely client-side in browser. Built with Next.js and TypeScript.

[中文文档](README.zh.md)

## Key Features

🔒 **Privacy First**
  
- All data processed locally
- No login required
- No tracking or analytics
- Works offline as PWA

📚 **Multi-Source Reading**

- Import from local files
- Import from URLs
- Connect to compatible novel Sources
- Support for multiple text encodings (UTF-8, GB18030, Big5)

🌐 **source System**
  
  - Connect to multiple novel Sources
  - Browse popular and latest novels
  - Search across Sources
  - Automatic source syncing
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

  - Full-text search across all Sources
  - Multiple sorting options (relevance, newest, popular, rating)
  - Paginated results
  - Quick source filtering

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

- `?repos=URL1,URL2,...` - Add one or more source URLs
  ```
  https://app.webnovel.win?repos=https://repo1.com,https://repo2.com
  ```

- `?add=URL` - Import novel directly from URL

  ```
  https://app.webnovel.win?add=https://example.com/novel.txt
  ```

- `?search=REPO_URL` - Open search view for specific source

  ```
  https://app.webnovel.win?search=https://repo1.com
  ```

## Getting Started

1. Clone the source:
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
