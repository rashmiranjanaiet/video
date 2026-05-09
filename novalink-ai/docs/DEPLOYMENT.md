# Deployment Guide

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub repository

### Step 1: Connect to Vercel
1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repository
4. Click "Import"

### Step 2: Configure Environment Variables
1. Go to Project Settings → Environment Variables
2. Add the following variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.com
   NEXT_PUBLIC_STRIPE_KEY=pk_live_xxx
   ```

### Step 3: Deploy
1. Click "Deploy"
2. Your frontend will be live at `your-project.vercel.app`

## Backend Deployment (AWS)

### Option 1: EC2 + Docker

#### Prerequisites
- AWS Account
- Docker installed

#### Step 1: Create EC2 Instance
1. Go to AWS Console
2. Create new EC2 instance (Ubuntu 22.04)
3. Security Group: Allow ports 80, 443, 5000
4. Create and download key pair

#### Step 2: SSH into Instance
```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@your-instance-ip
```

#### Step 3: Install Dependencies
```bash
sudo apt update
sudo apt install -y docker.io docker-compose

sudo usermod -aG docker ubuntu
```

#### Step 4: Clone Repository
```bash
cd ~
git clone https://github.com/yourusername/novalink-ai.git
cd novalink-ai
```

#### Step 5: Configure Environment
```bash
cp .env.example .env
# Edit .env with production values
nano .env
```

#### Step 6: Start Services
```bash
docker-compose -f docker-compose.yml up -d
```

#### Step 7: Setup SSL (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot certonly --standalone -d yourdomain.com
```

#### Step 8: Configure Nginx
```bash
# Install Nginx
sudo apt install nginx -y

# Create reverse proxy config
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

### Option 2: AWS Elastic Beanstalk

#### Step 1: Install EB CLI
```bash
pip install awsebcli
```

#### Step 2: Initialize EB Application
```bash
cd backend
eb init -p "Node.js 20" novalink-api
```

#### Step 3: Configure Environment Variables
```bash
eb setenv DATABASE_URL=your_mongodb_url \
  REDIS_URL=your_redis_url \
  JWT_SECRET=your_secret \
  OPENAI_API_KEY=your_key
```

#### Step 4: Create Environment and Deploy
```bash
eb create production
eb deploy
```

## Database Setup

### MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Create a database user
4. Get connection string
5. Add to `.env`:
   ```
   DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/novalink
   ```

### Redis Cloud

1. Go to https://redis.com/cloud
2. Create a database
3. Get connection string
4. Add to `.env`:
   ```
   REDIS_URL=redis://...
   ```

## CI/CD Setup

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t novalink-backend:latest ./backend

      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push your-registry/novalink-backend:latest

      - name: Deploy to AWS
        run: |
          # Add your deployment script here
```

## Monitoring & Logging

### CloudWatch Setup
```bash
# Install CloudWatch agent on EC2
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
```

### Sentry Setup
```bash
# Add to backend .env
SENTRY_DSN=your_sentry_dsn

# Initialize in your app
import * as Sentry from "@sentry/node";
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

## Performance Tuning

### MongoDB Indexes
```javascript
// Optimize frequently queried fields
db.users.createIndex({ email: 1 });
db.users.createIndex({ username: 1 });
db.messages.createIndex({ roomId: 1, createdAt: -1 });
```

### Redis Caching
```javascript
// Cache frequently accessed data
const cacheKey = `user:${userId}`;
const cached = await redis.get(cacheKey);
if (!cached) {
  const data = await User.findById(userId);
  await redis.setex(cacheKey, 3600, JSON.stringify(data));
}
```

## Troubleshooting

### Common Issues

#### Docker not starting
```bash
sudo systemctl restart docker
docker-compose logs
```

#### Database connection timeout
- Check MongoDB connection string
- Verify IP whitelist in MongoDB Atlas
- Check firewall rules

#### CORS errors
- Verify FRONTEND_URL in backend .env
- Check CORS configuration in Express

#### WebSocket connection issues
- Check WebSocket port is open
- Verify Socket.io transports
- Check for proxy/firewall issues

## Scaling Considerations

- **Load Balancing**: Use AWS ALB for multiple backend instances
- **Database**: Consider MongoDB replication
- **Caching**: Scale Redis appropriately
- **CDN**: Use CloudFront for static assets
- **WebRTC**: Consider TURN server for better connectivity
