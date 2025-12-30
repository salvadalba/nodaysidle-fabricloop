# FabricLoop 🧵

A B2B circular economy marketplace for textile waste with Digital Product Passports for Scope 3 emission compliance.

![FabricLoop](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌟 Features

- **Material Marketplace** - Trade sustainable textiles with verified sustainability data
- **Digital Product Passports** - Complete traceability with supply chain tracking
- **Sustainability Metrics** - Carbon footprint, water usage, and chemical composition tracking
- **Scope 3 Compliance** - Built-in emission tracking for regulatory compliance
- **Real-time Messaging** - Direct communication between manufacturers and brands

## 🎨 Design

- Dark matte theme with soft dusty rose/pink accent colors
- Modern, premium UI with glassmorphism effects
- Consistent design language across all pages
- Mobile-responsive layout

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation

### Backend

- **Express.js** with TypeScript
- **PostgreSQL** for data persistence
- **Redis** for caching (optional)
- **JWT** for authentication
- **Zod** for validation

### Infrastructure

- **Docker** for local development
- **Vercel** for frontend deployment
- **Railway/Render** for backend deployment

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/fabricloop.git
   cd fabricloop
   ```

2. **Start the database**

   ```bash
   docker-compose up -d
   ```

3. **Install dependencies**

   ```bash
   # Install root, backend, and frontend dependencies
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

4. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

5. **Run migrations and seed**

   ```bash
   cd backend
   npm run seed
   ```

6. **Start development servers**

   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

7. **Open in browser**
   - Frontend: <http://localhost:3000>
   - Backend API: <http://localhost:8000>

### Demo Credentials

| Email | Password |
|-------|----------|
| `test@fabricloop.com` | `TestPass123` |

## 📁 Project Structure

```
fabricloop/
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── index.css        # Global styles
│   └── public/
│       └── images/          # Static assets
│
├── backend/                 # Express backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   └── config/          # Configuration
│   └── migrations/          # Database migrations
│
├── docker-compose.yml       # Docker services
└── .env.example             # Environment template
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Materials

- `GET /api/materials` - Search materials
- `GET /api/materials/:id` - Get material details
- `GET /api/materials/my` - Get user's listings
- `POST /api/materials` - Create listing
- `PUT /api/materials/:id` - Update listing
- `DELETE /api/materials/:id` - Delete listing

### Digital Product Passports

- `GET /api/passports/verify/:number` - Public verification
- `GET /api/passports/material/:id` - Get passport by material
- `POST /api/passports` - Create passport

### Messages

- `GET /api/messages` - Get conversations
- `GET /api/messages/:partnerId` - Get message history
- `POST /api/messages` - Send message

## 🌱 Environment Variables

```env
# Server
NODE_ENV=development
PORT=8000
API_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://fabricloop:password@localhost:5499/fabricloop

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Optional
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 📱 Screenshots

### Homepage

Dark, elegant landing page with feature highlights

### Dashboard

Personalized dashboard with stats and activity feed

### Materials Marketplace

Browse and search sustainable materials

### Material Details

Full material info with Digital Product Passport

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for sustainable fashion
- Fabric textures generated with AI (Nano Banana)
