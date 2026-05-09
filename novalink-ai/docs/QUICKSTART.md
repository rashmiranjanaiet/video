# Quick Start Guide

## 🚀 5-Minute Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB connection (use MongoDB Atlas for free)
- Redis connection (use Redis Cloud for free)

### Step 1: Clone & Install
```bash
git clone https://github.com/yourusername/novalink-ai.git
cd novalink-ai
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your values:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/novalink
REDIS_URL=redis://:@localhost:6379
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Step 3: Start Development Servers

**Option A: Docker (Recommended)**
```bash
docker-compose up -d
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

**Option B: Manual Setup**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Step 4: Access the Application
- Frontend: http://localhost:3000
- API: http://localhost:5000/health
- Admin Panel: http://localhost:3000/admin

## 📝 First Steps

### 1. Register an Account
- Go to http://localhost:3000
- Click "Get Started"
- Fill in registration form
- You'll be logged in automatically

### 2. Set Up Your Profile
- Go to Profile page
- Add avatar and bio
- Set your interests and preferences
- Save changes

### 3. Find a Match
- Go to Dashboard
- Click "Find a Match"
- Or view "Recommendations"
- Start chatting!

### 4. Explore Features
- Try text chat
- Test video calling
- Explore admin panel
- Check settings

## 🔑 Default Test Accounts

Admin Account:
```
Email: admin@novalink.ai
Password: admin123456
```

Test User:
```
Email: test@novalink.ai
Password: test123456
```

## 📚 Common Commands

```bash
# Development
npm run dev                 # Start all services
cd frontend && npm run dev  # Frontend only
cd backend && npm run dev   # Backend only

# Building
npm run build              # Build all
npm run build --workspace=frontend  # Build frontend

# Testing
npm run test               # Run all tests
npm run lint              # Run linter

# Database
npm run seed              # Seed test data (backend)
npm run migrate           # Run migrations (backend)

# Docker
docker-compose up -d      # Start services
docker-compose down       # Stop services
docker-compose logs -f    # View logs
```

## 🆘 Troubleshooting

### Can't connect to MongoDB?
```bash
# Check connection string in .env
# Test connection:
mongosh "your-connection-string"
```

### Redis connection failed?
```bash
# Make sure Redis is running
redis-cli ping  # Should return PONG
```

### Ports already in use?
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>
```

### Dependencies not installing?
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 🎯 Next Steps

1. **Read Documentation**
   - [API Documentation](./docs/API.md)
   - [Architecture Guide](./docs/ARCHITECTURE.md)
   - [Deployment Guide](./docs/DEPLOYMENT.md)

2. **Explore the Code**
   - Check frontend components in `frontend/src/components/`
   - Review backend routes in `backend/src/routes/`
   - Understand data models in `backend/src/models/`

3. **Try Features**
   - Create multiple test accounts
   - Test video chat functionality
   - Try different matching preferences
   - Test admin panel features

4. **Deploy (Optional)**
   - Follow [Deployment Guide](./docs/DEPLOYMENT.md)
   - Deploy frontend to Vercel
   - Deploy backend to AWS/EC2

## 📞 Support

- 📚 [Full Documentation](./docs/)
- 🐛 [GitHub Issues](https://github.com/yourusername/novalink-ai/issues)
- 📧 support@novalink.ai

## 💡 Tips

- Use browser DevTools to debug frontend
- Check server logs: `docker-compose logs -f backend`
- Test WebRTC: Use two browser windows side-by-side
- Admin email can be changed in `.env` (ADMIN_EMAIL)

## 🎉 You're Ready!

Start developing with NovaLink AI. Happy coding! 🚀✨
