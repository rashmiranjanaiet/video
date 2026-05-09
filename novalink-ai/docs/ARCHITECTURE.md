# Architecture Guide

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Users (Clients)                       │
└────────┬────────────────────────────────────────────────┬────┘
         │                                                 │
         │ HTTP + WebSocket                               │ WebRTC P2P
         │                                                 │
    ┌────▼──────────────────────────────────────────────┐ │
    │          Frontend (Next.js + React)                 │ │
    │  ├─ Landing Page                                    │ │
    │  ├─ Auth Pages (Login/Register)                    │ │
    │  ├─ Dashboard                                      │ │
    │  ├─ Video Chat Component                           │ │ 
    │  ├─ Matching Engine UI                             │ │
    │  └─ Admin Panel                                    │ │
    │                                                     │ │
    │  State Management: Zustand                         │ │
    │  Real-time: Socket.io Client                       │ │
    │  WebRTC: Simple Peer                               │ │
    │  Styling: Tailwind CSS + Framer Motion             │ │
    └────┬──────────────────────────────────────────────┘ │
         │                                                 │
         └────────┬──────────────────────┬────────────────┘
                  │                      │
              API Calls              WebRTC Signals
                  │                      │
    ┌─────────────▼──────────────────────▼──────────────┐
    │      API Gateway / Load Balancer                   │
    │      (AWS ALB or Nginx)                            │
    └─────────────┬──────────────────────────────────────┘
                  │
    ┌─────────────▼──────────────────────────────────────┐
    │      Backend (Express.js + Node.js)                │
    │  ├─ Authentication Routes                          │
    │  ├─ User Routes                                    │
    │  ├─ Match/Recommendation Routes                    │
    │  ├─ Chat Routes                                    │
    │  ├─ Admin Routes                                   │
    │  └─ WebRTC Signaling Server                        │
    │                                                     │
    │  Socket.io for Real-time Events                    │
    │  JWT Authentication Middleware                     │
    │  Rate Limiting & Security                          │
    └─────────────┬──────────────────────────────────────┘
                  │
        ┌─────────┼─────────┬──────────────┐
        │         │         │              │
    ┌───▼──┐  ┌──▼──┐  ┌──▼──┐        ┌──▼──────┐
    │      │  │     │  │     │        │         │
    │ DB   │  │Cache│  │Queue│        │  AI    │
    │      │  │     │  │     │        │Services│
    └──────┘  └─────┘  └─────┘        └────────┘
    MongoDB   Redis    Bull/RabbitMQ   OpenAI
                                        GCP/HF
```

## Component Architecture

### Frontend Components Hierarchy

```
App (Root)
├── Layout
│   ├── Navigation
│   └── Footer
├── Auth Pages
│   ├── Login
│   ├── Register
│   └── ForgotPassword
├── Dashboard
│   ├── UserStats
│   ├── RecentConnections
│   └── ActionButtons
├── Matching Flow
│   ├── Preferences
│   ├── Recommendation List
│   └── Match Selection
├── Video Chat
│   ├── VideoRoom
│   │   ├── RemoteVideo
│   │   ├── LocalVideo (PiP)
│   │   └── Controls (Mute, Video, Share)
│   └── ChatBox
│       ├── MessageInput
│       └── MessageList
├── Profile
│   ├── ProfileView
│   └── ProfileEdit
├── Admin Panel
│   ├── Stats Dashboard
│   ├── User Management
│   ├── Report Handling
│   └── Moderation Tools
└── Settings
    ├── Privacy Settings
    ├── Notification Settings
    └── Account Settings
```

### Backend API Structure

```
/api/
├── /auth
│   ├── POST /register
│   └── POST /login
├── /users
│   ├── GET /profile
│   ├── PUT /profile
│   └── GET /:userId
├── /match
│   ├── POST /random
│   ├── GET /recommendations
│   └── POST /:matchId/rate
├── /chat
│   ├── POST /send
│   ├── GET /history/:roomId
│   └── PUT /:messageId/read
└── /admin
    ├── GET /stats
    ├── GET /users
    ├── POST /users/:userId/ban
    ├── GET /reports
    ├── PUT /reports/:reportId
    └── GET /analytics
```

## Data Flow Diagrams

### User Registration Flow
```
Frontend                Backend              Database
   │                      │                      │
   ├─ Register ─────────> │                      │
   │                      ├─ Validate ──────────>│
   │                      │<─ Check (exists?) ───┤
   │                      ├─ Hash Password      │
   │                      ├─ Create User ──────>│
   │                      │<─ User Created ─────┤
   │                      ├─ Generate JWT ──────>│
   │                      │<─ Return Token ──────│
   │<─ Success + Token ─── │                     │
```

### Video Chat Flow
```
User A                  Signaling Server           User B
   │                         │                       │
   ├─ Join Room ────────────>│                       │
   │                         ├─ Broadcast ────────>│ Join Notification
   │<─ User Joined ───────────│                       │
   │                         │                       │
   ├─ Create Offer ──────────────────────────────>│
   │                         │ ←─ Answer ─────────┤
   │<──────────────────────────────────────────────┤
   │                         │                       │
   ├─ ICE Candidates ───────────────────────────>│
   │<────────────────────────────────────────────┤
   │                         │                       │
   ├════════ P2P WebRTC Connection Established ════┤
   │◄════════════ Audio/Video Stream ══════════════►
```

## Technology Choices

### Why Next.js?
- Server-side rendering for better SEO
- API routes for backend
- Excellent performance optimization
- Great developer experience
- Static site generation

### Why Express.js?
- Lightweight and flexible
- Large ecosystem
- Perfect for REST APIs
- Easy middleware integration
- Excellent for Socket.io

### Why MongoDB?
- Flexible schema for evolving features
- Great for document-based data
- Horizontal scalability
- Good driver support
- BSON format for rich types

### Why Socket.io?
- Real-time bidirectional communication
- Automatic fallbacks
- Room management
- Event-based architecture
- Excellent for WebRTC signaling

### Why WebRTC?
- P2P connection (lower latency)
- No server bandwidth for media
- Encrypted by default
- Standard web technology
- Mobile support

## Scalability Considerations

### Horizontal Scaling
- Load balancer (AWS ALB) distributes requests
- Multiple backend instances
- Shared database (MongoDB)
- Shared cache (Redis)
- Session store (Redis)

### Database Optimization
- Proper indexing
- Connection pooling
- Query optimization
- Sharding for large datasets

### Caching Strategy
- User profiles: 1 hour TTL
- Recommendations: 30 minutes TTL
- Session data: 24 hours TTL
- Match history: 7 days TTL

### WebSocket Scaling
- Redis Adapter for multiple server instances
- Proper room management
- Connection pooling
- Memory management

## Security Architecture

### Authentication
- JWT tokens with 7-day expiry
- Refresh token rotation
- Secure token storage (HttpOnly cookies)
- Rate limiting on auth endpoints

### Authorization
- Role-based access control (RBAC)
- Admin verification middleware
- Resource ownership verification

### Data Protection
- Message encryption (AES-256)
- TLS/SSL for transport
- Password hashing (bcryptjs)
- Input validation & sanitization

### API Security
- CORS policy enforcement
- Rate limiting
- Request validation
- CSRF protection

## Monitoring & Observability

### Logging
- Structured logging (Pino)
- Request/response logging
- Error tracking (Sentry)
- Performance metrics

### Metrics
- API response times
- Database query times
- WebSocket connection count
- Message throughput

### Health Checks
- Database connectivity
- Redis connectivity
- API endpoint health
- WebRTC signaling server health
