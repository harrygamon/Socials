# Social - Modern Dating Platform

A modern, full-stack social-dating platform built with Next.js 14, TypeScript, and Tailwind CSS. Inspired by Instagram, Facebook, Snapchat, and Twitter, with Tinder-like discovery features.

## 🚀 Features

### Core Features
- **Feed with Stories and Posts** - Instagram-style feed with stories and social posts
- **Tinder-like Discovery** - Swipe cards for discovering new matches
- **Real-time Messaging** - Chat-style DMs with conversation management
- **User Profiles** - Comprehensive profile pages with photos and interests
- **Dark Mode Support** - Full dark/light theme switching
- **Responsive Design** - Mobile-first responsive design

### Authentication & Security
- **NextAuth.js Integration** - GitHub OAuth and Email authentication
- **JWT Sessions** - Secure session management
- **Protected Routes** - Authentication-based route protection

### Database & Storage
- **NeonDB (PostgreSQL)** - Scalable cloud database
- **Prisma ORM** - Type-safe database queries
- **Cloudinary Integration** - Image upload and optimization

### Premium Features
- **Stripe Integration** - Tiered subscriptions (Free, Silver, Gold)
- **Voice Notes** - Verbal API integration for voice messages
- **Advanced Matching** - Premium matching algorithms

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and interactions
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js** - Authentication solution
- **Prisma** - Database ORM
- **Stripe** - Payment processing
- **Cloudinary** - Image management

### Database
- **NeonDB** - Serverless PostgreSQL
- **Prisma Schema** - Type-safe database schema

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (main)/            # Main layout group
│   │   ├── feed/          # Feed page
│   │   ├── discover/      # Discovery/swipe page
│   │   ├── messages/      # Messaging page
│   │   ├── profile/       # Profile page
│   │   └── layout.tsx     # Main layout
│   ├── auth/              # Authentication pages
│   │   └── signin/        # Sign in page
│   ├── api/               # API routes
│   │   └── auth/          # NextAuth API
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── navbar.tsx        # Navigation bar
│   ├── sidebar.tsx       # Left sidebar
│   ├── right-sidebar.tsx # Right sidebar
│   ├── stories.tsx       # Stories component
│   ├── post-card.tsx     # Post display
│   ├── create-post.tsx   # Post creation
│   └── providers.tsx     # Context providers
├── lib/                  # Utility libraries
│   ├── auth.ts          # NextAuth configuration
│   ├── prisma.ts        # Prisma client
│   └── utils.ts         # Utility functions
├── types/               # TypeScript types
│   └── next-auth.d.ts   # NextAuth type extensions
└── prisma/              # Database schema
    └── schema.prisma    # Prisma schema
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (NeonDB recommended)
- GitHub OAuth app
- Stripe account
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd social
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/social"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   
   # GitHub OAuth
   GITHUB_ID="your-github-client-id"
   GITHUB_SECRET="your-github-client-secret"
   
   # Email (for email authentication)
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your-email@gmail.com"
   EMAIL_SERVER_PASSWORD="your-email-password"
   EMAIL_FROM="noreply@social.com"
   
   # Stripe
   STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
   STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
   STRIPE_WEBHOOK_SECRET="whsec_your-stripe-webhook-secret"
   
   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-cloudinary-api-key"
   CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
   
   # Verbal API (for voice notes)
   VERBAL_API_KEY="your-verbal-api-key"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

The application uses a comprehensive Prisma schema with the following main models:

- **User** - User profiles and authentication
- **Post** - Social media posts
- **Story** - Temporary stories (24-hour expiry)
- **Match** - User matches from discovery
- **Conversation** - Chat conversations
- **Message** - Individual messages
- **VoiceNote** - Voice messages
- **Swipe** - User swipe actions

## 🔐 Authentication

The platform supports multiple authentication methods:

1. **GitHub OAuth** - Social login with GitHub
2. **Email Magic Links** - Passwordless email authentication

## 💳 Subscription Tiers

- **Free** - Basic features, limited matches
- **Silver** - More matches, advanced filters
- **Gold** - Unlimited matches, priority support, voice notes

## 🎨 Design System

The application uses a comprehensive design system with:

- **Color Palette** - Primary and secondary color schemes
- **Typography** - Consistent font hierarchy
- **Components** - Reusable UI components
- **Animations** - Smooth transitions and micro-interactions
- **Dark Mode** - Full theme support

## 📱 Responsive Design

The platform is fully responsive with:

- **Mobile-first** approach
- **Breakpoint system** for different screen sizes
- **Touch-friendly** interactions
- **Optimized layouts** for all devices

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support, email harry.gamon@outlook.com or create an issue in the repository.

## 🔮 Roadmap

- [ ] Real-time notifications
- [ ] Video calling integration
- [ ] Advanced matching algorithms
- [ ] Group chat functionality
- [ ] Event planning features
- [ ] Mobile app development
- [ ] AI-powered recommendations
- [ ] Multi-language support

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS 