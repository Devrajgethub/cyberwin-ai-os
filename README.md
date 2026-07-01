<div align="center">

<img src="public/screenshots/hero-cover.png" alt="CyberWin AI OS" width="100%" />

# 🖥️ CyberWin AI OS

**A web-based cyber security desktop prototype — built for learning, portfolio, and ethical hacking demos.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[🚀 Live Demo](#) · [📖 Documentation](#) · [📋 Roadmap](#roadmap) · [🤝 Contributing](#contributing)

</div>

---

## 📸 Screenshots

| Boot Animation | Login Screen | Desktop |
|:---:|:---:|:---:|
| ![Boot](public/screenshots/hero-cover.png) | *Coming soon* | *Coming soon* |

| Security Dashboard | AI Assistant | Terminal |
|:---:|:---:|:---:|
| *Coming soon* | *Coming soon* | *Coming soon* |

---

## ✨ Features

### System Core
- **🖥️ Full Desktop Shell** — Windows 11-inspired desktop with drag, resize, minimize, maximize, close
- **⌨️ Boot Animation** — Cinematic 3-phase boot sequence with progress bar and status messages
- **🔐 Login System** — Credential validation with demo session persistence (survives page refresh)
- **🔒 Lock Screen** — Live clock, date display, password re-verification, sign-out option
- **🔔 Notification Center** — Slide-in panel with read/unread states, clear-all, and mark-all-read
- **📋 Start Menu** — Searchable app launcher with pinned apps and categorized all-apps list
- **📊 Taskbar** — Running apps, system tray (clock, Wi-Fi, battery, volume, theme toggle, lock)
- **🗂️ Window Manager** — 8-direction resize handles, z-index focus management, minimize/maximize/restore
- **🎨 Dark/Light Theme** — System-wide theme toggle with cyberpunk dark mode as default

### Data & Persistence
- **💾 IndexedDB Storage** — Persistent notes, file system, and settings across sessions
- **🔄 Session Persistence** — Login session saved to localStorage, restored on page reload

### Security & AI
- **🛡️ Security Dashboard** — Real-time threat monitoring, vulnerability scoring, system health
- **🌐 Network Monitor** — Live connection tracking, bandwidth usage, protocol analysis
- **🔥 Firewall** — Rule-based firewall with allow/deny/block controls
- **📝 Log Viewer** — System, security, auth, and application log streams
- **🤖 AI Assistant** — Conversational AI chatbot interface

### Media & Utility
- **🎵 Music Player** — Audio playback with playlist and visualizer
- **🎬 Video Player** — Video playback controls
- **🖼️ Image Viewer** — Image gallery with zoom
- **📄 PDF Viewer** — Document viewer
- **🎨 Paint** — Canvas drawing tool
- **📓 Notes** — Rich text notes with IndexedDB persistence
- **✅ Todo** — Task manager with add/complete/delete
- **📅 Calendar** — Monthly calendar view
- **🧮 Calculator** — Scientific calculator
- **💻 Code Editor** — Syntax-highlighted code editor
- **📁 File Manager** — Create, rename, delete files and folders with IndexedDB
- **🌐 Browser** — Web browser with URL bar
- **⚙️ Settings** — System configuration panel
- **👤 Profile** — User profile management
- **🏪 App Store** — App discovery and install UI
- **🔄 System Update** — Update checker
- **💾 Backup** — System backup and restore
- **❓ Help Center** — Documentation and FAQ
- **🎓 Cyber Learning Lab** — Cybersecurity learning modules

---

## 📱 All 26 Apps

| # | App | Category | Description |
|---|-----|----------|-------------|
| 1 | Terminal | System | Command-line interface |
| 2 | File Manager | System | File browser with CRUD operations |
| 3 | Calculator | Utility | Scientific calculator |
| 4 | Notes | Utility | Rich text notes with persistence |
| 5 | Code Editor | Utility | Syntax-highlighted code editor |
| 6 | Settings | System | System configuration |
| 7 | Security Dashboard | Security | Threat monitoring & system health |
| 8 | Network Monitor | Security | Connection & bandwidth tracking |
| 9 | Firewall | Security | Rule-based traffic control |
| 10 | Log Viewer | Security | Multi-source log streams |
| 11 | AI Assistant | AI | Conversational AI chatbot |
| 12 | PDF Viewer | Media | Document viewer |
| 13 | Image Viewer | Media | Image gallery with zoom |
| 14 | Music Player | Media | Audio player with playlist |
| 15 | Video Player | Media | Video playback |
| 16 | Paint | Media | Canvas drawing tool |
| 17 | Browser | Utility | Web browser |
| 18 | Calendar | Utility | Monthly calendar |
| 19 | Todo | Utility | Task management |
| 20 | Profile | System | User profile |
| 21 | App Store | System | App discovery |
| 22 | System Update | System | Update checker |
| 23 | Backup | System | Backup & restore |
| 24 | Help Center | System | Documentation & FAQ |
| 25 | Cyber Learning Lab | AI | Security learning modules |
| 26 | Start Menu | System | Searchable app launcher |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** (App Router) | React framework |
| **TypeScript 5** | Type safety |
| **Tailwind CSS 4** | Styling |
| **shadcn/ui** (New York) | UI component library |
| **Zustand** | Client state management |
| **Framer Motion** | Animations |
| **IndexedDB** | Persistent client-side storage |
| **localStorage** | Session persistence |
| **Lucide React** | Icon library |
| **@dnd-kit** | Drag and drop |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/cyberwin-ai-os.git
cd cyberwin-ai-os

# Install dependencies
bun install
# or: npm install

# Set up database
bun run db:push
```

### Run Locally

```bash
# Start development server
bun run dev
# or: npm run dev

# Open in browser
# The OS will open at http://localhost:3000
```

### Build for Production

```bash
bun run build
bun run start
```

---

## 🔑 Demo Credentials

| Field | Value |
|-------|-------|
| **Username** | `dev` |
| **Password** | `cyberwin123` |

> ⚠️ See [Security Disclaimer](#-security-disclaimer) below.

---

## 📁 Project Structure

```
cyberwin-ai-os/
├── prisma/                    # Database schema
├── public/
│   └── screenshots/           # Project screenshots
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   └── ai-chat/       # AI chat endpoint
│   │   ├── landing/           # Landing page route
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # OS entry (boot → login → desktop)
│   │   └── globals.css        # Global styles (cyberpunk theme)
│   ├── components/ui/         # shadcn/ui components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Shared utilities
│   └── os/
│       ├── apps/              # 26 OS applications
│       │   ├── registry.ts    # App registry (id, title, icon, sizes)
│       │   ├── terminal/
│       │   ├── file-manager/
│       │   ├── ai-assistant/
│       │   ├── security-dashboard/
│       │   ├── network-monitor/
│       │   ├── firewall/
│       │   ├── log-viewer/
│       │   ├── settings/
│       │   ├── code-editor/
│       │   ├── notes/
│       │   ├── calculator/
│       │   ├── pdf-viewer/
│       │   ├── image-viewer/
│       │   ├── music-player/
│       │   ├── video-player/
│       │   ├── paint/
│       │   ├── browser/
│       │   ├── calendar/
│       │   ├── todo/
│       │   ├── profile/
│       │   ├── app-store/
│       │   ├── system-update/
│       │   ├── backup/
│       │   ├── help-center/
│       │   └── cyber-learning/
│       ├── components/        # OS shell components
│       │   ├── boot-animation.tsx
│       │   ├── desktop.tsx
│       │   ├── desktop-icon.tsx
│       │   ├── lock-screen.tsx
│       │   ├── login-screen.tsx
│       │   ├── notification-center.tsx
│       │   ├── start-menu.tsx
│       │   ├── taskbar.tsx
│       │   └── window.tsx
│       ├── lib/               # OS utilities
│       │   ├── auth.ts        # Authentication service
│       │   ├── db.ts          # IndexedDB layer
│       │   └── session.ts     # Session persistence
│       ├── store.ts           # Zustand state management
│       └── types.ts           # TypeScript type definitions
├── Caddyfile
├── package.json
└── tsconfig.json
```

---

## ⚠️ Security Disclaimer

> **This authentication system is for demo purposes only.**
> Real production authentication should use a backend, hashed passwords, secure sessions, and environment-based secrets.

- Credentials are validated client-side against a hardcoded map — **not secure**.
- Sessions are stored in `localStorage` — **not HTTP-only cookies**.
- There is no CSRF protection, rate limiting, or brute-force prevention.
- No real passwords are stored or transmitted.
- The `src/os/lib/auth.ts` and `src/os/lib/session.ts` files contain clear `// --- replace with real API ---` comments showing exactly where to integrate real authentication.

---

## 🛡️ Ethical Usage Notice

CyberWin AI OS is designed **exclusively** for:

- ✅ Educational and learning purposes
- ✅ Portfolio and demonstration projects
- ✅ UI/UX design prototyping
- ✅ Ethical cyber security training and awareness

This project **must not** be used for:

- ❌ Any malicious or unauthorized activities
- ❌ Impersonating real operating systems or security tools
- ❌ Distributing without proper attribution
- ❌ Bypassing or attacking real security systems

---

## 🗺️ Roadmap

### v2.1 — Current
- [x] 26 fully functional applications
- [x] Boot animation with progress bar
- [x] Login system with credential validation
- [x] Lock screen with sign-out
- [x] Session persistence (localStorage)
- [x] Notification center
- [x] IndexedDB persistent storage
- [x] Dark/light theme toggle
- [x] Landing page

### v2.2 — Planned
- [ ] Right-click context menus on desktop
- [ ] Multi-window tab system
- [ ] Sound effects for OS events
- [ ] Customizable wallpaper
- [ ] Drag-and-drop desktop icon arrangement

### v3.0 — Future
- [ ] Real backend authentication (NextAuth.js)
- [ ] WebSocket-based real-time notifications
- [ ] Multi-user support
- [ ] Virtual file system with actual upload/download
- [ ] Deployable PWA (Progressive Web App)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built by Dev**

*For learning, portfolio, and ethical cyber security demo purposes only.*

</div>