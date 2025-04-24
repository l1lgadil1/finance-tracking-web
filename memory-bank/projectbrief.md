# Project Brief: AqshaTracker Backend MVP

## Goal

Create a Minimum Viable Product (MVP) for the backend of the AqshaTracker personal finance tracking application.

## Core Requirements

1.  **Technology Stack:**
    - Framework: NestJS
    - Database: PostgreSQL
    - ORM: Prisma
    - API: REST
    - Authentication: Passport.js + JWT + bcrypt
    - Validation: Zod (via `nestjs-zod`)
    - API Documentation: Swagger
    - Configuration: `.env` files

2.  **Database Schema:**
    - Utilize the provided `prisma/schema.prisma` containing `User`, `Profile`, `Account`, `Transaction` (with various types), `Category`, `Goal`, `Subscription` (mock), and `AIRequestLog` (mock).
    - Assume migrations and Prisma Client are generated.

3.  **Functionality:**
    - **Prisma Setup:** Global `PrismaModule` and `PrismaService`.
    - **Authentication:**
        - User registration (email/password).
        - User login (email/password).
        - Password hashing (`bcrypt`).
        - JWT generation and validation.
        - Route protection using `JwtAuthGuard`.
        - `@CurrentUser()` decorator to access authenticated user ID.
    - **CRUD Operations:** Implement standard Create, Read, Update, Delete endpoints for all core entities (`User`, `Profile`, `Account`, `Transaction`, `Category`, `Goal`, `Subscription`, `AIRequestLog`).
        - Use `nestjs-zod` for DTOs and request validation.
        - **Data Ownership:** All data entities must be associated with the currently authenticated user (`userId`). Operations must be scoped to the user's data.
        - **Transaction Logic:** Handle specific business logic for different transaction types (e.g., updating account balances for income/expense/transfer, managing debt status).
        - **Filtering:** Implement list filtering for transactions (by type, date range, profile, account, category).
    - **Swagger Documentation:**
        - Enable Swagger UI at `/api/docs`.
        - Annotate all controllers and endpoints (`@ApiTags`, `@ApiOperation`, `@ApiResponse`, etc.).

4.  **Project Structure:**
    - Follow the standard NestJS modular structure, creating separate modules for each entity (`auth`, `user`, `transaction`, etc.) within the `src/` directory.
    - Place Prisma setup in `src/prisma/`.

## Definition of Done (MVP)

A functional backend application that meets all the core requirements listed above, is ready for deployment (configuration handled via environment variables), and can be used by a frontend client application via its documented REST API. 