# Technical Requirements Document

## 🧭 System Context
FabricLoop is a B2B circular economy marketplace platform connecting textile manufacturers with excess inventory to fashion brands seeking sustainable materials. The system provides material listing, search, transaction workflows, and automated sustainability compliance through Digital Product Passports that track environmental metrics (carbon footprint, water usage, chemical composition) for Scope 3 emission reporting.

## 🔌 API Contracts
### User Registration
- **Method:** POST
- **Path:** /api/auth/register
- **Auth:** none
- **Request:** {"email":"string","password":"string","company_name":"string","role":"manufacturer|brand","phone":"string"}
- **Response:** {"user_id":"uuid","email":"string","company_name":"string","role":"string","created_at":"timestamp"}
- **Errors:**
- 400: Invalid email format
- 409: Email already registered
- 422: Validation error

### User Login
- **Method:** POST
- **Path:** /api/auth/login
- **Auth:** none
- **Request:** {"email":"string","password":"string"}
- **Response:** {"token":"jwt","user_id":"uuid","email":"string","role":"string"}
- **Errors:**
- 401: Invalid credentials
- 422: Validation error

### Create Material Listing
- **Method:** POST
- **Path:** /api/materials
- **Auth:** Bearer token
- **Request:** {"title":"string","description":"string","material_type":"string","quantity":"number","unit":"m|kg","price":"number","currency":"string","images":"string[]","sustainability_metrics":{"carbon_footprint":"number","water_usage":"number","chemical_composition":"string"}}
- **Response:** {"material_id":"uuid","title":"string","status":"active","created_at":"timestamp"}
- **Errors:**
- 401: Unauthorized
- 422: Validation error

### Search Materials
- **Method:** GET
- **Path:** /api/materials
- **Auth:** Bearer token (optional)
- **Request:** query: material_type, min_price, max_price, quantity, search_term, page, limit
- **Response:** {"materials":[{"material_id":"uuid","title":"string","price":"number","quantity":"number","thumbnail":"string"}],"total":"number","page":"number"}
- **Errors:**
- 400: Invalid query parameters

### Get Material Details
- **Method:** GET
- **Path:** /api/materials/:material_id
- **Auth:** Bearer token (optional)
- **Request:** none
- **Response:** {"material_id":"uuid","title":"string","description":"string","material_type":"string","quantity":"number","price":"number","seller":{"company_name":"string"},"sustainability_metrics":{"carbon_footprint":"number","water_usage":"number"},"images":"string[]"}
- **Errors:**
- 404: Material not found

### Update Material Listing
- **Method:** PUT
- **Path:** /api/materials/:material_id
- **Auth:** Bearer token
- **Request:** {"title":"string","description":"string","quantity":"number","price":"number","status":"active|sold|pending"}
- **Response:** {"material_id":"uuid","updated_at":"timestamp"}
- **Errors:**
- 401: Unauthorized
- 403: Forbidden - not owner
- 404: Material not found

### Delete Material Listing
- **Method:** DELETE
- **Path:** /api/materials/:material_id
- **Auth:** Bearer token
- **Request:** none
- **Response:** {"message":"Material deleted"}
- **Errors:**
- 401: Unauthorized
- 403: Forbidden - not owner
- 404: Material not found

### Create Transaction
- **Method:** POST
- **Path:** /api/transactions
- **Auth:** Bearer token
- **Request:** {"material_id":"uuid","quantity":"number","shipping_address":{"street":"string","city":"string","country":"string","postal_code":"string"}}
- **Response:** {"transaction_id":"uuid","status":"pending","total":"number","created_at":"timestamp"}
- **Errors:**
- 401: Unauthorized
- 404: Material not found
- 422: Validation error

### Get Transaction Status
- **Method:** GET
- **Path:** /api/transactions/:transaction_id
- **Auth:** Bearer token
- **Request:** none
- **Response:** {"transaction_id":"uuid","status":"pending|paid|shipped|completed","material":{"title":"string"},"total":"number","created_at":"timestamp"}
- **Errors:**
- 401: Unauthorized
- 404: Transaction not found

### Get Digital Product Passport
- **Method:** GET
- **Path:** /api/passports/:material_id
- **Auth:** Bearer token (optional)
- **Request:** none
- **Response:** {"passport_id":"uuid","material_id":"uuid","material_type":"string","origin":"string","manufacture_date":"timestamp","sustainability_metrics":{"carbon_footprint":"number","water_usage":"number","chemical_composition":"string"},"supply_chain":"string[]"}
- **Errors:**
- 404: Passport not found

### Send Message
- **Method:** POST
- **Path:** /api/messages
- **Auth:** Bearer token
- **Request:** {"recipient_id":"uuid","material_id":"uuid","content":"string"}
- **Response:** {"message_id":"uuid","sent_at":"timestamp"}
- **Errors:**
- 401: Unauthorized
- 422: Validation error

### Get Conversations
- **Method:** GET
- **Path:** /api/messages/conversations
- **Auth:** Bearer token
- **Request:** none
- **Response:** {"conversations":[{"user_id":"uuid","company_name":"string","last_message":"string","updated_at":"timestamp"}]}
- **Errors:**
- 401: Unauthorized

### Get Sustainability Report
- **Method:** GET
- **Path:** /api/reports/sustainability
- **Auth:** Bearer token
- **Request:** query: start_date, end_date
- **Response:** {"total_carbon_saved":"number","total_water_saved":"number","materials_purchased":"number","scope3_emissions":"number"}
- **Errors:**
- 401: Unauthorized
- 400: Invalid date range

### Process Payment
- **Method:** POST
- **Path:** /api/payments
- **Auth:** Bearer token
- **Request:** {"transaction_id":"uuid","payment_method_id":"string"}
- **Response:** {"payment_id":"uuid","status":"success","transaction_id":"uuid"}
- **Errors:**
- 401: Unauthorized
- 402: Payment failed
- 404: Transaction not found

## 🧱 Modules
### Auth Module
- **Responsibilities:**
- User registration and login
- JWT token generation and validation
- Password hashing with bcrypt
- Session management
- **Interfaces:**
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- **Depends on:**
- Database Module

### Material Module
- **Responsibilities:**
- CRUD operations for material listings
- Image upload and storage
- Inventory tracking
- Material status management
- **Interfaces:**
- POST /api/materials
- GET /api/materials
- GET /api/materials/:id
- PUT /api/materials/:id
- DELETE /api/materials/:id
- **Depends on:**
- Database Module
- Auth Module

### Search Module
- **Responsibilities:**
- Full-text search on materials
- Filter by material type, price, quantity
- Pagination and sorting
- Query optimization with indexes
- **Interfaces:**
- GET /api/materials (with filters)
- **Depends on:**
- Database Module

### Transaction Module
- **Responsibilities:**
- Transaction workflow orchestration
- Order creation and status tracking
- Payment integration
- Shipping information management
- **Interfaces:**
- POST /api/transactions
- GET /api/transactions/:id
- POST /api/payments
- **Depends on:**
- Database Module
- Auth Module
- Payment Gateway

### Digital Product Passport Module
- **Responsibilities:**
- Generate and store sustainability metrics
- Track carbon footprint, water usage, chemicals
- Supply chain tracking
- Scope 3 emission calculations
- **Interfaces:**
- GET /api/passports/:material_id
- POST /api/passports/:material_id/metrics
- **Depends on:**
- Database Module
- Material Module

### Messaging Module
- **Responsibilities:**
- User-to-user messaging
- Conversation threading
- Message notifications
- Material context in messages
- **Interfaces:**
- POST /api/messages
- GET /api/messages/conversations
- GET /api/messages/:user_id
- **Depends on:**
- Database Module
- Auth Module

### Reporting Module
- **Responsibilities:**
- Generate sustainability reports
- Calculate Scope 3 emissions
- Aggregate environmental metrics
- Export reports (CSV, PDF)
- **Interfaces:**
- GET /api/reports/sustainability
- GET /api/reports/export
- **Depends on:**
- Database Module
- Digital Product Passport Module

### Database Module
- **Responsibilities:**
- PostgreSQL connection management
- Query execution
- Transaction management
- Migration handling
- **Interfaces:**
- db.query()
- db.transaction()
- migrations.up/down()
- **Depends on:**
_None_

## 🗃 Data Model Notes
- Users table: user_id (UUID PK), email, password_hash, company_name, role (manufacturer/brand), phone, created_at
- Materials table: material_id (UUID PK), seller_id (FK users), title, description, material_type, quantity, unit, price, currency, status, images[], created_at, updated_at
- Sustainability_Metrics table: metric_id (UUID PK), material_id (FK materials), carbon_footprint (kg CO2e), water_usage (liters), chemical_composition (JSONB), created_at
- Transactions table: transaction_id (UUID PK), buyer_id (FK users), material_id (FK materials), quantity, total_amount, status, shipping_address (JSONB), created_at, updated_at
- Messages table: message_id (UUID PK), sender_id (FK users), recipient_id (FK users), material_id (FK materials), content, read_status, created_at
- Digital_Product_Passports table: passport_id (UUID PK), material_id (FK unique), origin, manufacture_date, supply_chain (JSONB), certifications (JSONB), created_at, updated_at
- Payments table: payment_id (UUID PK), transaction_id (FK transactions), payment_method_id, status, amount, processed_at
- Indexes: materials(material_type, price, created_at), messages(sender_id, recipient_id, created_at), sustainability_metrics(carbon_footprint)

## 🔐 Validation & Security
- Password minimum 8 characters with uppercase, lowercase, number
- Email validation with regex pattern
- JWT tokens expire after 24 hours, refresh tokens 30 days
- Rate limiting: 100 requests per minute per IP
- Input sanitization against SQL injection (parameterized queries)
- File upload validation: images only, max 5MB per file
- HTTPS only for all endpoints
- CORS restricted to frontend domain
- GDPR: user data export endpoint, data deletion on request
- PCI DSS compliance via payment gateway integration (no card data stored)

## 🧯 Error Handling Strategy
Centralized error handling middleware with consistent error response format: {error_code, message, details}. HTTP status codes follow REST conventions. Errors logged with context for debugging. Client receives safe error messages without sensitive data.

## 🔭 Observability
- **Logging:** Structured JSON logging with Winston. Log levels: error, warn, info, debug. Logs include timestamp, request_id, user_id, endpoint, status_code.
- **Tracing:** Request ID middleware for distributed tracing. Correlate logs across request lifecycle.
- **Metrics:**
- API response times (p50, p95, p99)
- Request count per endpoint
- Active user sessions
- Material search query latency
- Transaction success/failure rate
- Database connection pool usage

## ⚡ Performance Notes
- Database indexes on frequently queried columns (material_type, price, created_at)
- Connection pooling with pg-pool (max 20 connections)
- Image CDN integration for static asset delivery
- Search results paginated (default 20, max 100)
- Redis caching for hot material listings (TTL 5 minutes)
- Gzip compression for API responses
- Database query optimization with EXPLAIN ANALYZE for slow queries

## 🧪 Testing Strategy
### Unit
- Auth service: password hashing, token generation
- Material service: CRUD operations, validation
- Search service: filter logic, pagination
- Transaction service: status transitions, calculations
- Jest as test runner with supertest for API testing
### Integration
- API endpoint tests with test database
- Database integration tests with migrations
- Payment gateway integration (sandbox mode)
- Auth flow: register -> login -> access protected endpoint
### E2E
- User registration and login flow
- Material listing creation and search
- Complete purchase workflow with payment
- Digital Product Passport generation and retrieval
- Sustainability report generation
- Playwright or Cypress for browser automation

## 🚀 Rollout Plan
- Phase 1: Setup project structure, database schema, migrations
- Phase 2: Implement auth module (register, login, JWT)
- Phase 3: Implement material CRUD operations
- Phase 4: Implement search and filtering with pagination
- Phase 5: Implement transaction workflow without payment
- Phase 6: Integrate payment gateway
- Phase 7: Implement Digital Product Passport module
- Phase 8: Implement messaging system
- Phase 9: Implement sustainability reporting
- Phase 10: Frontend development and integration
- Phase 11: Testing and bug fixes
- Phase 12: Production deployment

## ❓ Open Questions
_None_
