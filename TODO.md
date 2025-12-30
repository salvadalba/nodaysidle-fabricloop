# FabricLoop - Remaining Tasks

## Current Status

✅ **Completed:**
- Monorepo structure with frontend (React + Vite + Tailwind) and backend (Express + TypeScript + PostgreSQL)
- Docker Compose setup for PostgreSQL and Redis
- Database schema with 7 tables (migrations created)
- Express backend with middleware (CORS, compression, rate limiting, error handling)
- Winston logging with daily rotation
- Environment configuration with Zod validation
- React frontend with basic pages (Home, Login, Register, Layout)
- Authentication module (password hashing, JWT tokens, registration/login endpoints)

⚠️ **Issue Found:**
- PostgreSQL connection from host machine has authentication issues
- Need to either fix pg_hba.conf or run migrations from inside Docker container

---

## Immediate Tasks

### 1. Fix Database Connection Issue

The database migration fails because PostgreSQL can't find the "fabricloop" user when connecting from the host machine.

**Option A: Run migrations from inside Docker**
```bash
docker exec -i fabricloop-db psql -U fabricloop -d fabricloop < backend/migrations/001_create_users.sql
# ... repeat for all migration files
```

**Option B: Fix pg_hba.conf to allow password authentication**
```bash
# Add to docker-compose.yml:
command: ["postgres", "-c", "host=all=all=all=scram-sha-256"]
```

### 2. Complete Database Setup
```bash
# After fixing connection:
cd backend
npm run migrate
```

### 3. Start the Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## Remaining Backend Modules

### Materials Module (Priority: HIGH)
**Files to create:**
- `backend/src/services/database/materials.ts` - CRUD operations
- `backend/src/services/upload/image.ts` - Image upload service
- `backend/src/routes/materials.ts` - API endpoints
- `backend/src/middleware/validation/materials.schema.ts` - Validation schemas

**Endpoints:**
- POST /api/materials - Create material listing
- GET /api/materials - Search/filter materials
- GET /api/materials/:id - Get material details
- PUT /api/materials/:id - Update material
- DELETE /api/materials/:id - Delete material

### Search Module
**Files to create:**
- `backend/src/services/search/queryBuilder.ts` - Dynamic SQL query builder
- `backend/src/utils/pagination.ts` - Pagination utility
- `backend/src/services/search/search.ts` - Search service

**Features:**
- Filter by material_type, min_price, max_price, quantity
- Full-text search on title and description
- Pagination (default 20, max 100 per page)

### Transaction Module
**Files to create:**
- `backend/src/services/database/transactions.ts` - Data access layer
- `backend/src/services/transactions/stateMachine.ts` - Status transitions
- `backend/src/routes/transactions.ts` - API endpoints
- `backend/src/services/payments/stripe.ts` - Stripe integration

**Features:**
- Transaction workflow: pending → paid → shipped → completed
- Payment processing with Stripe
- Shipping address management

### Digital Product Passport Module
**Files to create:**
- `backend/src/services/database/sustainabilityMetrics.ts`
- `backend/src/services/database/passports.ts`
- `backend/src/routes/passports.ts`

**Features:**
- Track carbon_footprint, water_usage, chemical_composition
- Scope 3 emission calculations
- Supply chain tracking

### Messaging Module
**Files to create:**
- `backend/src/services/database/messages.ts`
- `backend/src/routes/messages.ts`

**Features:**
- User-to-user messaging
- Conversation threading
- Material context in messages
- Unread message counts

### Reporting Module
**Files to create:**
- `backend/src/services/reports/emissionCalculator.ts`
- `backend/src/services/reports/csvExport.ts`
- `backend/src/routes/reports.ts`

**Features:**
- Sustainability report generation
- CSV/PDF export
- Date range filtering

### Caching Layer (Redis)
**Files to create:**
- `backend/src/config/redis.ts`
- `backend/src/services/cache/materialCache.ts`
- `backend/src/services/cache/searchCache.ts`

**Features:**
- Cache material listings (5 min TTL)
- Cache search results (2 min TTL)
- Cache invalidation on updates

---

## Remaining Frontend Components

### Authentication
**Files to update:**
- `frontend/src/services/api.ts` - Create API client with axios
- `frontend/src/services/authApi.ts` - Auth API calls
- `frontend/src/contexts/AuthContext.tsx` - Auth state management
- `frontend/src/components/ProtectedRoute.tsx` - Route guard

### Materials
**Files to create:**
- `frontend/src/pages/CreateMaterialPage.tsx`
- `frontend/src/pages/SearchMaterialsPage.tsx`
- `frontend/src/pages/MaterialDetailsPage.tsx`
- `frontend/src/components/MaterialForm.tsx`
- `frontend/src/components/ImageUpload.tsx`
- `frontend/src/components/MaterialCard.tsx`
- `frontend/src/components/SearchFilters.tsx`
- `frontend/src/services/materialsApi.ts`

### Transactions
**Files to create:**
- `frontend/src/pages/CheckoutPage.tsx`
- `frontend/src/pages/OrderConfirmationPage.tsx`
- `frontend/src/components/ShippingForm.tsx`
- `frontend/src/components/PaymentForm.tsx`
- `frontend/src/services/transactionsApi.ts`
- `frontend/src/services/paymentsApi.ts`

### Messaging
**Files to create:**
- `frontend/src/pages/MessagesPage.tsx`
- `frontend/src/components/ConversationList.tsx`
- `frontend/src/components/ChatView.tsx`
- `frontend/src/services/messagesApi.ts`

### Dashboard & Reports
**Files to create:**
- `frontend/src/pages/DashboardPage.tsx`
- `frontend/src/components/ManufacturerDashboard.tsx`
- `frontend/src/components/BrandDashboard.tsx`
- `frontend/src/pages/SustainabilityReportPage.tsx`
- `frontend/src/components/MetricsDisplay.tsx`
- `frontend/src/components/EmissionsChart.tsx`
- `frontend/src/services/reportsApi.ts`

---

## Testing

### Unit Tests
```bash
cd backend
npm test
```

### Integration Tests
```bash
cd backend
npm test -- integration/
```

### E2E Tests
```bash
cd frontend
npx playwright test
```

---

## Deployment

### Environment Variables
Copy `.env.example` to `.env` and set production values:
```bash
cp .env.example .env
# Edit .env with production values
```

### Production Build
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Docker Production
```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d
```

---

## Quick Start Commands

```bash
# Start everything
docker-compose up -d
cd backend && npm run migrate
npm run dev  # In one terminal
cd frontend && npm run dev  # In another terminal

# Stop everything
docker-compose down
```

---

## Notes

- The project uses TypeScript throughout
- ESLint and Jest are configured for testing
- Logs are written to `backend/logs/`
- Migrations are tracked in `schema_migrations` table
- Image uploads go to `backend/uploads/` directory
