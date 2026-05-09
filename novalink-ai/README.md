# NovaLink AI - Full Stack Video Chat Platform

## 🚀 Project Overview

NovaLink AI is a **production-ready**, **AI-powered**, and **futuristic** video chat platform inspired by Omegle but with cutting-edge features, advanced safety, and enterprise-level scalability.

### 🎯 Key Features

#### Core Communication
- **Instant Random Video Matching** - One-click connection with users worldwide
- **HD Video & Voice Chat** - Crystal-clear communication with WebRTC
- **Text Chat** - Real-time messaging with encryption
- **Screen Sharing** - Share screens during video calls
- **Live Translation** - Real-time multi-language translation
- **Voice Enhancement** - AI-powered audio quality improvement

#### AI Intelligence
- **Smart Matchmaking** - AI analyzes interests, personality, preferences
- **Conversation Starters** - AI generates engaging conversation topics
- **Personality Matching** - Compatibility scoring algorithm
- **Emotion Detection** - Real-time sentiment analysis
- **Chat Assistant** - AI chatbot when no users are online
- **Content Moderation** - AI NSFW and toxicity detection

#### Safety & Security
- **Face Verification** - Verify real profiles with AI
- **Toxicity Detection** - Automatic detection of harmful content
- **Screenshot Protection** - Prevent unauthorized screen captures
- **Advanced Reporting** - Comprehensive user reporting system
- **Auto-Ban System** - Automatic ban for policy violations
- **End-to-End Encryption** - Secure message encryption
- **Human Moderation** - Admin dashboard for manual review

#### Gamification & Community
- **XP System** - Earn experience points for interactions
- **Level System** - Progress through levels and unlock features
- **Badges** - Achievement badges for milestones
- **Rewards Economy** - Earn tokens and gifts
- **Creator Monetization** - Streamers can earn money
- **Group Rooms** - Public and private group video calls
- **Friend System** - Add friends and reconnect

#### Premium Features
- **Multiple Subscription Tiers** - Free, Premium, Pro, Enterprise
- **Creator Dashboard** - Streaming and monetization tools
- **Advanced Analytics** - Detailed stats for premium users
- **Ad-Free Experience** - Premium users see no ads
- **Virtual Avatars** - Animated avatars and filters
- **AR Filters** - Real-time augmented reality effects
- **Priority Matching** - Faster match finding

#### Admin & Moderation
- **Admin Dashboard** - Complete platform management
- **Live Monitoring** - Real-time user activity tracking
- **User Management** - Ban, verify, manage users
- **Report Handling** - Review and resolve reports
- **Analytics Dashboard** - Comprehensive statistics
- **Revenue Tracking** - Monitor platform revenue

## 🏗️ Architecture

### Frontend Stack
- **Framework**: Next.js 14 with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Real-time**: Socket.io Client
- **WebRTC**: Simple Peer
- **UI Components**: Custom components + Lucide Icons
- **Deployment**: Vercel

### Backend Stack
- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Language**: TypeScript
- **Real-time**: Socket.io
- **Database**: MongoDB
- **Caching**: Redis
- **Authentication**: JWT
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Pino
- **Deployment**: AWS / Docker

### AI/ML Services
- **Translation**: Google Cloud Translate API
- **Content Moderation**: Hugging Face AI models
- **Recommendations**: OpenAI GPT-3.5
- **Face Detection**: Hugging Face
- **Emotion Detection**: Hugging Face
- **Toxicity Detection**: Hugging Face

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions (example configs included)
- **Deployment**: Vercel (Frontend) + AWS (Backend)
- **Database Hosting**: MongoDB Atlas
- **Caching**: Redis Cloud
- **Media Storage**: AWS S3
- **CDN**: AWS CloudFront

## 📁 Project Structure

```
novalink-ai/
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js pages
│   │   │   ├── page.tsx            # Landing page
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── dashboard/
│   │   │   ├── match/
│   │   │   ├── admin/
│   │   │   ├── profile/
│   │   │   └── settings/
│   │   ├── components/
│   │   │   ├── common/             # Reusable components
│   │   │   ├── video/              # Video chat components
│   │   │   └── chat/               # Chat components
│   │   ├── lib/                    # Utilities
│   │   │   ├── api-client.ts
│   │   │   └── socket.ts
│   │   ├── store/                  # Zustand stores
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── utils/                  # Helper functions
│   │   └── styles/                 # Global styles
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── Dockerfile
│
├── backend/
│   ├── src/
│   │   ├── index.ts                # Entry point
│   │   ├── routes/                 # API routes
│   │   │   ├── auth.ts
│   │   │   ├── users.ts
│   │   │   ├── chat.ts
│   │   │   ├── match.ts
│   │   │   └── admin.ts
│   │   ├── controllers/            # Route handlers
│   │   ├── models/                 # Database models
│   │   ├── middleware/             # Express middleware
│   │   ├── services/               # Business logic
│   │   ├── ai/                     # AI integrations
│   │   │   ├── moderation.ts
│   │   │   ├── translation.ts
│   │   │   └── recommendations.ts
│   │   ├── utils/                  # Utilities
│   │   └── config/                 # Configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── docs/                           # Documentation
├── docker-compose.yml
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB instance (local or Atlas)
- Redis instance
- API keys for:
  - OpenAI
  - Google Cloud Translate
  - Hugging Face
  - (Optional) AWS S3, Stripe

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/novalink-ai.git
   cd novalink-ai
   ```

2. **Setup Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start with Docker (Recommended)**
   ```bash
   docker-compose up -d
   # Frontend: http://localhost:3000
   # Backend: http://localhost:5000
   ```

   OR **Manual Start**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## 📚 API Documentation

### Authentication Endpoints

**POST /api/auth/register**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**POST /api/auth/login**
```json
{
  "email": "string",
  "password": "string"
}
```

### User Endpoints

**GET /api/users/profile** (Requires Auth)
- Get current user profile

**PUT /api/users/profile** (Requires Auth)
- Update user profile

**GET /api/users/:userId**
- Get public user profile

### Matching Endpoints

**POST /api/match/random** (Requires Auth)
- Find random match

**GET /api/match/recommendations** (Requires Auth)
- Get AI recommendations

**POST /api/match/:matchId/rate** (Requires Auth)
- Rate a match

### Chat Endpoints

**POST /api/chat/send** (Requires Auth)
- Send message

**GET /api/chat/history/:roomId** (Requires Auth)
- Get chat history

**PUT /api/chat/:messageId/read** (Requires Auth)
- Mark message as read

## 🎮 Socket.io Events

### Client → Server
- `join-room` - Join a video chat room
- `offer` - WebRTC offer signal
- `answer` - WebRTC answer signal
- `ice-candidate` - ICE candidate for WebRTC
- `chat-message` - Send chat message

### Server → Client
- `user-joined` - New user joined room
- `offer` - Receive WebRTC offer
- `answer` - Receive WebRTC answer
- `ice-candidate` - Receive ICE candidate
- `chat-message` - Receive chat message
- `user-disconnected` - User left room

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs with 10 rounds
- **CORS** - Cross-origin security
- **Helmet** - HTTP security headers
- **Rate Limiting** - Prevent abuse
- **Input Validation** - XSS and injection prevention
- **End-to-End Encryption** - Message encryption
- **HTTPS Only** - Enforce secure connections in production

## 📊 Database Schema

See `/backend/src/models/` for all schemas:
- `User` - User profiles and preferences
- `Match` - Matching records
- `Message` - Chat messages
- `Report` - User reports
- `Room` - Video chat rooms
- `Reward` - Rewards and achievements
- `Subscription` - User subscriptions
- `FriendRequest` - Friend requests
- `Notification` - Notifications

## 🧪 Testing

```bash
# Run tests
npm run test

# Run with coverage
npm run test:coverage

# Lint code
npm run lint
```

## 📈 Performance Optimization

- **Code Splitting** - Lazy loading of components
- **Image Optimization** - Next.js image optimization
- **Media Streaming** - Adaptive bitrate for video
- **Caching** - Redis caching for frequently accessed data
- **Database Indexing** - Optimized MongoDB indexes
- **CDN** - AWS CloudFront for static assets
- **Compression** - GZIP compression for responses

## 🌐 Deployment

### Frontend (Vercel)
1. Connect GitHub repository
2. Set environment variables
3. Deploy

### Backend (AWS)
1. Create EC2 instance or use Elastic Beanstalk
2. Deploy Docker container
3. Setup RDS for MongoDB
4. Configure security groups
5. Setup CloudFront CDN

### Docker Deployment
```bash
docker-compose up -d
```

## 📖 Additional Documentation

- [API Documentation](./docs/API.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Contributing Guide](./docs/CONTRIBUTING.md)

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Documentation: [docs/](./docs/)
- Issues: [GitHub Issues](https://github.com/yourusername/novalink-ai/issues)
- Email: support@novalink.ai

## 🎉 Acknowledgments

- Inspired by Omegle and modern chat platforms
- Built with cutting-edge web technologies
- Powered by AI and machine learning

---

**NovaLink AI** - Where Futures Meet 🚀✨
