# 🚀 Lynk - Next Generation Messaging App

<div align="center">
  <img src="public/logo.jpg" alt="Lynk Logo" width="120" height="120" />
  
  <p align="center">
    Transform your conversations with Lynk - a secure, fast, and feature-rich messaging platform
    <br />
    <a href="#features"><strong>Explore Features »</strong></a>
    <br />
    <br />
    <a href="#demo">View Demo</a>
    ·
    <a href="#installation">Installation</a>
    ·
    <a href="#contributing">Contributing</a>
  </p>
</div>

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Key Features Explained](#key-features-explained)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About

Lynk is a modern, full-stack messaging application built with Next.js 14, featuring real-time chat, video calling, and a beautiful dark mode interface. Inspired by Telegram's user experience, Lynk provides a seamless communication platform with enterprise-grade features.

### Why Lynk?

- **⚡ Lightning Fast**: Built on Next.js 14 with optimized performance
- **🔒 Secure**: End-to-end encryption with Clerk authentication
- **🎨 Beautiful UI**: Modern design with smooth animations and dark mode
- **📱 Responsive**: Works perfectly on desktop, tablet, and mobile
- **🎥 Video Calls**: High-quality video calling powered by Stream
- **💬 Real-time Chat**: Instant messaging with typing indicators and read receipts

## ✨ Features

### Core Features

- 🔐 **Secure Authentication** - Powered by Clerk with email/password and OAuth support
- 💬 **Real-time Messaging** - Instant chat with typing indicators and message status
- 🎥 **Video Calling** - High-quality video calls with screen sharing
- 👥 **User Search** - Find and connect with other users
- 📊 **Message Statistics** - Track your messaging activity
- 🌙 **Dark Mode** - Beautiful dark theme with smooth transitions
- 📱 **Responsive Design** - Optimized for all screen sizes
- 🔔 **Notifications** - Real-time push notifications
- 📎 **File Sharing** - Share images, videos, and documents
- ⚡ **Fast Performance** - Optimized with Next.js 14 App Router

### UI/UX Features

- Smooth animations and transitions
- Gradient text effects
- Animated counters and statistics
- Hover effects and micro-interactions
- Loading states and error boundaries
- Accessible components (WCAG compliant)

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: Custom CSS animations with Tailwind
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: [Geist Sans & Mono](https://vercel.com/font)

### Backend & Services

- **Database**: [Convex](https://www.convex.dev/) (Real-time backend)
- **Authentication**: [Clerk](https://clerk.com/)
- **Chat SDK**: [Stream Chat React](https://getstream.io/chat/)
- **Video SDK**: [Stream Video React](https://getstream.io/video/)

### Development Tools

- **Package Manager**: npm/yarn/pnpm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Deployment**: [Vercel](https://vercel.com/)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** / **yarn** / **pnpm**
- **Git**

You'll also need accounts for:

- [Clerk](https://clerk.com/) - Authentication
- [Convex](https://www.convex.dev/) - Backend database
- [Stream](https://getstream.io/) - Chat and video services

## 🚀 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/Alifouanne/telegram-clone.git

   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install

   # or

   yarn install

   # or

   pnpm install
   \`\`\`

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. **Configure your environment variables** (see below)

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`env

# Clerk Authentication

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Convex Backend

CONVEX_DEPLOYMENT=your_convex_deployment_url
NEXT_PUBLIC_CONVEX_URL=your_convex_url

# Stream Chat & Video

NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key
STREAM_SECRET_KEY=your_stream_secret_key
\`\`\`

### Getting API Keys

1. **Clerk**
   - Sign up at [clerk.com](https://clerk.com/)
   - Create a new application
   - Copy the publishable and secret keys from the dashboard

2. **Convex**
   - Sign up at [convex.dev](https://www.convex.dev/)
   - Create a new project
   - Run `npx convex dev` to get your deployment URL

3. **Stream**
   - Sign up at [getstream.io](https://getstream.io/)
   - Create a new app
   - Copy the API key and secret from the dashboard

## 🏃 Running the Project

### Development Mode

\`\`\`bash

# Start the development server

npm run dev

# In a separate terminal, start Convex

npx convex dev
\`\`\`

The app will be available at `https://telegram-clone-liart-zeta.vercel.app`

### Production Build

\`\`\`bash

# Build the application

npm run build

# Start the production server

npm start
\`\`\`

## 📁 Project Structure

\`\`\`
lynk/
├── app/ # Next.js App Router
│ ├── (signde-in)/ # Authenticated routes
│ │ ├── dashboard/ # Main chat dashboard
│ │ │ ├── video-call/ # Video call pages
│ │ │ └── page.tsx # Dashboard page
│ │ ├── layout.tsx # Authenticated layout
│ │ └── error.tsx # Error boundary
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Landing page
│ ├── globals.css # Global styles
│ └── error.tsx # Root error boundary
├── components/ # React components
│ ├── ui/ # shadcn/ui components
│ ├── Mainpage/ # Landing page components
│ │ ├── hero-section-enhanced.tsx
│ │ ├── Stats.tsx
│ │ ├── Features.tsx
│ │ ├── CTA.tsx
│ │ └── Footer.tsx
│ ├── app-sidebar.tsx # Chat sidebar
│ ├── auth-provider.tsx # Authentication provider
│ ├── theme-provider.tsx # Theme provider
│ └── error-state.tsx # Error component
├── convex/ # Convex backend
│ ├── \_generated/ # Generated types
│ ├── schema.ts # Database schema
│ ├── users.ts # User functions
│ ├── conversations.ts # Chat functions
│ └── http.ts # HTTP endpoints
├── hooks/ # Custom React hooks
│ ├── use-mobile.tsx
│ └── use-toast.ts
├── lib/ # Utility functions
│ └── utils.ts
├── public/ # Static assets
│ └── logo.jpg
└── package.json # Dependencies
\`\`\`

## 🎨 Key Features Explained

### Real-time Chat

Powered by Stream Chat SDK, providing:

- Instant message delivery
- Typing indicators
- Read receipts
- Message reactions
- File attachments
- Custom theming to match Lynk's design

### Video Calling

Built with Stream Video SDK:

- High-quality video and audio
- Screen sharing
- Call controls (mute, camera toggle)
- Participant management
- Responsive layout

### Authentication Flow

Clerk handles:

- Email/password authentication
- OAuth providers (Google, GitHub, etc.)
- Session management
- User profiles
- Protected routes

### Database & Backend

Convex provides:

- Real-time data synchronization
- Type-safe queries and mutations
- Serverless functions
- File storage
- Automatic scaling

## 🎯 Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting with Next.js
- **Image Optimization**: Next.js Image component for optimized images
- **Font Optimization**: Geist fonts with automatic subsetting
- **CSS Optimization**: Tailwind CSS with PurgeCSS
- **Lazy Loading**: Components loaded on demand
- **Caching**: Aggressive caching strategies for static assets

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy Convex

\`\`\`bash
npx convex deploy
\`\`\`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Vercel](https://vercel.com/) - Hosting and deployment
- [Stream](https://getstream.io/) - Chat and video infrastructure
- [Clerk](https://clerk.com/) - Authentication
- [Convex](https://www.convex.dev/) - Backend database
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## 📧 Contact

For questions or support, please open an issue or contact:

- **Email**: alifouanne8@gmail.com

---

<div align="center">
  Made with ❤️ by the Lynk Team
  <br />
  <br />
</div>
