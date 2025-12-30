# Architecture Requirements Document

## 🧱 System Overview
FabricLoop is a B2B circular economy marketplace platform connecting#  textile manufacturers with excess inventory (deadstock) to fashion brands seeking sustainable materials. The system provides material listing, search, transaction workflows, and automated sustainability compliance through Digital Product Passports that track environmental metrics (carbon footprint, water usage, chemical composition) for Scope 3 emission reporting.

## 🏗 Architecture Style
Three-tier web application with separate frontend, backend API, and database layers

## 🎨 Frontend Architecture
- **Framework:** React with component-based architecture
- **State Management:** React hooks and Context API for local state
- **Routing:** React Router for client-side routing
- **Build Tooling:** Vite for development and production builds

## 🧠 Backend Architecture
- **Approach:** Monolithic REST API server
- **API Style:** RESTful JSON API
- **Services:**
- Material listing service
- User authentication service
- Digital Product Passport service
- Search and filtering service
- Messaging service
- Transaction workflow service
- Sustainability reporting service

## 🗄 Data Layer
- **Primary Store:** PostgreSQL relational database
- **Relationships:** Foreign key relationships between users, materials, transactions, messages, and sustainability metrics
- **Migrations:** Database migrations via migration tool (e.g., node-pg-migrate)

## ☁️ Infrastructure
- **Hosting:** Cloud hosting platform (e.g., AWS, Render, or similar) with managed PostgreSQL
- **Scaling Strategy:** Vertical scaling for initial launch, database connection pooling, CDN for static assets
- **CI/CD:** Git-based CI/CD pipeline with automated testing and deployment

## ⚖️ Key Trade-offs
- Monolithic architecture chosen over microservices for faster initial development and simpler operations
- REST API over GraphQL for simplicity and standard tooling
- PostgreSQL chosen over NoSQL for strong relational data integrity and ACID compliance for transactions
- Client-side routing for SPA experience over SSR for reduced infrastructure complexity

## 📐 Non-Functional Requirements
- Support 100,000+ SKU listings with sub-second search responses
- 99.5% uptime during business hours
- Support 500+ concurrent users
- Responsive UI for desktop and tablet browsers (320px-2560px)
- GDPR and data privacy compliance with user data export and deletion
- Secure payment processing integration (PCI compliance)
- Search query response time < 500ms for 95th percentile
- API response time < 200ms for non-complex queries
