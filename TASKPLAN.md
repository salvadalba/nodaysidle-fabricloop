# Tasks Plan — FabricLoop

## 📌 Global Assumptions
- Solo developer implementation
- Local development environment with Docker for PostgreSQL and Redis
- Stripe sandbox for payment processing
- Image storage using local filesystem (CDN integration deferred)
- No real-time WebSocket implementation (polling for messages)

## ⚠️ Risks
- Payment gateway integration complexity may require additional time
- Real-time messaging without WebSockets may impact UX
- Image storage scalability concerns with local filesystem
- Scope 3 emission calculations may require domain expertise refinement

## 🧩 Epics
## Project Foundation
**Goal:** Set up project structure, development environment, and database infrastructure

### ✅ Initialize project structure (small)

Create monorepo structure with frontend and backend directories. Initialize package.json files for both. Configure TypeScript configs.

**Acceptance Criteria**
- Frontend and backend directories created
- package.json files initialized with dependencies
- TypeScript configured for both projects
- .gitignore properly configured

**Dependencies**
_None_
### ✅ Configure PostgreSQL database (small)

Set up PostgreSQL instance. Create database user and database. Configure connection pooling.

**Acceptance Criteria**
- PostgreSQL instance running locally
- Database and user created
- Connection string configured in environment variables

**Dependencies**
_None_
### ✅ Create database schema and migrations (medium)

Create SQL migration files for all tables: users, materials, sustainability_metrics, transactions, messages, digital_product_passports, payments. Create indexes as specified.

**Acceptance Criteria**
- Migration files created for all 7 tables
- Indexes created on materials(material_type, price, created_at)
- Indexes created on messages(sender_id, recipient_id, created_at)
- Indexes created on sustainability_metrics(carbon_footprint)
- Foreign key constraints defined
- Migrations run successfully

**Dependencies**
- Configure PostgreSQL database
### ✅ Set up backend API framework (small)

Initialize Express.js with TypeScript. Configure middleware: CORS, JSON parser, error handler, request ID generator. Set up routing structure.

**Acceptance Criteria**
- Express server running on configured port
- CORS middleware configured
- JSON body parser enabled
- Centralized error handling middleware implemented
- Request ID middleware generating unique IDs
- Health check endpoint responding

**Dependencies**
- Initialize project structure
### ✅ Configure Winston logging (small)

Set up structured JSON logging with Winston. Configure log levels and formats. Add request context to logs.

**Acceptance Criteria**
- Winston logger configured with JSON format
- Log levels: error, warn, info, debug
- Logs include timestamp, request_id, user_id, endpoint, status_code
- Log files written to disk

**Dependencies**
- Set up backend API framework
### ✅ Set up environment configuration (small)

Configure environment variable management using dotenv. Create .env.example template.

**Acceptance Criteria**
- .env.example file with all required variables
- Environment variables validated on startup
- Configuration service implemented

**Dependencies**
- Set up backend API framework
### ✅ Set up React frontend with Tailwind (small)

Initialize React app with Vite. Configure Tailwind CSS. Set up basic routing structure.

**Acceptance Criteria**
- React app running with Vite
- Tailwind CSS configured and working
- React Router configured
- Basic layout component created

**Dependencies**
- Initialize project structure

## Authentication Module
**Goal:** Implement user registration, login, and JWT-based authentication

### ✅ Implement password hashing utilities (small)

Create utility service for password hashing using bcrypt. Implement hash and compare functions.

**Acceptance Criteria**
- Password hashing implemented with bcrypt
- Password comparison implemented
- Salt rounds configured (minimum 10)
- Unit tests passing

**Dependencies**
- Project Foundation
### ✅ Implement JWT token service (small)

Create service for generating and validating JWT tokens. Configure access token (24h) and refresh token (30 days) expiration.

**Acceptance Criteria**
- Access token generation with 24h expiration
- Refresh token generation with 30 day expiration
- Token validation implemented
- Unit tests passing

**Dependencies**
- Set up environment configuration
### ✅ Implement email validation (small)

Create email validation utility using regex pattern.

**Acceptance Criteria**
- Email regex validation implemented
- Validates standard email formats
- Unit tests covering valid and invalid emails

**Dependencies**
_None_
### ✅ Create user registration endpoint (medium)

Implement POST /api/auth/register. Validate email, password (min 8 chars with uppercase, lowercase, number), company_name, role, phone. Hash password and store user. Return user data.

**Acceptance Criteria**
- POST /api/auth/register accepts valid requests
- Password hashed before storage
- Returns user_id, email, company_name, role, created_at
- Returns 400 for invalid email format
- Returns 409 for existing email
- Returns 422 for validation errors
- Integration tests passing

**Dependencies**
- Implement password hashing utilities
- Implement email validation
- Create database schema and migrations
### ✅ Create user login endpoint (medium)

Implement POST /api/auth/login. Validate credentials, generate JWT token, return token and user data.

**Acceptance Criteria**
- POST /api/auth/login accepts valid credentials
- Returns JWT token, user_id, email, role
- Returns 401 for invalid credentials
- Returns 422 for validation errors
- Integration tests passing

**Dependencies**
- Create user registration endpoint
- Implement JWT token service
### ✅ Implement authentication middleware (small)

Create middleware to verify JWT tokens from Authorization header. Attach user to request object.

**Acceptance Criteria**
- Middleware extracts Bearer token from Authorization header
- Valid token attaches user to request
- Invalid token returns 401
- Missing token returns 401
- Unit tests passing

**Dependencies**
- Implement JWT token service
### ✅ Create current user endpoint (small)

Implement GET /api/auth/me. Return current authenticated user data.

**Acceptance Criteria**
- GET /api/auth/me returns user data for authenticated user
- Returns 401 for unauthenticated requests
- Integration tests passing

**Dependencies**
- Implement authentication middleware
### ✅ Implement rate limiting (small)

Configure rate limiting middleware: 100 requests per minute per IP.

**Acceptance Criteria**
- Rate limiting configured at 100 req/min per IP
- Returns 429 when limit exceeded
- Integration tests passing

**Dependencies**
- Set up backend API framework

## Materials Module
**Goal:** Implement material listing CRUD operations with image upload

### ✅ Create materials database service (medium)

Implement data access layer for materials table. CRUD operations with parameterized queries.

**Acceptance Criteria**
- create() method inserts material record
- findById() retrieves material by ID
- findBySellerId() retrieves materials by seller
- update() modifies material record
- delete() soft deletes material
- All queries use parameterized inputs

**Dependencies**
- Create database schema and migrations
### ✅ Implement image upload service (medium)

Create service for handling image uploads. Validate file type (images only) and size (max 5MB). Store file paths.

**Acceptance Criteria**
- Accepts image files only
- Rejects files over 5MB
- Returns stored file path
- Error handling for invalid files

**Dependencies**
_None_
### ✅ Create material listing endpoint (medium)

Implement POST /api/materials. Validate title, description, material_type, quantity, unit, price, currency, images, sustainability_metrics. Associate with authenticated seller.

**Acceptance Criteria**
- POST /api/materials creates material listing
- Requires authentication
- Returns material_id, title, status, created_at
- Images uploaded and stored
- Sustainability metrics stored
- Returns 401 for unauthenticated
- Returns 422 for validation errors
- Integration tests passing

**Dependencies**
- Create materials database service
- Implement image upload service
- Implement authentication middleware
### ✅ Create get material endpoint (small)

Implement GET /api/materials/:material_id. Return full material details with seller info and sustainability metrics.

**Acceptance Criteria**
- GET /api/materials/:id returns full material details
- Includes seller company_name
- Includes sustainability_metrics
- Includes images array
- Returns 404 for non-existent material
- Integration tests passing

**Dependencies**
- Create materials database service
### ✅ Create update material endpoint (medium)

Implement PUT /api/materials/:material_id. Allow owner to update title, description, quantity, price, status.

**Acceptance Criteria**
- PUT /api/materials/:id updates material
- Only owner can update
- Returns material_id, updated_at
- Returns 401 for unauthenticated
- Returns 403 for non-owner
- Returns 404 for non-existent material
- Integration tests passing

**Dependencies**
- Create get material endpoint
### ✅ Create delete material endpoint (small)

Implement DELETE /api/materials/:material_id. Allow owner to delete their listing.

**Acceptance Criteria**
- DELETE /api/materials/:id deletes material
- Only owner can delete
- Returns confirmation message
- Returns 401 for unauthenticated
- Returns 403 for non-owner
- Returns 404 for non-existent material
- Integration tests passing

**Dependencies**
- Create update material endpoint

## Search Module
**Goal:** Implement material search with filters and pagination

### ✅ Implement search query builder (medium)

Create service to build dynamic SQL queries with filters for material_type, min_price, max_price, quantity, search_term.

**Acceptance Criteria**
- Builds WHERE clause from filter parameters
- Handles optional filters
- Prevents SQL injection with parameterized queries
- Unit tests passing

**Dependencies**
- Create database schema and migrations
### ✅ Implement pagination logic (small)

Create pagination utility for offset/limit calculation. Default 20, max 100 per page.

**Acceptance Criteria**
- Calculates OFFSET from page and limit
- Enforces max limit of 100
- Returns total count for pagination metadata
- Unit tests passing

**Dependencies**
_None_
### ✅ Create search materials endpoint (medium)

Implement GET /api/materials with query parameters. Return paginated results with thumbnails.

**Acceptance Criteria**
- GET /api/materials returns paginated materials
- Filters by material_type, min_price, max_price, quantity
- Full-text search on title and description
- Returns materials array with thumbnail
- Returns total, page, limit in response
- Returns 400 for invalid query parameters
- Integration tests passing

**Dependencies**
- Implement search query builder
- Implement pagination logic
### ✅ Add database query optimization (medium)

Run EXPLAIN ANALYZE on search queries. Add missing indexes. Optimize slow queries.

**Acceptance Criteria**
- Search queries analyzed
- Appropriate indexes in place
- Query performance documented

**Dependencies**
- Create search materials endpoint

## Transaction Module
**Goal:** Implement transaction workflow and payment integration

### ✅ Create transactions database service (medium)

Implement data access layer for transactions table. Create, update status, find by buyer/seller.

**Acceptance Criteria**
- create() method inserts transaction record
- findById() retrieves transaction by ID
- updateStatus() changes transaction status
- findByBuyerId() retrieves buyer transactions
- All queries use parameterized inputs

**Dependencies**
- Create database schema and migrations
### ✅ Implement transaction status state machine (small)

Create service for managing transaction status transitions: pending -> paid -> shipped -> completed. Validate transitions.

**Acceptance Criteria**
- Valid status transitions defined
- Invalid transitions rejected
- State machine unit tests passing

**Dependencies**
_None_
### ✅ Create transaction endpoint (medium)

Implement POST /api/transactions. Validate material_id, quantity, shipping_address. Create transaction with pending status.

**Acceptance Criteria**
- POST /api/transactions creates transaction
- Requires authentication
- Validates material exists and has sufficient quantity
- Calculates total from material price
- Returns transaction_id, status, total, created_at
- Returns 401 for unauthenticated
- Returns 404 for non-existent material
- Returns 422 for validation errors
- Integration tests passing

**Dependencies**
- Create transactions database service
- Implement transaction status state machine
### ✅ Create get transaction status endpoint (small)

Implement GET /api/transactions/:transaction_id. Return transaction details with material info.

**Acceptance Criteria**
- GET /api/transactions/:id returns transaction details
- Includes material title
- Returns status, total, created_at
- Requires authentication (buyer or seller)
- Returns 401 for unauthenticated
- Returns 404 for non-existent transaction
- Integration tests passing

**Dependencies**
- Create transaction endpoint
### ✅ Integrate payment gateway (sandbox) (medium)

Integrate with payment gateway provider (Stripe) in sandbox mode. Create payment intent processing.

**Acceptance Criteria**
- Payment gateway client initialized
- Sandbox mode configured
- Payment intent creation working

**Dependencies**
- Set up environment configuration
### ✅ Create payment processing endpoint (medium)

Implement POST /api/payments. Process payment for transaction. Update transaction status on success.

**Acceptance Criteria**
- POST /api/payments processes payment
- Requires authentication
- Returns payment_id, status, transaction_id
- Updates transaction to 'paid' on success
- Returns 401 for unauthenticated
- Returns 402 for payment failure
- Returns 404 for non-existent transaction
- Integration tests passing with sandbox

**Dependencies**
- Integrate payment gateway (sandbox)
- Create get transaction status endpoint

## Digital Product Passport Module
**Goal:** Implement sustainability tracking and Digital Product Passports

### ✅ Create sustainability metrics database service (medium)

Implement data access layer for sustainability_metrics table. CRUD operations for carbon, water, chemicals.

**Acceptance Criteria**
- create() method inserts metrics record
- findByMaterialId() retrieves metrics
- update() modifies metrics
- All queries use parameterized inputs

**Dependencies**
- Create database schema and migrations
### ✅ Create passport database service (medium)

Implement data access layer for digital_product_passports table. Manage passports with supply chain and certifications.

**Acceptance Criteria**
- create() method inserts passport
- findByMaterialId() retrieves passport
- update() modifies passport
- All queries use parameterized inputs

**Dependencies**
- Create database schema and migrations
### ✅ Create get passport endpoint (small)

Implement GET /api/passports/:material_id. Return passport with sustainability metrics and supply chain.

**Acceptance Criteria**
- GET /api/passports/:material_id returns passport
- Includes passport_id, material_id, material_type
- Includes origin, manufacture_date
- Includes sustainability_metrics (carbon, water, chemicals)
- Includes supply_chain array
- Returns 404 for non-existent passport
- Integration tests passing

**Dependencies**
- Create passport database service
- Create sustainability metrics database service
### ✅ Create add metrics endpoint (medium)

Implement POST /api/passports/:material_id/metrics. Allow manufacturer to add sustainability metrics.

**Acceptance Criteria**
- POST /api/passports/:material_id/metrics adds metrics
- Requires authentication
- Only material owner can add metrics
- Stores carbon_footprint, water_usage, chemical_composition
- Returns metric_id, created_at
- Returns 401 for unauthenticated
- Returns 403 for non-owner
- Integration tests passing

**Dependencies**
- Create get passport endpoint

## Messaging Module
**Goal:** Implement user-to-user messaging with conversation management

### ✅ Create messaging database service (medium)

Implement data access layer for messages table. CRUD operations, conversation queries, unread counts.

**Acceptance Criteria**
- create() method inserts message
- findConversation() retrieves conversation between two users
- markAsRead() updates read status
- getUnreadCount() returns unread message count
- All queries use parameterized inputs

**Dependencies**
- Create database schema and migrations
### ✅ Create send message endpoint (medium)

Implement POST /api/messages. Validate recipient_id, material_id (optional), content. Create message.

**Acceptance Criteria**
- POST /api/messages sends message
- Requires authentication
- Validates recipient exists
- Links to material context if provided
- Returns message_id, sent_at
- Returns 401 for unauthenticated
- Returns 422 for validation errors
- Integration tests passing

**Dependencies**
- Create messaging database service
- Implement authentication middleware
### ✅ Create get conversations endpoint (medium)

Implement GET /api/messages/conversations. Return list of conversations with last message and user info.

**Acceptance Criteria**
- GET /api/messages/conversations returns user conversations
- Requires authentication
- Includes user_id, company_name for other party
- Includes last_message preview
- Includes updated_at timestamp
- Returns 401 for unauthenticated
- Integration tests passing

**Dependencies**
- Create send message endpoint
### ✅ Create get conversation messages endpoint (small)

Implement GET /api/messages/:user_id. Return message history with specific user.

**Acceptance Criteria**
- GET /api/messages/:user_id returns conversation history
- Requires authentication
- Returns messages ordered by created_at
- Includes material context when present
- Returns 401 for unauthenticated
- Integration tests passing

**Dependencies**
- Create get conversations endpoint

## Reporting Module
**Goal:** Implement sustainability reporting and Scope 3 emission calculations

### ✅ Implement Scope 3 emission calculator (medium)

Create service to calculate Scope 3 emissions from purchased materials based on carbon_footprint data.

**Acceptance Criteria**
- Calculates total carbon_saved vs virgin materials
- Calculates total_water_saved
- Aggregates by date range
- Unit tests passing

**Dependencies**
- Create sustainability metrics database service
### ✅ Create sustainability report endpoint (medium)

Implement GET /api/reports/sustainability with start_date and end_date query params.

**Acceptance Criteria**
- GET /api/reports/sustainability returns sustainability metrics
- Requires authentication
- Accepts start_date and end_date query params
- Returns total_carbon_saved, total_water_saved
- Returns materials_purchased count
- Returns scope3_emissions total
- Returns 401 for unauthenticated
- Returns 400 for invalid date range
- Integration tests passing

**Dependencies**
- Implement Scope 3 emission calculator
- Create transactions database service
### ✅ Implement CSV export functionality (small)

Create service to export sustainability report data as CSV.

**Acceptance Criteria**
- Generates CSV from report data
- Properly escapes special characters
- Unit tests passing

**Dependencies**
_None_
### ✅ Create report export endpoint (medium)

Implement GET /api/reports/export. Return CSV or PDF export of sustainability report.

**Acceptance Criteria**
- GET /api/reports/export generates report file
- Requires authentication
- Supports CSV format
- Returns file with appropriate headers
- Returns 401 for unauthenticated
- Integration tests passing

**Dependencies**
- Implement CSV export functionality
- Create sustainability report endpoint

## Caching Layer
**Goal:** Implement Redis caching for improved performance

### ✅ Set up Redis client (small)

Configure Redis client connection. Implement connection handling and error recovery.

**Acceptance Criteria**
- Redis client configured
- Connection successfully established
- Error handling implemented

**Dependencies**
- Set up backend API framework
### ✅ Implement material listing cache (medium)

Cache hot material listings with 5 minute TTL. Cache key: material:{material_id}. Invalidate on updates.

**Acceptance Criteria**
- Material details cached on retrieval
- Cache hit serves from Redis
- Cache miss queries database
- TTL set to 5 minutes
- Cache invalidated on material update/delete

**Dependencies**
- Set up Redis client
- Create get material endpoint
### ✅ Implement search results cache (medium)

Cache search query results with 2 minute TTL. Cache key: search:{hash_of_query_params}.

**Acceptance Criteria**
- Search results cached
- Cache key based on query parameters hash
- TTL set to 2 minutes
- Cache invalidated on material changes

**Dependencies**
- Set up Redis client
- Create search materials endpoint

## Frontend Implementation
**Goal:** Build React user interface with Tailwind CSS

### ✅ Create authentication pages (medium)

Build login and registration pages with forms. Connect to auth API. Implement JWT storage and auth context.

**Acceptance Criteria**
- Login page with email/password form
- Registration page with all required fields
- Form validation displaying errors
- JWT stored securely
- Auth context providing login/logout/register
- Redirect to dashboard on success

**Dependencies**
- Set up React frontend with Tailwind
- Authentication Module
### ✅ Create protected route wrapper (small)

Implement higher-order component to protect routes requiring authentication.

**Acceptance Criteria**
- ProtectedRoute component created
- Redirects to login if unauthenticated
- Preserves intended destination

**Dependencies**
- Create authentication pages
### ✅ Create material listing form (medium)

Build form for creating material listings. Include file upload for images. Sustainability metrics input.

**Acceptance Criteria**
- Form with all required fields
- Image upload with preview
- Sustainability metrics inputs
- Form validation
- Success/error handling

**Dependencies**
- Create protected route wrapper
### ✅ Create material search page (medium)

Build search page with filters (material type, price range, quantity). Display paginated results.

**Acceptance Criteria**
- Search input with filters
- Filter controls for type, price, quantity
- Material cards grid display
- Pagination controls
- Material detail modal/page

**Dependencies**
- Create protected route wrapper
- Search Module
### ✅ Create material details page (medium)

Build page showing full material details including Digital Product Passport and sustainability metrics.

**Acceptance Criteria**
- Material info displayed
- Sustainability metrics shown
- Digital Product Passport section
- Contact seller button
- Purchase button (for brands)

**Dependencies**
- Create material search page
- Digital Product Passport Module
### ✅ Create transaction flow (medium)

Build checkout flow for purchasing materials. Shipping address form, payment form, confirmation.

**Acceptance Criteria**
- Checkout flow from material details
- Shipping address form
- Payment method selection
- Order confirmation page
- Error handling

**Dependencies**
- Create material details page
- Transaction Module
### ✅ Create messaging interface (medium)

Build messaging UI with conversation list and chat view. Real-time updates.

**Acceptance Criteria**
- Conversation list with last message
- Chat view with message history
- Send message input
- Material context in messages
- Unread message indicator

**Dependencies**
- Create material details page
- Messaging Module
### ✅ Create dashboard page (medium)

Build user dashboard showing listings, transactions, messages. Different views for manufacturers and brands.

**Acceptance Criteria**
- Manufacturer view: my listings, active transactions
- Brand view: purchased materials, savings metrics
- Quick actions
- Recent activity

**Dependencies**
- Create material search page
### ✅ Create sustainability reports page (medium)

Build page displaying sustainability metrics and Scope 3 emissions. Export functionality.

**Acceptance Criteria**
- Date range selector
- Metrics display (carbon saved, water saved)
- Scope 3 emissions chart
- CSV export button
- Data tables

**Dependencies**
- Create dashboard page
- Reporting Module

## Testing
**Goal:** Implement comprehensive test coverage

### ✅ Write unit tests for auth service (medium)

Create Jest unit tests for password hashing, token generation, email validation.

**Acceptance Criteria**
- Password hashing tests (hash, compare)
- JWT token generation and validation tests
- Email validation tests
- Edge case coverage
- 100% code coverage for auth utilities

**Dependencies**
- Authentication Module
### ✅ Write unit tests for material service (medium)

Create Jest unit tests for material CRUD operations and validations.

**Acceptance Criteria**
- Material creation tests
- Material update tests
- Material deletion tests
- Validation tests
- Edge case coverage

**Dependencies**
- Materials Module
### ✅ Write unit tests for transaction service (medium)

Create Jest unit tests for transaction creation and status transitions.

**Acceptance Criteria**
- Transaction creation tests
- Status transition tests
- Invalid transition tests
- Calculation tests

**Dependencies**
- Transaction Module
### ✅ Write API integration tests (large)

Create integration tests using supertest for all API endpoints with test database.

**Acceptance Criteria**
- Auth endpoints tested
- Material endpoints tested
- Search endpoints tested
- Transaction endpoints tested
- Passport endpoints tested
- Messaging endpoints tested
- Reporting endpoints tested

**Dependencies**
- Reporting Module
### ✅ Write E2E tests for user flows (large)

Create Playwright E2E tests for critical user journeys.

**Acceptance Criteria**
- Registration and login flow
- Create material listing flow
- Search and view materials flow
- Purchase transaction flow
- View Digital Product Passport flow
- Send message flow
- View sustainability report flow

**Dependencies**
- Frontend Implementation

## Production Readiness
**Goal:** Prepare application for production deployment

### ✅ Implement GDPR compliance features (medium)

Create user data export endpoint and data deletion endpoint.

**Acceptance Criteria**
- GET /api/auth/export returns all user data
- DELETE /api/auth/delete requests account deletion
- Data export includes all related records
- Deletion marks data for removal

**Dependencies**
- Messaging Module
### ✅ Add API response compression (small)

Enable gzip compression for all API responses.

**Acceptance Criteria**
- Gzip compression middleware configured
- Responses compressed
- Compression doesn't break functionality

**Dependencies**
- Set up backend API framework
### ✅ Configure production database (medium)

Set up production PostgreSQL instance with proper backup strategy.

**Acceptance Criteria**
- Production database configured
- Connection pooling tuned
- Backup strategy implemented
- Migration scripts tested

**Dependencies**
- Create database schema and migrations
### ✅ Set up monitoring and metrics (medium)

Configure metrics collection for API response times, request counts, error rates.

**Acceptance Criteria**
- Metrics service implemented
- Response time metrics (p50, p95, p99)
- Request count per endpoint
- Active user sessions tracked
- Transaction success/failure rate
- Database pool usage monitored

**Dependencies**
- Configure Winston logging
### ✅ Implement health check endpoint (small)

Create comprehensive health check endpoint verifying database, Redis, and external services.

**Acceptance Criteria**
- GET /health returns service status
- Checks database connectivity
- Checks Redis connectivity
- Checks payment gateway connectivity
- Returns appropriate status codes

**Dependencies**
- Set up monitoring and metrics
### ✅ Configure production environment (small)

Set up production environment variables and configuration.

**Acceptance Criteria**
- Production .env template created
- Environment validation in place
- Secrets management documented

**Dependencies**
- Set up environment configuration
### ✅ Create deployment documentation (small)

Document deployment process, environment setup, and operational procedures.

**Acceptance Criteria**
- Deployment guide documented
- Environment setup documented
- Runbook for common issues
- Rollback procedure documented

**Dependencies**
- Implement health check endpoint

## ❓ Open Questions
_None_
