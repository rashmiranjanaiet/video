# API Documentation

## Authentication

All endpoints except `/api/auth/register` and `/api/auth/login` require JWT token in header:
```
Authorization: Bearer <token>
```

## Endpoints

### Auth Routes

#### Register User
**POST** `/api/auth/register`

Request:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response (201):
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### Login User
**POST** `/api/auth/login`

Request:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response (200):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "verified": true,
    "xp": 1500,
    "level": 5
  }
}
```

### User Routes

#### Get Profile
**GET** `/api/users/profile`

Response (200):
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "avatar": "https://...",
    "bio": "I love traveling and meeting new people",
    "verified": true,
    "xp": 1500,
    "level": 5,
    "badges": ["early_adopter", "verified"],
    "stats": {
      "totalChats": 42,
      "totalMinutes": 1240,
      "avgRating": 4.8
    },
    "preferences": {
      "gender": "any",
      "ageRange": { "min": 18, "max": 35 },
      "language": "en",
      "interests": ["travel", "tech", "gaming"],
      "countryCode": "US"
    }
  }
}
```

#### Update Profile
**PUT** `/api/users/profile`

Request:
```json
{
  "bio": "Updated bio",
  "avatar": "https://...",
  "preferences": {
    "interests": ["travel", "music"],
    "language": "en"
  }
}
```

Response (200):
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

#### Get Public User Profile
**GET** `/api/users/:userId`

Response (200):
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "avatar": "https://...",
    "bio": "I love traveling",
    "verified": true,
    "level": 5,
    "badges": ["early_adopter"],
    "stats": {
      "totalChats": 42,
      "totalMinutes": 1240,
      "avgRating": 4.8
    }
  }
}
```

### Matching Routes

#### Find Random Match
**POST** `/api/match/random`

Response (200):
```json
{
  "match": {
    "matchId": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439013",
    "username": "jane_doe",
    "avatar": "https://...",
    "level": 3,
    "matchScore": 87
  }
}
```

#### Get Recommendations
**GET** `/api/match/recommendations`

Query Parameters:
- `limit`: number (default: 10)
- `offset`: number (default: 0)

Response (200):
```json
{
  "matches": [
    {
      "userId": "507f1f77bcf86cd799439013",
      "username": "jane_doe",
      "avatar": "https://...",
      "level": 3,
      "bio": "Love hiking and photography",
      "matchScore": 87
    }
  ]
}
```

#### Rate Match
**POST** `/api/match/:matchId/rate`

Request:
```json
{
  "rating": 5
}
```

Response (200):
```json
{
  "message": "Rating submitted successfully"
}
```

### Chat Routes

#### Send Message
**POST** `/api/chat/send`

Request:
```json
{
  "receiverId": "507f1f77bcf86cd799439013",
  "roomId": "room_507f1f77bcf86cd799439014",
  "content": "Hey, how are you?",
  "type": "text"
}
```

Response (201):
```json
{
  "message": "Message sent successfully",
  "data": {
    "id": "507f1f77bcf86cd799439015",
    "senderId": "507f1f77bcf86cd799439011",
    "receiverId": "507f1f77bcf86cd799439013",
    "roomId": "room_507f1f77bcf86cd799439014",
    "content": "Hey, how are you?",
    "type": "text",
    "isEncrypted": true,
    "read": false,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get Chat History
**GET** `/api/chat/history/:roomId`

Query Parameters:
- `limit`: number (default: 100)
- `offset`: number (default: 0)

Response (200):
```json
{
  "messages": [
    {
      "id": "507f1f77bcf86cd799439015",
      "senderId": "507f1f77bcf86cd799439011",
      "content": "Hey, how are you?",
      "type": "text",
      "read": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Mark Message as Read
**PUT** `/api/chat/:messageId/read`

Response (200):
```json
{
  "message": {
    "id": "507f1f77bcf86cd799439015",
    "read": true
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 409 Conflict
```json
{
  "error": "User already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

API is rate limited to 100 requests per 15 minutes per IP address.

## WebSocket Events

### Connection
```javascript
socket.on('connect', () => {
  console.log('Connected:', socket.id);
});
```

### Join Room
```javascript
socket.emit('join-room', 'roomId');
socket.on('user-joined', (data) => {
  console.log('User joined:', data.userId);
});
```

### Send Offer
```javascript
socket.emit('offer', {
  roomId: 'roomId',
  offer: signalData
});
socket.on('offer', (data) => {
  console.log('Received offer from:', data.from);
});
```

### Send Answer
```javascript
socket.emit('answer', {
  roomId: 'roomId',
  answer: signalData
});
socket.on('answer', (data) => {
  console.log('Received answer from:', data.from);
});
```

### ICE Candidate
```javascript
socket.emit('ice-candidate', {
  roomId: 'roomId',
  candidate: iceCandidate
});
socket.on('ice-candidate', (data) => {
  console.log('Received ICE candidate from:', data.from);
});
```

### Chat Message
```javascript
socket.emit('chat-message', {
  roomId: 'roomId',
  message: 'Hello!'
});
socket.on('chat-message', (data) => {
  console.log('Message from', data.from, ':', data.message);
});
```
