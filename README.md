# Islamic PWA - تطبيق إسلامي

A modern Progressive Web App for Muslims built with React.js + Tailwind CSS.

## Features
- 🕌 **Prayer Times** - Auto-detected via GPS + Aladhan API
- 📿 **Azkar** - Morning, Evening & After-Prayer with counter
- 📖 **Quran** - Browse Surahs with full verses
- 📜 **Hadith** - Daily Hadith + collection
- 🔔 **Notifications** - Prayer time alerts via Browser API
- 🌙 **Dark/Light Mode**
- 🌐 **Arabic & English** (RTL support)
- 📱 **PWA** - Installable on mobile & desktop

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

## Project Structure
```
src/
├── components/
│   ├── Navbar.jsx
│   ├── PrayerCountdown.jsx
│   ├── PrayerList.jsx
│   ├── AzkarCard.jsx
│   └── NotificationToggle.jsx
├── pages/
│   ├── Home.jsx
│   ├── PrayerPage.jsx
│   ├── AzkarPage.jsx
│   ├── QuranPage.jsx
│   ├── HadithPage.jsx
│   └── SettingsPage.jsx
├── hooks/
│   ├── usePrayerTimes.js
│   └── useNotifications.js
├── context/
│   └── AppContext.jsx
├── data/
│   ├── azkar.js
│   └── hadith.js
├── i18n/
│   ├── en.js
│   ├── ar.js
│   └── index.js
├── App.jsx
├── main.jsx
└── index.css
public/
└── sw.js
```

## APIs Used
- **Aladhan API** - Prayer times calculation
- **Alquran Cloud API** - Quran verses

## Tech Stack
- React 18 + Hooks
- Tailwind CSS
- Framer Motion
- React Router v6
- i18next
- Vite + vite-plugin-pwa
