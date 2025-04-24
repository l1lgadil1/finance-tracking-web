# System Patterns: AqshaTracker Backend MVP

## Architecture

- **Monolithic Backend:** A single NestJS application serving a REST API.
- **Modular Design:** The application is structured into feature modules (e.g., `AuthModule`, `TransactionModule`) following NestJS conventions.
- **Database Interaction:** Centralized through a global `PrismaModule` and `PrismaService` using Prisma ORM.

## Key Technical Decisions (Initial)

- **Framework:** NestJS (TypeScript).
- **Database:** PostgreSQL.
- **ORM:** Prisma.
- **Authentication:** JWT (JSON Web Tokens) managed by Passport.js (`passport-jwt` strategy).
- **Password Hashing:** `bcrypt`.
- **Validation:** `zod` via `nestjs-zod` integration for DTOs.
- **API Documentation:** Swagger (`@nestjs/swagger`).
- **Configuration:** Environment variables managed by `@nestjs/config`.

## Component Relationships (High-Level)

```mermaid
flowchart TD
    Client[Client Application] -->|HTTP Request| API{REST API Gateway}

    subgraph Backend (NestJS Application)
        API --> Controller
        Controller -->|Uses| Service
        Service -->|Uses| PrismaService[PrismaService]
        Controller -->|Uses DTOs with| ZodValidation[nestjs-zod Pipe]
        Controller -->|Protected by| JwtAuthGuard[JwtAuthGuard]
        JwtAuthGuard -->|Uses| PassportJwtStrategy[Passport JWT Strategy]
        PassportJwtStrategy -->|Uses| AuthService
    end

    PrismaService -->|Talks to| DB[(PostgreSQL Database)]

    subgraph Modules
        AppModule[AppModule]
        AuthModule[AuthModule]
        UserModule[UserModule]
        ProfileModule[ProfileModule]
        AccountModule[AccountModule]
        TransactionModule[TransactionModule]
        CategoryModule[CategoryModule]
        GoalModule[GoalModule]
        SubscriptionModule[SubscriptionModule]
        AiRequestModule[AiRequestModule]
        PrismaModule[PrismaModule (Global)]
        ConfigModule[ConfigModule (Global)]
    end

    AppModule --> ConfigModule
    AppModule --> PrismaModule
    AppModule --> AuthModule
    AppModule --> UserModule
    AppModule --> ProfileModule
    AppModule --> AccountModule
    AppModule --> TransactionModule
    AppModule --> CategoryModule
    AppModule --> GoalModule
    AppModule --> SubscriptionModule
    AppModule --> AiRequestModule

    AuthModule --> UserModule
    AuthModule --> JwtModule[JwtModule]
    AuthModule --> PassportModule[PassportModule]

    UserModule --> PrismaModule
    ProfileModule --> PrismaModule
    AccountModule --> PrismaModule
    TransactionModule --> PrismaModule
    CategoryModule --> PrismaModule
    GoalModule --> PrismaModule
    SubscriptionModule --> PrismaModule
    AiRequestModule --> PrismaModule
```

## Design Patterns

- **Dependency Injection:** Core to NestJS.
- **Module Pattern:** Encapsulating features.
- **Service Layer:** Business logic abstraction.
- **Repository Pattern (Implicit via Prisma):** Data access abstraction.
- **Decorator Pattern:** Used extensively by NestJS (e.g., `@Controller`, `@Injectable`, `@Get`, custom decorators like `@CurrentUser`).
- **Middleware/Pipes/Guards:** Handling cross-cutting concerns (validation, authentication, logging). 