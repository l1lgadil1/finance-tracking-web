# Product Context: AqshaTracker Backend MVP

## Why This Project Exists

To provide the server-side functionality for AqshaTracker, a personal finance tracking application.

## Problem Solved

Users need a reliable and secure backend to store, manage, and analyze their financial data, including income, expenses, transfers, debts, budgets, and goals.

## How It Should Work (Backend Perspective)

- **User Management:** Allow users to register and log in securely.
- **Data Storage:** Persist user-specific financial data (profiles, accounts, transactions, categories, goals) in a PostgreSQL database.
- **API Access:** Expose a REST API for client applications (web, mobile) to interact with the data.
- **Data Integrity:** Ensure data consistency, especially for transactions involving multiple accounts (transfers, debt repayments).
- **Security:** Protect user data through authentication (JWT) and authorization (ensuring users can only access their own data).
- **Validation:** Validate all incoming data to prevent errors and ensure consistency.
- **Scalability (Future Consideration):** While an MVP, the architecture should be clean enough to allow for future scaling and feature additions.

## User Experience Goals (Influencing Backend)

- **Responsiveness:** The API should respond quickly to client requests.
- **Reliability:** Data should be stored accurately and consistently.
- **Security:** Users must trust that their financial data is safe.
- **Ease of Use (for Frontend Devs):** The API should be well-documented (Swagger) and follow predictable REST conventions.

## Core Entities (from `prisma/schema.prisma`)

- `User`: Stores login credentials (email, hashed password).
- `Profile`: User-specific settings and potentially default currency/preferences (linked one-to-one with User).
- `Account`: Represents financial accounts (e.g., cash, bank account, credit card) with balances.
- `Transaction`: Records financial events (income, expense, transfer, debt operations) linked to accounts and categories.
- `Category`: User-defined categories for transactions.
- `Goal`: Financial goals set by the user.
- `Subscription`: (Mock entity for now, representing potential future premium features).
- `AIRequestLog`: (Mock entity for now, representing potential future AI-powered features). 