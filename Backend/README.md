# ScamAlert Backend - MERN Stack

## Overview

This is the backend infrastructure for ScamAlert by TrustGuardUnit, built using the MERN stack (MongoDB, Express.js, React, Node.js).

## Architecture

```
Backend/
├── src/
│   ├── config/          # Database and app configuration
│   ├── controllers/     # Route handlers and business logic
│   ├── middleware/      # Authentication, validation, error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API route definitions
│   ├── services/        # External service integrations (AI, Blockchain)
│   └── utils/           # Helper functions
├── .env.example         # Environment variables template
├── package.json         # Dependencies
└── server.js            # Application entry point
```

## Tech Stack

### Core
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB

### AI & ML Services
- **OpenAI GPT-4.1** - Scam message understanding and risk scoring
- **Google Cloud Speech-to-Text** - Voice call analysis
- **AWS SageMaker** - Custom fraud detection models

### Blockchain & Messaging
- **AWS Managed Blockchain** - Immutable message logging
- **Amazon QLDB** - Cryptographically verifiable audit trails
- **AWS SNS** - Large-scale SMS delivery

### Cloud Infrastructure
- **AWS Lambda** - Serverless compute
- **Amazon API Gateway** - Secure API management
- **Amazon DynamoDB** - Real-time scam reputation storage
- **Amazon Cognito** - User authentication
- **Amazon S3** - Encrypted evidence storage

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `GET /api/auth/me` - Get current user

### Fraud Detection
- `POST /api/analyze/sms` - Analyze SMS for fraud
- `POST /api/analyze/call` - Analyze call audio
- `POST /api/analyze/number` - Check number reputation
- `GET /api/analyze/history` - Get user's analysis history

### Reporting
- `POST /api/reports` - Submit fraud report
- `GET /api/reports` - Get community reports
- `PUT /api/reports/:id/vote` - Vote on report

### TrustCard
- `POST /api/trustcard/create` - Create virtual card
- `GET /api/trustcard/balance` - Get card balance
- `POST /api/trustcard/load` - Load funds
- `GET /api/trustcard/transactions` - Transaction history

### Blockchain
- `POST /api/blockchain/log` - Log message to blockchain
- `GET /api/blockchain/verify/:hash` - Verify message integrity

## Setup

1. Install dependencies:
```bash
cd Backend
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Start development server:
```bash
npm run dev
```

4. Run production:
```bash
npm start
```

## Environment Variables

See `.env.example` for required configuration.
