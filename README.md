# Chrono - Cross-Platform Time Tracking Application

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.72+-blue?style=for-the-badge&logo=react)](https://reactnative.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10+-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

> **Chrono** is a modern, cross-platform time tracking application that helps individuals and teams track time on projects and tasks, view detailed reports, and receive AI-driven productivity insights. Built with Next.js, React Native, and Electron for seamless web, mobile, and desktop experiences.

## 🚀 Features

### Core Time Tracking
- ⏱️ **Stopwatch Interface** - Start, stop, and reset timers for projects and tasks
- 📱 **Cross-Platform** - Web, mobile (iOS/Android), and desktop (Windows/macOS/Linux)
- 🔄 **Real-time Sync** - Seamless data synchronization across all devices
- 📊 **Detailed Reports** - Daily, weekly, monthly, and custom date range reports

### Project & Task Management
- 📁 **Project Organization** - Create and manage projects with custom colors and descriptions
- ✅ **Task Management** - Break down projects into granular tasks for detailed tracking
- 👥 **Team Collaboration** - Share projects with team members and track collective progress
- 💰 **Billable Hours** - Set hourly rates and track billable time for client projects

### Productivity & Insights
- 🎯 **Goal Setting** - Set daily, weekly, or monthly time targets
- 🤖 **AI Insights** - Receive productivity recommendations based on work patterns
- 📈 **Progress Tracking** - Monitor goal progress and celebrate achievements
- 📅 **Calendar Integration** - Sync with Google Calendar and other calendar services

### Advanced Features
- 🔒 **Offline Support** - Continue tracking time without internet connection
- 🔐 **Secure Authentication** - Firebase Auth with JWT token management
- 📱 **Push Notifications** - Stay updated with timer events and goal reminders
- 🎨 **Modern UI** - Beautiful interface built with shadcn/ui and Tailwind CSS

## 🏗️ Tech Stack

**Frontend:** Next.js 14+ with TypeScript  
**Mobile:** React Native with Expo  
**Desktop:** Electron  
**UI:** shadcn/ui + Tailwind CSS  
**Database:** Neon PostgreSQL (serverless)  
**Authentication:** Firebase Auth  
**Hosting:** Firebase Hosting  

## 🎯 What We're Building

Chrono is designed to be the ultimate time tracking solution for individuals and teams who want to:

- **Track time accurately** with a simple, intuitive stopwatch interface
- **Organize work** by projects and tasks for better productivity
- **Collaborate with teams** on shared projects and time tracking
- **Get insights** about their work patterns and productivity trends
- **Work anywhere** with seamless cross-platform synchronization
- **Stay focused** with goal setting and progress tracking
- **Bill clients** accurately with billable hours and rate management

## 🚀 Getting Started

### Live Demo
🌐 **Frontend**: [chrono-b4542.web.app](https://chrono-b4542.web.app)

⚠️ **Important Note**: The frontend is currently in active development and may appear janky or incomplete. Please use at your own discretion and avoid sending too many requests to prevent IP banning.

### Prerequisites
- Node.js 18+ and pnpm
- Neon PostgreSQL account
- Firebase project

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chrono.git
   cd chrono
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Fill in your Neon and Firebase credentials
   ```

4. **Set up database**
   - Follow the [Database Setup Guide](docs/DATABASE_SETUP.md) to configure Neon PostgreSQL
   - Run `node scripts/test-db.js` to test the connection

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
chrono/
├── docs/                       # Project documentation
│   ├── DESIGN.md              # Technical design document
│   ├── PHASES.md              # Development phases
│   ├── requirements.md        # Project requirements
│   └── DATABASE_SETUP.md      # Database setup guide
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # React components
│   ├── lib/                    # Utilities and helpers
│   │   ├── database.ts         # Database connection
│   │   ├── init-db.ts          # Database initialization
│   │   ├── schema.sql          # Database schema
│   │   └── services/           # Database services
│   └── types/                  # TypeScript definitions
├── scripts/                    # Utility scripts
│   └── test-db.js             # Database connection test
├── mobile/                     # React Native app
├── desktop/                    # Electron app
└── shared/                     # Shared code between platforms
```

## 🧪 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript type checking

# Database
node scripts/test-db.js  # Test database connection
```

# Testing
pnpm test             # Run unit tests
pnpm test:watch       # Run tests in watch mode

# Mobile & Desktop
pnpm mobile:dev       # Start React Native development
pnpm desktop:dev      # Start Electron development
```

## 📱 Platform Support

| Platform | Status | Features |
|----------|--------|----------|
| **Web** | ✅ Complete | Full feature set, responsive design |
| **iOS** | 🚧 In Progress | Native app with offline support |
| **Android** | 🚧 In Progress | Native app with offline support |
| **Windows** | 🚧 In Progress | Desktop app with system tray |
| **macOS** | 🚧 In Progress | Desktop app with native notifications |
| **Linux** | 🚧 In Progress | Desktop app with system integration |

## 🎯 Roadmap

### Q1 2024 - MVP Release
- [x] Core time tracking functionality
- [x] Project and task management
- [x] Basic reporting system
- [x] Web application

### Q2 2024 - Mobile & Desktop
- [ ] React Native mobile apps
- [ ] Electron desktop applications
- [ ] Offline support
- [ ] Push notifications

### Q3 2024 - Advanced Features
- [ ] Team collaboration
- [ ] Billable hours tracking
- [ ] Calendar integration
- [ ] Goal setting and tracking

### Q4 2024 - AI & Insights
- [ ] AI-powered productivity insights
- [ ] Advanced analytics
- [ ] Custom dashboards
- [ ] Integration APIs


---

**Built with ❤️ by Eshwar who has too much time**

