# 🚀 SdelayDelo Frontend (React + Vite)

Frontend part of **SdelayDelo** - an open-source project designed for practical use. This implementation serves as a forward-looking initiative that welcomes community contributions and support.

## 🔧 Technologies

- **React 19.0.0**
- **Vite 6.2.0** (build tool)
- **Tailwind CSS 3.4.17** (styling)
- **React Router v7.5.0** (navigation)
- **ESLint 9.21.0** (linting)

## 🚧 In Development

- **Mobile-friendly layout** – Improving responsiveness for smaller screens.
- **Better adaptive design** – Transitioning from `px` to relative units (`rem`, `%`).
- **Touch-friendly interactions** – Optimizing hover effects for mobile devices
- **Some features**: tags-filter, notifications, etc.

## Prerequisites

- **Node.js 18+**
- **npm 9+**
- **git**

## ⚙️ Installation & Setup

### Linux (Debian/Ubuntu)

```bash
sudo apt update
sudo apt install nodejs git npm
```

### Windows

1. Install [Node.js](https://nodejs.org/) (includes npm)
2. Install [Git for Windows](https://git-scm.com/downloads/win)

### Project Setup

1. Clone repository:

```bash
git clone https://github.com/donko1/SdelayDelo_react.git
cd SdelayDelo_react
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment (use .env.example as template):

- Linux/Mac:

```bash
cp .env.example .env
```

- Windows:

```cmd
copy .env.example .env
```

4. Start development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## ⚠️ Important Notes

- Backend required for full functionality: [donko1/SdelayDelo](https://github.com/donko1/SdelayDelo)
- All configurations are in `/config` directory
- Uses Tailwind CSS for styling
- Implements React Router v7 for routing

## 🔒 Environment Setup

Rename `.env.example` to `.env` and configure as you wish
