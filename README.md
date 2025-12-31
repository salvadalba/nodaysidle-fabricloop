# 🌿 FabricLoop

**B2B Circular Economy Marketplace for Sustainable Textiles**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge)](https://fabricloop.vercel.app)
[![Backend](https://img.shields.io/badge/api-render-blue?style=for-the-badge)](https://fabricloop-api.onrender.com)

FabricLoop connects textile manufacturers with fashion brands to trade deadstock fabric, reducing waste while providing full sustainability tracking through Digital Product Passports.

---

## ✨ Features

### For Buyers (Fashion Brands)

- 🔍 Browse sustainable materials with detailed specs
- 🛒 Shopping cart with quantity controls
- 📋 Order tracking and history
- 🌱 Carbon footprint visibility per material

### For Sellers (Manufacturers)

- 📦 List excess inventory and deadstock
- 📊 Dashboard with sales analytics
- 💰 Revenue and CO₂e impact tracking
- 📈 Order management

### Platform

- 🔐 Secure JWT authentication
- 🎨 Modern eco-themed UI (dark mode)
- 📱 Fully responsive design
- ⚡ Real-time inventory updates

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **State** | Zustand (cart persistence) |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL (Render) |
| **Auth** | JWT with refresh tokens |
| **Hosting** | Vercel (frontend), Render (backend) |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/salvadalba/nodaysidle-fabricloop.git
cd nodaysidle-fabricloop

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and JWT secrets

# Run database migrations
npm run db:migrate

# Start development servers
npm run dev
```

### Environment Variables

```env
# Backend
DATABASE_URL=postgresql://user:pass@host:5432/fabricloop
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
FRONTEND_URL=http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:8000/api
```

---

## 🎨 Design System

FabricLoop uses an eco-sustainable color palette:

| Color | Hex | Usage |
|-------|-----|-------|
| 🟢 Primary | `#A7D930` | Buttons, accents, CTAs |
| 🔵 Secondary | `#0D9488` | Badges, eco indicators |
| 🌲 Background | `#0A0F0A` | Dark forest theme |
| ⬜ Text | `#F0F5F0` | Primary content |

---

## 📁 Project Structure

```
fabricloop/
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── pages/      # Route components
│   │   ├── stores/     # Zustand state (cart)
│   │   ├── services/   # API client
│   │   └── index.css   # Tailwind + design tokens
│   └── package.json
│
├── backend/            # Express API
│   ├── src/
│   │   ├── routes/     # API endpoints
│   │   ├── services/   # Business logic
│   │   ├── middleware/ # Auth, validation
│   │   └── config/     # Database, env
│   └── package.json
│
└── README.md
```

---

## 🌍 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/materials` | List materials |
| POST | `/api/transactions` | Create order |
| GET | `/api/transactions` | Get user orders |
| GET | `/api/analytics/dashboard` | Seller stats |

---

## 🔮 Roadmap

- [x] User authentication
- [x] Material marketplace
- [x] Shopping cart
- [x] Order management
- [x] Order confirmation emails
- [ ] Digital Product Passports (DPP)
- [ ] Stripe payment integration
- [ ] Real-time messaging

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT © 2024 FabricLoop

---

<p align="center">
  <strong>🌱 Building a more sustainable textile industry, one transaction at a time.</strong>
</p>
