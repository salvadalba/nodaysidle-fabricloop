ROLE: Expert Full-Stack Developer

GOAL: Set up monorepo project structure with TypeScript configuration

CONTEXT: Create monorepo structure with frontend and backend directories, initialize package.json files, configure TypeScript, and set up .gitignore.

FILES TO CREATE:
- package.json
- frontend/package.json
- frontend/tsconfig.json
- frontend/tsconfig.node.json
- frontend/vite.config.ts
- frontend/index.html
- frontend/src/main.tsx
- frontend/src/App.tsx
- backend/package.json
- backend/tsconfig.json
- .gitignore
- .env.example

FILES TO MODIFY:
_None_

DETAILED STEPS:
1. Create root package.json with workspaces configuration and private: true
2. Create frontend/package.json with Vite, React, TypeScript, Tailwind CSS dependencies
3. Create frontend/tsconfig.json with React and TypeScript configuration
4. Create frontend/tsconfig.node.json for Vite config files
5. Create frontend/vite.config.ts with React plugin
6. Create frontend/index.html with root div
7. Create frontend/src/main.tsx as React entry point
8. Create frontend/src/App.tsx with basic component
9. Create backend/package.json with Express, TypeScript, node-typescript dependencies
10. Create backend/tsconfig.json for Node.js TypeScript
11. Create .gitignore excluding node_modules, .env, dist, uploads
12. Create .env.example with placeholder variables for all services

VALIDATION:
ls -la frontend/ backend/ && cat package.json

---

ROLE: DevOps Engineer

GOAL: Set up local PostgreSQL with Docker Compose

CONTEXT: Set up PostgreSQL with Docker Compose, create database and user, configure connection string in environment variables.

FILES TO CREATE:
- docker-compose.yml
- backend/src/config/database.ts

FILES TO MODIFY:
- .env.example

DETAILED STEPS:
1. Create docker-compose.yml with PostgreSQL service (port 5432), Redis service (port 6379), and volumes
2. Create backend/src/config/database.ts with pg Pool configuration
3. Add DATABASE_URL, REDIS_URL to .env.example
4. Export pool instance for use across services

VALIDATION:
docker compose up -d && docker compose ps

---

ROLE: Database Engineer

GOAL: Create SQL migration files for all tables with indexes

CONTEXT: Create SQL migration files for all 7 tables: users, materials, sustainability_metrics, transactions, messages, digital_product_passports, payments. Include indexes and foreign keys.

FILES TO CREATE:
- backend/migrations/001_create_users.sql
- backend/migrations/002_create_materials.sql
- backend/migrations/003_create_sustainability_metrics.sql
- backend/migrations/004_create_transactions.sql
- backend/migrations/005_create_messages.sql
- backend/migrations/006_create_digital_product_passports.sql
- backend/migrations/007_create_payments.sql
- backend/src/db/migrate.ts

FILES TO MODIFY:
_None_

DETAILED STEPS:
1. Create 001_create_users.sql with id, email, password_hash, company_name, role, phone, created_at, updated_at
2. Create 002_create_materials.sql with id, seller_id, title, description, material_type, quantity, unit, price, currency, status, images[], created_at, updated_at, index on (material_type, price, created_at)
3. Create 003_create_sustainability_metrics.sql with id, material_id, carbon_footprint, water_usage, chemical_composition, created_at, updated_at, index on carbon_footprint
4. Create 004_create_transactions.sql with id, buyer_id, seller_id, material_id, quantity, total, status, shipping_address, created_at, updated_at
5. Create 005_create_messages.sql with id, sender_id, recipient_id, material_id, content, read, created_at, index on (sender_id, recipient_id, created_at)
6. Create 006_create_digital_product_passports.sql with id, material_id, origin, manufacture_date, supply_chain[], certifications[], created_at, updated_at
7. Create 007_create_payments.sql with id, transaction_id, amount, currency, status, payment_provider, payment_provider_transaction_id, created_at
8. Create backend/src/db/migrate.ts to run migration files sequentially
9. Add foreign key constraints in relevant tables

VALIDATION:
cd backend && npm run migrate

---

ROLE: Backend Engineer

GOAL: Set up Express server with middleware and routing

CONTEXT: Initialize Express.js with TypeScript, configure middleware (CORS, JSON parser, error handler, request ID), set up routing structure.

FILES TO CREATE:
- backend/src/server.ts
- backend/src/app.ts
- backend/src/middleware/cors.ts
- backend/src/middleware/jsonParser.ts
- backend/src/middleware/errorHandler.ts
- backend/src/middleware/requestId.ts
- backend/src/routes/index.ts
- backend/src/routes/health.ts

FILES TO MODIFY:
- backend/package.json

DETAILED STEPS:
1. Create backend/src/server.ts that starts Express server from configured port
2. Create backend/src/app.ts with Express app, middleware registration, route registration
3. Create backend/src/middleware/cors.ts with CORS configuration
4. Create backend/src/middleware/jsonParser.ts with express.json()
5. Create backend/src/middleware/errorHandler.ts with centralized error handling
6. Create backend/src/middleware/requestId.ts generating unique request IDs
7. Create backend/src/routes/index.ts exporting all route modules
8. Create backend/src/routes/health.ts with GET /health endpoint
9. Add 'start': 'ts-node src/server.ts' to package.json scripts

VALIDATION:
cd backend && npm run build

---

ROLE: Backend Engineer

GOAL: Configure Winston logger with JSON format and request context

CONTEXT: Set up structured JSON logging with Winston, configure log levels, add request context to logs.

FILES TO CREATE:
- backend/src/logger/index.ts

FILES TO MODIFY:
- backend/src/app.ts

DETAILED STEPS:
1. Create backend/src/logger/index.ts with Winston logger
2. Configure JSON format transport
3. Set log levels: error, warn, info, debug
4. Add custom format for timestamp, request_id, user_id, endpoint, status_code
5. Add file transport for logs directory
6. Export logger instance
7. Integrate logger into app.ts middleware

VALIDATION:
cd backend && npm run build

---

ROLE: Backend Engineer

GOAL: Set up environment variable management with validation

CONTEXT: Configure environment variable management using dotenv, create .env.example template, add validation on startup.

FILES TO CREATE:
- backend/src/config/index.ts
- backend/src/config/env.schema.ts

FILES TO MODIFY:
- .env.example

DETAILED STEPS:
1. Create backend/src/config/env.schema.ts defining all required env vars
2. Create backend/src/config/index.ts loading and validating environment variables
3. Throw error on missing required variables
4. Export typed config object
5. Update .env.example with all required variables: PORT, DATABASE_URL, REDIS_URL, JWT_SECRET, JWT_ACCESS_EXPIRY, JWT_REFRESH_EXPIRY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, UPLOAD_DIR

VALIDATION:
cd backend && npm run build

---

ROLE: Frontend Engineer

GOAL: Set up React with Vite and Tailwind CSS

CONTEXT: Initialize React app with Vite, configure Tailwind CSS, set up basic routing structure.

FILES TO CREATE:
- frontend/tailwind.config.js
- frontend/postcss.config.js
- frontend/src/index.css
- frontend/src/router/index.tsx
- frontend/src/components/Layout.tsx

FILES TO MODIFY:
- frontend/package.json
- frontend/src/main.tsx

DETAILED STEPS:
1. Add Tailwind CSS dependencies to package.json
2. Create tailwind.config.js with content paths
3. Create postcss.config.js with tailwind plugin
4. Create frontend/src/index.css with Tailwind directives
5. Add react-router-dom to package.json
6. Create frontend/src/router/index.tsx with BrowserRouter and routes
7. Create frontend/src/components/Layout.tsx with header, main, footer
8. Update main.tsx to wrap App in Router

VALIDATION:
cd frontend && npm run build

---

ROLE: Backend Engineer

GOAL: Create password hashing service with bcrypt

CONTEXT: Create utility service for password hashing using bcrypt with hash and compare functions.

FILES TO CREATE:
- backend/src/services/auth/password.ts
- backend/src/services/auth/password.test.ts

FILES TO MODIFY:
- backend/package.json

DETAILED STEPS:
1. Add bcrypt and @types/bcrypt to package.json devDependencies
2. Create backend/src/services/auth/password.ts with hash() and compare() functions
3. Configure salt rounds to 10
4. Create password.test.ts with unit tests for hash and compare
5. Add jest and ts-jest to package.json for testing

VALIDATION:
cd backend && npm test -- password.test.ts

---

ROLE: Backend Engineer

GOAL: Create JWT token service with access and refresh tokens

CONTEXT: Create service for generating and validating JWT tokens with 24h access token and 30 day refresh token expiration.

FILES TO CREATE:
- backend/src/services/auth/jwt.ts
- backend/src/services/auth/jwt.test.ts

FILES TO MODIFY:
- backend/package.json

DETAILED STEPS:
1. Add jsonwebtoken and @types/jsonwebtoken to package.json
2. Create backend/src/services/auth/jwt.ts with generateAccessToken(), generateRefreshToken(), verifyToken() functions
3. Use JWT_SECRET and JWT_ACCESS_EXPIRY, JWT_REFRESH_EXPIRY from config
4. Create jwt.test.ts with unit tests for token generation and validation
5. Handle token expiration and invalid tokens

VALIDATION:
cd backend && npm test -- jwt.test.ts

---

ROLE: Backend Engineer

GOAL: Create email validation utility

CONTEXT: Create email validation utility using regex pattern.

FILES TO CREATE:
- backend/src/utils/validation.ts
- backend/src/utils/validation.test.ts

FILES TO MODIFY:
_None_

DETAILED STEPS:
1. Create backend/src/utils/validation.ts with isValidEmail() function
2. Use regex pattern for email validation
3. Create validation.test.ts with tests for valid and invalid emails
4. Test edge cases: empty string, special characters, missing @

VALIDATION:
cd backend && npm test -- validation.test.ts

---

ROLE: Backend Engineer

GOAL: Create user registration API endpoint

CONTEXT: Implement POST /api/auth/register with validation, password hashing, and user storage.

FILES TO CREATE:
- backend/src/routes/auth.ts
- backend/src/services/auth/registration.ts
- backend/src/services/auth/registration.test.ts
- backend/src/middleware/validation/auth.schema.ts
- backend/src/middleware/validation/validator.ts

FILES TO MODIFY:
- backend/src/routes/index.ts

DETAILED STEPS:
1. Create validation middleware with validator.ts
2. Create auth.schema.ts with registration validation (email, password min 8 chars with uppercase, lowercase, number, company_name, role, phone)
3. Create registration service that hashes password and inserts user into database
4. Create auth route with POST /register endpoint
5. Return user_id, email, company_name, role, created_at on success
6. Return 400 for invalid email, 409 for existing email, 422 for validation errors
7. Add integration tests

VALIDATION:
cd backend && npm test -- registration.test.ts

---

ROLE: Backend Engineer

GOAL: Create user login API endpoint

CONTEXT: Implement POST /api/auth/login with credential validation and JWT token generation.

FILES TO CREATE:
- backend/src/services/auth/login.ts
- backend/src/services/auth/login.test.ts

FILES TO MODIFY:
- backend/src/routes/auth.ts

DETAILED STEPS:
1. Create login service that validates email/password and compares hashed password
2. Generate JWT access token on successful authentication
3. Create POST /login endpoint in auth routes
4. Return token, user_id, email, role, company_name on success
5. Return 401 for invalid credentials, 422 for validation errors
6. Add integration tests

VALIDATION:
cd backend && npm test -- login.test.ts

---

ROLE: Backend Engineer

GOAL: Create JWT authentication middleware

CONTEXT: Create middleware to verify JWT tokens from Authorization header and attach user to request.

FILES TO CREATE:
- backend/src/middleware/auth.ts
- backend/src/middleware/auth.test.ts

FILES TO MODIFY:
_None_

DETAILED STEPS:
1. Create auth middleware that extracts Bearer token from Authorization header
2. Verify token using JWT service
3. Attach user object to request on valid token
4. Return 401 for missing or invalid token
5. Add unit tests for middleware behavior

VALIDATION:
cd backend && npm test -- auth.test.ts

---

ROLE: Backend Engineer

GOAL: Create current user endpoint

CONTEXT: Implement GET /api/auth/me to return current authenticated user data.

FILES TO CREATE:
- backend/src/services/auth/me.ts
- backend/src/services/auth/me.test.ts

FILES TO MODIFY:
- backend/src/routes/auth.ts

DETAILED STEPS:
1. Create me service that queries user by ID from request
2. Create GET /me endpoint protected by auth middleware
3. Return user_id, email, company_name, role, created_at
4. Return 401 for unauthenticated requests
5. Add integration tests

VALIDATION:
cd backend && npm test -- me.test.ts

---

ROLE: Backend Engineer

GOAL: Create rate limiting middleware

CONTEXT: Configure rate limiting middleware at 100 requests per minute per IP.

FILES TO CREATE:
- backend/src/middleware/rateLimit.ts
- backend/src/middleware/rateLimit.test.ts

FILES TO MODIFY:
- backend/src/app.ts

DETAILED STEPS:
1. Add express-rate-limit to package.json
2. Create rateLimit middleware with windowMs: 60000, max: 100
3. Apply to all routes in app.ts
4. Return 429 with retry-after header when limit exceeded
5. Add integration tests

VALIDATION:
cd backend && npm test -- rateLimit.test.ts

---

ROLE: Backend Engineer

GOAL: Create materials database service with CRUD

CONTEXT: Implement data access layer for materials table with CRUD operations using parameterized queries.

FILES TO CREATE:
- backend/src/services/database/materials.ts
- backend/src/services/database/materials.test.ts

FILES TO MODIFY:
_None_

DETAILED STEPS:
1. Create materials service with create(), findById(), findBySellerId(), update(), delete() methods
2. Use parameterized queries for all operations
3. Implement soft delete with deleted_at
4. Handle images array serialization
5. Add unit tests for all methods

VALIDATION:
cd backend && npm test -- materials.test.ts

---

ROLE: Backend Engineer

GOAL: Create image upload service with validation

CONTEXT: Create service for handling image uploads with validation (images only, max 5MB).

FILES TO CREATE:
- backend/src/services/upload/image.ts
- backend/src/services/upload/image.test.ts

FILES TO MODIFY:
- backend/package.json
- backend/src/app.ts

DETAILED STEPS:
1. Add multer to package.json for file uploads
2. Create image service with file type validation (images only)
3. Implement max file size validation (5MB)
4. Store files in local uploads directory with unique names
5. Return file path on success
6. Add unit tests

VALIDATION:
cd backend && npm test -- image.test.ts

---

ROLE: Backend Engineer

GOAL: Create material listing API endpoint

CONTEXT: Implement POST /api/materials with authentication, validation, image upload, and sustainability metrics.

FILES TO CREATE:
- backend/src/routes/materials.ts
- backend/src/services/materials/create.ts
- backend/src/services/materials/create.test.ts
- backend/src/middleware/validation/materials.schema.ts

FILES TO MODIFY:
- backend/src/routes/index.ts

DETAILED STEPS:
1. Create materials validation schema with title, description, material_type, quantity, unit, price, currency, images, sustainability_metrics
2. Create material listing service that uploads images and creates material record
3. Associate material with authenticated seller
4. Store sustainability_metrics in related table
5. Create POST /api/materials endpoint with auth middleware
6. Return material_id, title, status, created_at
7. Return 401 for unauthenticated, 422 for validation errors
8. Add integration tests

VALIDATION:
cd backend && npm test -- create.test.ts

---

ROLE: Backend Engineer

GOAL: Create get material by ID endpoint

CONTEXT: Implement GET /api/materials/:material_id returning full details with seller info and sustainability metrics.

FILES TO CREATE:
- backend/src/services/materials/get.ts
- backend/src/services/materials/get.test.ts

FILES TO MODIFY:
- backend/src/routes/materials.ts

DETAILED STEPS:
1. Create get material service that joins with users for seller company_name
2. Include sustainability_metrics from related table
3. Include images array
4. Create GET /api/materials/:id endpoint
5. Return full material details
6. Return 404 for non-existent material
7. Add integration tests

VALIDATION:
cd backend && npm test -- get.test.ts

---

ROLE: Backend Engineer

GOAL: Create update material endpoint

CONTEXT: Implement PUT /api/materials/:material_id allowing owner to update title, description, quantity, price, status.

FILES TO CREATE:
- backend/src/services/materials/update.ts
- backend/src/services/materials/update.test.ts

FILES TO MODIFY:
- backend/src/routes/materials.ts

DETAILED STEPS:
1. Create update service that verifies ownership
2. Allow updating title, description, quantity, price, status
3. Create PUT /api/materials/:id endpoint with auth middleware
4. Return material_id, updated_at
5. Return 401 for unauthenticated, 403 for non-owner, 404 for non-existent
6. Add integration tests

VALIDATION:
cd backend && npm test -- update.test.ts

---

ROLE: Backend Engineer

GOAL: Create delete material endpoint

CONTEXT: Implement DELETE /api/materials/:material_id allowing owner to delete their listing.

FILES TO CREATE:
- backend/src/services/materials/delete.ts
- backend/src/services/materials/delete.test.ts

FILES TO MODIFY:
- backend/src/routes/materials.ts

DETAILED STEPS:
1. Create delete service that verifies ownership and performs soft delete
2. Create DELETE /api/materials/:id endpoint with auth middleware
3. Return confirmation message
4. Return 401 for unauthenticated, 403 for non-owner, 404 for non-existent
5. Add integration tests

VALIDATION:
cd backend && npm test -- delete.test.ts

---

ROLE: Backend Engineer

GOAL: Create search query builder service

CONTEXT: Create service to build dynamic SQL queries with filters for material_type, min_price, max_price, quantity, search_term.

FILES TO CREATE:
- backend/src/services/search/queryBuilder.ts
- backend/src/services/search/queryBuilder.test.ts

FILES TO MODIFY:
_None_

DETAILED STEPS:
1. Create query builder service that builds WHERE clause from filter parameters
2. Handle optional filters: material_type, min_price, max_price, quantity
3. Implement full-text search on title and description using search_term
4. Use parameterized queries to prevent SQL injection
5. Return SQL string and parameters array
6. Add unit tests for various filter combinations

VALIDATION:
cd backend && npm test -- queryBuilder.test.ts

---

ROLE: Backend Engineer

GOAL: Create pagination utility

CONTEXT: Create pagination utility for offset/limit calculation with default 20, max 100 per page.

FILES TO CREATE:
- backend/src/utils/pagination.ts
- backend/src/utils/pagination.test.ts

FILES TO MODIFY:
_None_

DETAILED STEPS:
1. Create pagination utility with calculateOffset(page, limit) function
2. Default limit: 20, max limit: 100
3. Return offset, limit, and total count metadata
4. Add unit tests for edge cases (negative values, max limit)

VALIDATION:
cd backend && npm test -- pagination.test.ts

---

ROLE: Backend Engineer

GOAL: Create materials search endpoint

CONTEXT: Implement GET /api/materials with query parameters, pagination, and filters.

FILES TO CREATE:
- backend/src/services/search/search.ts
- backend/src/services/search/search.test.ts

FILES TO MODIFY:
- backend/src/routes/materials.ts

DETAILED STEPS:
1. Create search service using query builder and pagination
2. Accept query params: material_type, min_price, max_price, quantity, search_term, page, limit
3. Return materials array with thumbnail (first image)
4. Return total, page, limit in response metadata
5. Create GET /api/materials endpoint (same as listing but with query params)
6. Return 400 for invalid query parameters
7. Add integration tests

VALIDATION:
cd backend && npm test -- search.test.ts

---

ROLE: Database Engineer

GOAL: Optimize database queries with indexes

CONTEXT: Analyze search queries with EXPLAIN ANALYZE, add missing indexes, document performance.

FILES TO CREATE:
- backend/migrations/008_add_search_indexes.sql
- backend/docs/query-performance.md

FILES TO MODIFY:
_None_

DETAILED STEPS:
1. Run EXPLAIN ANALYZE on search queries
2. Create migration 008 with additional indexes if needed
3. Consider indexes on: title, description (for full-text search), price, quantity, status
4. Document query performance in query-performance.md
5. Include before/after analysis

VALIDATION:
cd backend && npm run migrate

---

ROLE: Backend Engineer

GOAL: Create transactions database service

CONTEXT: Implement data access layer for transactions table with create, update status, find by buyer/seller.

FILES TO CREATE:
- backend/src/services/database/transactions.ts
- backend/src/services/database/transactions.test.ts

FILES TO MODIFY:
_None_

DETAILED STEPS:
1. Create transactions service with create(), findById(), updateStatus(), findByBuyerId(), findBySellerId() methods
2. Use parameterized queries for all operations
3. Add unit tests for all methods

VALIDATION:
cd backend && npm test -- transactions.test.ts

---

ROLE: Backend Engineer

GOAL: Create transaction state machine

CONTEXT: Create service for managing transaction status transitions: pending -> paid -> shipped -> completed.

FILES TO CREATE:
- backend/src/services/transactions/stateMachine.ts
- backend/src/services/transactions/stateMachine.test.ts

FILES TO MODIFY:
_None_

DETAILED STEPS:
1. Define valid status transitions: pending->paid, paid->shipped, shipped->completed
2. Create canTransition(currentStatus, newStatus) function
3. Create transition(transactionId, newStatus) function
4. Reject invalid transitions with error
5. Add unit tests for all valid and invalid transitions

VALIDATION:
cd backend && npm test -- stateMachine.test.ts

---

ROLE: Backend Engineer

GOAL: Create transaction endpoint

CONTEXT: Implement POST /api/transactions with validation, material availability check, and total calculation.

FILES TO CREATE:
- backend/src/routes/transactions.ts
- backend/src/services/transactions/create.ts
- backend/src/services/transactions/create.test.ts
- backend/src/middleware/validation/transactions.schema.ts

FILES TO MODIFY:
- backend/src/routes/index.ts

DETAILED STEPS:
1. Create transactions validation schema with material_id, quantity, shipping_address
2. Create transaction service that validates material exists and has sufficient quantity
3. Calculate total from material price * quantity
4. Create transaction with pending status
5. Create POST /api/transactions endpoint with auth middleware
6. Return transaction_id, status, total, created_at
7. Return 401, 404, 422 as appropriate
8. Add integration tests

VALIDATION:
cd backend && npm test -- create.test.ts

---

ROLE: Backend Engineer

GOAL: Create get transaction endpoint

CONTEXT: Implement GET /api/transactions/:transaction_id returning transaction details with material info.

FILES TO CREATE:
- backend/src/services/transactions/get.ts
- backend/src/services/transactions/get.test.ts

FILES TO MODIFY:
- backend/src/routes/transactions.ts

DETAILED STEPS:
1. Create get transaction service that joins with materials for title
2. Verify request user is buyer or seller
3. Create GET /api/transactions/:id endpoint with auth middleware
4. Return status, total, created_at, material title
5. Return 401 for unauthenticated, 404 for non-existent
6. Add integration tests

VALIDATION:
cd backend && npm test -- get.test.ts

---

ROLE: Backend Engineer

GOAL: Integrate Stripe payment gateway

CONTEXT: Integrate with Stripe in sandbox mode for payment processing.

FILES TO CREATE:
- backend/src/services/payments/stripe.ts
- backend/src/services/payments/stripe.test.ts

FILES TO MODIFY:
- backend/package.json

DETAILED STEPS:
1. Add stripe to package.json dependencies
2. Create stripe service initialized with STRIPE_SECRET_KEY from config
3. Configure sandbox mode (test mode)
4. Implement createPaymentIntent(amount, currency, metadata) function
5. Add unit tests

VALIDATION:
cd backend && npm test -- stripe.test.ts

---

ROLE: Backend Engineer

GOAL: Create payment processing endpoint

CONTEXT: Implement POST /api/payments to process payment for transaction and update status.

FILES TO CREATE:
- backend/src/routes/payments.ts
- backend/src/services/payments/process.ts
- backend/src/services/payments/process.test.ts

FILES TO MODIFY:
- backend/src/routes/index.ts

DETAILED STEPS:
1. Create payment service that creates Stripe payment intent
2. Update transaction status to 'paid' on success
3. Create POST /api/payments endpoint with auth middleware
4. Accept transaction_id and payment_method_id
5. Return payment_id, status, transaction_id
6. Return 401, 402, 404 as appropriate
7. Add integration tests with sandbox

VALIDATION:
cd backend && npm test -- process.test.ts

---

ROLE: Backend Engineer

GOAL: Create sustainability metrics database service

CONTEXT: Implement data access layer for sustainability_metrics table with CRUD operations.

FILES TO CREATE:
- backend/src/services/database/sustainabilityMetrics.ts
- backend/src/services/database/sustainabilityMetrics.test.ts

FILES TO MODIFY:
_None_

DETAILED STEPS:
1. Create sustainability metrics service with create(), findByMaterialId(), update() methods
2. Use parameterized queries
3. Handle carbon_footprint, water_usage, chemical_composition fields
4. Add unit tests

VALIDATION:
cd backend && npm test -- sustainabilityMetrics.test.ts

---

ROLE: Backend Engineer

GOAL: Create passport database service

CONTEXT: Implement data access layer for digital_product_passports table.

FILES TO CREATE:
- backend/src/services/database/passports.ts
- backend/src/services/database/passports.test.ts

FILES TO MODIFY:
_None_

DETAILED STEPS:
1. Create passport service with create(), findByMaterialId(), update() methods
2. Handle supply_chain and certifications arrays
3. Use parameterized queries
4. Add unit tests

VALIDATION:
cd backend && npm test -- passports.test.ts

---

ROLE: Backend Engineer

GOAL: Create passport endpoint

CONTEXT: Implement GET /api/passports/:material_id returning passport with sustainability metrics and supply chain.

FILES TO CREATE:
- backend/src/routes/passports.ts
- backend/src/services/passports/get.ts
- backend/src/services/passports/get.test.ts

FILES TO MODIFY:
- backend/src/routes/index.ts

DETAILED STEPS:
1. Create get passport service joining with sustainability_metrics
2. Create GET /api/passports/:material_id endpoint
3. Return passport_id, material_id, material_type, origin, manufacture_date
4. Include sustainability_metrics (carbon, water, chemicals)
5. Include supply_chain array
6. Return 404 for non-existent passport
7. Add integration tests

VALIDATION:
cd backend && npm test -- get.test.ts

---

ROLE: Backend Engineer

GOAL: Create add metrics endpoint

CONTEXT: Implement POST /api/passports/:material_id/metrics allowing manufacturer to add sustainability metrics.

FILES TO CREATE:
- backend/src/services/passports/addMetrics.ts
- backend/src/services/passports/addMetrics.test.ts

FILES TO MODIFY:
- backend/src/routes/passports.ts

DETAILED STEPS:
1. Create add metrics service that verifies material ownership
2. Store carbon_footprint, water_usage, chemical_composition
3. Create POST /api/passports/:material_id/metrics endpoint with auth middleware
4. Return metric_id, created_at
5. Return 401, 403 as appropriate
6. Add integration tests

VALIDATION:
cd backend && npm test -- addMetrics.test.ts

---

ROLE: Backend Engineer

GOAL: Create messaging database service

CONTEXT: Implement data access layer for messages table with CRUD, conversation queries, unread counts.

FILES TO CREATE:
- backend/src/services/database/messages.ts
- backend/src/services/database/messages.test.ts

FILES TO MODIFY:
_None_

DETAILED STEPS:
1. Create messages service with create(), findConversation(), markAsRead(), getUnreadCount() methods
2. findConversation() retrieves messages between two users
3. Implement parameterized queries
4. Add unit tests

VALIDATION:
cd backend && npm test -- messages.test.ts

---

ROLE: Backend Engineer

GOAL: Create send message endpoint

CONTEXT: Implement POST /api/messages with recipient validation and optional material context.

FILES TO CREATE:
- backend/src/routes/messages.ts
- backend/src/services/messages/send.ts
- backend/src/services/messages/send.test.ts
- backend/src/middleware/validation/messages.schema.ts

FILES TO MODIFY:
- backend/src/routes/index.ts

DETAILED STEPS:
1. Create messages validation schema with recipient_id, material_id (optional), content
2. Create send message service that validates recipient exists
3. Link to material context if provided
4. Create POST /api/messages endpoint with auth middleware
5. Return message_id, sent_at
6. Return 401, 422 as appropriate
7. Add integration tests

VALIDATION:
cd backend && npm test -- send.test.ts

---

ROLE: Backend Engineer

GOAL: Create conversations list endpoint

CONTEXT: Implement GET /api/messages/conversations returning list with last message and user info.

FILES TO CREATE:
- backend/src/services/messages/getConversations.ts
- backend/src/services/messages/getConversations.test.ts

FILES TO MODIFY:
- backend/src/routes/messages.ts

DETAILED STEPS:
1. Create get conversations service joining with users for company_name
2. Include last_message preview and updated_at
3. Group by other user in conversation
4. Create GET /api/messages/conversations endpoint with auth middleware
5. Return user_id, company_name, last_message, updated_at
6. Return 401 for unauthenticated
7. Add integration tests

VALIDATION:
cd backend && npm test -- getConversations.test.ts

---

ROLE: Backend Engineer

GOAL: Create conversation history endpoint

CONTEXT: Implement GET /api/messages/:user_id returning message history with specific user.

FILES TO CREATE:
- backend/src/services/messages/getHistory.ts
- backend/src/services/messages/getHistory.test.ts

FILES TO MODIFY:
- backend/src/routes/messages.ts

DETAILED STEPS:
1. Create get history service using findConversation()
2. Order by created_at ascending
3. Include material context when present
4. Create GET /api/messages/:user_id endpoint with auth middleware
5. Return messages array
6. Return 401 for unauthenticated
7. Add integration tests

VALIDATION:
cd backend && npm test -- getHistory.test.ts

---

ROLE: Backend Engineer

GOAL: Create Scope 3 emission calculator service

CONTEXT: Create service to calculate Scope 3 emissions from purchased materials based on carbon_footprint data.

FILES TO CREATE:
- backend/src/services/reports/emissionCalculator.ts
- backend/src/services/reports/emissionCalculator.test.ts

FILES TO MODIFY:
_None_

DETAILED STEPS:
1. Create emission calculator service
2. Calculate total_carbon_saved vs virgin materials
3. Calculate total_water_saved
4. Aggregate by date range (start_date, end_date)
5. Query transactions joined with sustainability_metrics
6. Add unit tests

VALIDATION:
cd backend && npm test -- emissionCalculator.test.ts

---

ROLE: Backend Engineer

GOAL: Create sustainability report endpoint

CONTEXT: Implement GET /api/reports/sustainability with start_date and end_date query parameters.

FILES TO CREATE:
- backend/src/routes/reports.ts
- backend/src/services/reports/sustainability.ts
- backend/src/services/reports/sustainability.test.ts

FILES TO MODIFY:
- backend/src/routes/index.ts

DETAILED STEPS:
1. Create sustainability report service using emission calculator
2. Validate date range params
3. Create GET /api/reports/sustainability endpoint with auth middleware
4. Return total_carbon_saved, total_water_saved, materials_purchased, scope3_emissions
5. Return 401, 400 as appropriate
6. Add integration tests

VALIDATION:
cd backend && npm test -- sustainability.test.ts

---

ROLE: Backend Engineer

GOAL: Create CSV export service

CONTEXT: Create service to export sustainability report data as CSV.

FILES TO CREATE:
- backend/src/services/reports/csvExport.ts
- backend/src/services/reports/csvExport.test.ts

FILES TO MODIFY:
_None_

DETAILED STEPS:
1. Create CSV export service
2. Generate CSV from report data array
3. Properly escape special characters (commas, quotes, newlines)
4. Add unit tests

VALIDATION:
cd backend && npm test -- csvExport.test.ts

---

ROLE: Backend Engineer

GOAL: Create report export endpoint

CONTEXT: Implement GET /api/reports/export returning CSV export of sustainability report.

FILES TO CREATE:
- backend/src/services/reports/export.ts
- backend/src/services/reports/export.test.ts

FILES TO MODIFY:
- backend/src/routes/reports.ts

DETAILED STEPS:
1. Create export service that generates CSV report
2. Create GET /api/reports/export endpoint with auth middleware
3. Support format query param (csv only for now)
4. Return file with Content-Type: text/csv and Content-Disposition header
5. Return 401 for unauthenticated
6. Add integration tests

VALIDATION:
cd backend && npm test -- export.test.ts

---

ROLE: Backend Engineer

GOAL: Set up Redis client connection

CONTEXT: Configure Redis client connection with connection handling and error recovery.

FILES TO CREATE:
- backend/src/config/redis.ts
- backend/src/config/redis.test.ts

FILES TO MODIFY:
- backend/package.json

DETAILED STEPS:
1. Add redis to package.json dependencies
2. Create redis client configuration
3. Implement connection handling
4. Implement error recovery logic
5. Export client instance
6. Add unit tests

VALIDATION:
cd backend && npm test -- redis.test.ts

---

ROLE: Backend Engineer

GOAL: Implement material cache with Redis

CONTEXT: Cache hot material listings with 5 minute TTL, invalidate on updates.

FILES TO CREATE:
- backend/src/services/cache/materialCache.ts
- backend/src/services/cache/materialCache.test.ts

FILES TO MODIFY:
- backend/src/services/materials/get.ts
- backend/src/services/materials/update.ts
- backend/src/services/materials/delete.ts

DETAILED STEPS:
1. Create material cache service with cache key pattern: material:{material_id}
2. Implement get() that checks cache first, falls back to DB
3. Implement set() with 5 minute TTL
4. Implement invalidate() on updates/deletes
5. Integrate into get, update, delete services
6. Add unit tests

VALIDATION:
cd backend && npm test -- materialCache.test.ts

---

ROLE: Backend Engineer

GOAL: Implement search results cache

CONTEXT: Cache search query results with 2 minute TTL using hash of query parameters.

FILES TO CREATE:
- backend/src/services/cache/searchCache.ts
- backend/src/services/cache/searchCache.test.ts

FILES TO MODIFY:
- backend/src/services/search/search.ts

DETAILED STEPS:
1. Create search cache service
2. Generate cache key from hash of query params: search:{hash}
3. Implement get() with 2 minute TTL
4. Invalidate on material changes
5. Integrate into search service
6. Add unit tests

VALIDATION:
cd backend && npm test -- searchCache.test.ts

---

ROLE: Frontend Engineer

GOAL: Create login and registration pages

CONTEXT: Build login and registration pages with forms, API integration, JWT storage, and auth context.

FILES TO CREATE:
- frontend/src/pages/LoginPage.tsx
- frontend/src/pages/RegisterPage.tsx
- frontend/src/contexts/AuthContext.tsx
- frontend/src/services/api.ts
- frontend/src/services/authApi.ts
- frontend/src/hooks/useAuth.ts

FILES TO MODIFY:
- frontend/src/router/index.tsx
- frontend/package.json

DETAILED STEPS:
1. Add axios to package.json for API calls
2. Create api service with axios instance and base URL
3. Create authApi with login, register, getCurrentUser functions
4. Create AuthContext with auth state and login/logout/register actions
5. Store JWT in localStorage
6. Create LoginPage with email/password form
7. Create RegisterPage with all required fields
8. Add form validation with error display
9. Redirect to dashboard on success
10. Update router with auth routes

VALIDATION:
cd frontend && npm run build

---

ROLE: Frontend Engineer

GOAL: Create protected route component

CONTEXT: Implement higher-order component to protect routes requiring authentication.

FILES TO CREATE:
- frontend/src/components/ProtectedRoute.tsx

FILES TO MODIFY:
- frontend/src/router/index.tsx

DETAILED STEPS:
1. Create ProtectedRoute component that checks auth context
2. Redirect to login if unauthenticated
3. Preserve intended destination in location state
4. Wrap protected routes in router

VALIDATION:
cd frontend && npm run build

---

ROLE: Frontend Engineer

GOAL: Create material listing form component

CONTEXT: Build form for creating material listings with file upload, sustainability metrics, and validation.

FILES TO CREATE:
- frontend/src/pages/CreateMaterialPage.tsx
- frontend/src/components/MaterialForm.tsx
- frontend/src/components/ImageUpload.tsx
- frontend/src/services/materialsApi.ts

FILES TO MODIFY:
- frontend/src/router/index.tsx

DETAILED STEPS:
1. Create materialsApi with createMaterial function
2. Create ImageUpload component with preview
3. Create MaterialForm with all required fields
4. Add sustainability metrics inputs
5. Implement form validation
6. Handle success/error responses
7. Create CreateMaterialPage using MaterialForm
8. Add to protected routes

VALIDATION:
cd frontend && npm run build

---

ROLE: Frontend Engineer

GOAL: Create material search page with filters

CONTEXT: Build search page with filters (material type, price range, quantity) and paginated results.

FILES TO CREATE:
- frontend/src/pages/SearchMaterialsPage.tsx
- frontend/src/components/MaterialCard.tsx
- frontend/src/components/SearchFilters.tsx
- frontend/src/components/Pagination.tsx

FILES TO MODIFY:
- frontend/src/router/index.tsx

DETAILED STEPS:
1. Create SearchFilters component with type, price, quantity inputs
2. Create MaterialCard component for material display
3. Create Pagination component
4. Create SearchMaterialsPage with filter state
5. Implement API call with query params
6. Display materials grid
7. Handle pagination
8. Add material detail modal/page link

VALIDATION:
cd frontend && npm run build

---

ROLE: Frontend Engineer

GOAL: Create material details page

CONTEXT: Build page showing full material details with Digital Product Passport and sustainability metrics.

FILES TO CREATE:
- frontend/src/pages/MaterialDetailsPage.tsx
- frontend/src/components/ProductPassport.tsx
- frontend/src/components/SustainabilityMetrics.tsx

FILES TO MODIFY:
- frontend/src/router/index.tsx

DETAILED STEPS:
1. Create ProductPassport component
2. Create SustainabilityMetrics component
3. Create MaterialDetailsPage with all material info
4. Add contact seller button
5. Add purchase button (for brands)
6. Implement API call for material details

VALIDATION:
cd frontend && npm run build

---

ROLE: Frontend Engineer

GOAL: Create checkout flow

CONTEXT: Build checkout flow with shipping address form, payment form, and confirmation.

FILES TO CREATE:
- frontend/src/pages/CheckoutPage.tsx
- frontend/src/components/ShippingForm.tsx
- frontend/src/components/PaymentForm.tsx
- frontend/src/pages/OrderConfirmationPage.tsx
- frontend/src/services/transactionsApi.ts
- frontend/src/services/paymentsApi.ts

FILES TO MODIFY:
- frontend/src/router/index.tsx

DETAILED STEPS:
1. Create transactionsApi with createTransaction function
2. Create paymentsApi with processPayment function
3. Create ShippingForm component
4. Create PaymentForm component
5. Create CheckoutPage with multi-step flow
6. Create OrderConfirmationPage
7. Handle errors and success states

VALIDATION:
cd frontend && npm run build

---

ROLE: Frontend Engineer

GOAL: Create messaging UI

CONTEXT: Build messaging UI with conversation list, chat view, and material context.

FILES TO CREATE:
- frontend/src/pages/MessagesPage.tsx
- frontend/src/components/ConversationList.tsx
- frontend/src/components/ChatView.tsx
- frontend/src/services/messagesApi.ts

FILES TO MODIFY:
- frontend/src/router/index.tsx

DETAILED STEPS:
1. Create messagesApi with send, getConversations, getHistory functions
2. Create ConversationList component with last message and unread indicator
3. Create ChatView component with message history
4. Add send message input
5. Display material context when present
6. Implement polling for updates
7. Create MessagesPage with list and view

VALIDATION:
cd frontend && npm run build

---

ROLE: Frontend Engineer

GOAL: Create user dashboard

CONTEXT: Build user dashboard with different views for manufacturers (listings, transactions) and brands (purchases, savings).

FILES TO CREATE:
- frontend/src/pages/DashboardPage.tsx
- frontend/src/components/ManufacturerDashboard.tsx
- frontend/src/components/BrandDashboard.tsx

FILES TO MODIFY:
- frontend/src/router/index.tsx

DETAILED STEPS:
1. Create ManufacturerDashboard with my listings, active transactions
2. Create BrandDashboard with purchased materials, savings metrics
3. Add quick actions
4. Display recent activity
5. Create DashboardPage that renders based on user role

VALIDATION:
cd frontend && npm run build

---

ROLE: Frontend Engineer

GOAL: Create sustainability reports page

CONTEXT: Build page displaying sustainability metrics, Scope 3 emissions, with export functionality.

FILES TO CREATE:
- frontend/src/pages/SustainabilityReportPage.tsx
- frontend/src/components/DateRangePicker.tsx
- frontend/src/components/MetricsDisplay.tsx
- frontend/src/components/EmissionsChart.tsx
- frontend/src/services/reportsApi.ts

FILES TO MODIFY:
- frontend/src/router/index.tsx
- frontend/package.json

DETAILED STEPS:
1. Create reportsApi with getSustainability, exportReport functions
2. Create DateRangePicker component
3. Create MetricsDisplay component (carbon saved, water saved)
4. OPTIONAL: Add recharts or chart.js for EmissionsChart
5. Create CSV export button
6. Add data tables
7. Create SustainabilityReportPage

VALIDATION:
cd frontend && npm run build

---

ROLE: Test Engineer

GOAL: Write auth service unit tests

CONTEXT: Create Jest unit tests for password hashing, token generation, email validation.

FILES TO CREATE:
- backend/src/services/auth/__tests__/password.test.ts
- backend/src/services/auth/__tests__/jwt.test.ts
- backend/src/utils/__tests__/validation.test.ts

FILES TO MODIFY:
- backend/package.json

DETAILED STEPS:
1. Add jest, ts-jest, @types/jest to package.json
2. Create jest.config.js
3. Create password.test.ts with hash and compare tests
4. Create jwt.test.ts with token generation and validation tests
5. Create validation.test.ts with email tests
6. Ensure 100% coverage for auth utilities

VALIDATION:
cd backend && npm test

---

ROLE: Test Engineer

GOAL: Write material service unit tests

CONTEXT: Create Jest unit tests for material CRUD operations and validations.

FILES TO CREATE:
- backend/src/services/materials/__tests__/materials.test.ts

FILES TO MODIFY:
- backend/package.json

DETAILED STEPS:
1. Create materials.test.ts with CRUD tests
2. Test material creation, update, deletion
3. Test validation edge cases
4. Use mock database

VALIDATION:
cd backend && npm test -- materials.test.ts

---

ROLE: Test Engineer

GOAL: Write transaction service unit tests

CONTEXT: Create Jest unit tests for transaction creation and status transitions.

FILES TO CREATE:
- backend/src/services/transactions/__tests__/transactions.test.ts

FILES TO MODIFY:
- backend/package.json

DETAILED STEPS:
1. Create transactions.test.ts with creation tests
2. Test valid status transitions
3. Test invalid transitions
4. Test total calculations
5. Use mock database

VALIDATION:
cd backend && npm test -- transactions.test.ts

---

ROLE: Test Engineer

GOAL: Write API integration tests

CONTEXT: Create integration tests using supertest for all API endpoints with test database.

FILES TO CREATE:
- backend/tests/integration/auth.test.ts
- backend/tests/integration/materials.test.ts
- backend/tests/integration/search.test.ts
- backend/tests/integration/transactions.test.ts
- backend/tests/integration/passports.test.ts
- backend/tests/integration/messages.test.ts
- backend/tests/integration/reports.test.ts

FILES TO MODIFY:
- backend/package.json

DETAILED STEPS:
1. Add supertest to package.json
2. Create test database setup/teardown
3. Create auth.test.ts for register, login, me endpoints
4. Create materials.test.ts for CRUD endpoints
5. Create search.test.ts for search endpoint
6. Create transactions.test.ts for transaction endpoints
7. Create passports.test.ts for passport endpoints
8. Create messages.test.ts for messaging endpoints
9. Create reports.test.ts for reporting endpoints

VALIDATION:
cd backend && npm test

---

ROLE: Test Engineer

GOAL: Write E2E tests with Playwright

CONTEXT: Create Playwright E2E tests for critical user journeys.

FILES TO CREATE:
- frontend/e2e/registration.spec.ts
- frontend/e2e/login.spec.ts
- frontend/e2e/create-material.spec.ts
- frontend/e2e/search-materials.spec.ts
- frontend/e2e/purchase-flow.spec.ts
- frontend/e2e/passport.spec.ts
- frontend/e2e/messaging.spec.ts
- frontend/e2e/reports.spec.ts
- playwright.config.ts

FILES TO MODIFY:
- frontend/package.json

DETAILED STEPS:
1. Add @playwright/test to package.json
2. Create playwright.config.ts
3. Create registration.spec.ts for signup flow
4. Create login.spec.ts for login flow
5. Create create-material.spec.ts for listing creation
6. Create search-materials.spec.ts for search flow
7. Create purchase-flow.spec.ts for checkout
8. Create passport.spec.ts for DPP viewing
9. Create messaging.spec.ts for messaging
10. Create reports.spec.ts for sustainability report

VALIDATION:
cd frontend && npx playwright test

---

ROLE: Backend Engineer

GOAL: Create GDPR export and delete endpoints

CONTEXT: Create user data export endpoint and data deletion endpoint.

FILES TO CREATE:
- backend/src/services/auth/export.ts
- backend/src/services/auth/delete.ts
- backend/src/services/auth/gdpr.test.ts

FILES TO MODIFY:
- backend/src/routes/auth.ts

DETAILED STEPS:
1. Create export service that retrieves all user data including related records
2. Create delete service that marks account for deletion
3. Create GET /api/auth/export endpoint with auth
4. Create DELETE /api/auth/delete endpoint with auth
5. Add integration tests

VALIDATION:
cd backend && npm test -- gdpr.test.ts

---

ROLE: Backend Engineer

GOAL: Add gzip compression middleware

CONTEXT: Enable gzip compression for all API responses.

FILES TO CREATE:
- backend/src/middleware/compression.ts

FILES TO MODIFY:
- backend/package.json
- backend/src/app.ts

DETAILED STEPS:
1. Add compression to package.json
2. Create compression middleware
3. Apply to all routes in app.ts
4. Verify functionality

VALIDATION:
cd backend && npm run build

---

ROLE: DevOps Engineer

GOAL: Configure production PostgreSQL

CONTEXT: Set up production PostgreSQL with proper connection pooling and backup strategy.

FILES TO CREATE:
- backend/docs/database-setup.md
- scripts/backup.sh

FILES TO MODIFY:
- .env.example
- backend/src/config/database.ts

DETAILED STEPS:
1. Update database.ts with production connection pooling config
2. Create database-setup.md documentation
3. Create backup.sh script for database backups
4. Document migration process

VALIDATION:
cd backend && npm run build

---

ROLE: Backend Engineer

GOAL: Implement metrics collection

CONTEXT: Configure metrics collection for API response times, request counts, error rates.

FILES TO CREATE:
- backend/src/services/metrics/index.ts
- backend/src/middleware/metrics.ts

FILES TO MODIFY:
- backend/src/app.ts
- backend/package.json

DETAILED STEPS:
1. OPTIONAL: Add prom-client for Prometheus metrics
2. Create metrics service collecting response times (p50, p95, p99)
3. Track request count per endpoint
4. Track active user sessions
5. Track transaction success/failure rate
6. Monitor database pool usage
7. Create metrics middleware
8. Add metrics endpoint
9. Integrate into app.ts

VALIDATION:
cd backend && npm run build

---

ROLE: Backend Engineer

GOAL: Create comprehensive health check

CONTEXT: Create comprehensive health check verifying database, Redis, and payment gateway.

FILES TO CREATE:
- backend/src/services/health/index.ts
- backend/src/routes/health.ts

FILES TO MODIFY:
- backend/src/routes/index.ts

DETAILED STEPS:
1. Replace existing health route with comprehensive checks
2. Create health service with checks for: database, Redis, payment gateway
3. Return overall status and individual service statuses
4. Return appropriate status codes (503 if any service down)

VALIDATION:
cd backend && npm run build

---

ROLE: DevOps Engineer

GOAL: Set up production environment config

CONTEXT: Set up production environment variables and configuration.

FILES TO CREATE:
- .env.production.example

FILES TO MODIFY:
- backend/src/config/index.ts

DETAILED STEPS:
1. Create production .env template
2. Add NODE_ENV validation
3. Document secrets management
4. Add production-specific config values

VALIDATION:
cd backend && npm run build

---

ROLE: DevOps Engineer

GOAL: Create deployment documentation

CONTEXT: Document deployment process, environment setup, and operational procedures.

FILES TO CREATE:
- docs/DEPLOYMENT.md
- docs/OPERATIONS.md
- docs/ROLLBACK.md

FILES TO MODIFY:
_None_

DETAILED STEPS:
1. Create DEPLOYMENT.md with deployment guide
2. Create OPERATIONS.md with runbook for common issues
3. Create ROLLBACK.md with rollback procedures
4. Include environment setup instructions

VALIDATION:
cat docs/DEPLOYMENT.md
