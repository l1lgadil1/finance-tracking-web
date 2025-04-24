# Product Context: AqshaTracker Application

## Why This Project Exists

To provide a personal finance tracking application that helps users manage their money effectively through an intuitive interface and robust backend.

## Problem Solved

Users need a reliable, secure, and user-friendly application to track and manage their financial data, including income, expenses, transfers, debts, budgets, and goals.

## How It Should Work

### Backend Perspective
- **User Management:** Allow users to register and log in securely.
- **Data Storage:** Persist user-specific financial data (profiles, accounts, transactions, categories, goals) in a PostgreSQL database.
- **API Access:** Expose a REST API for client applications (web, mobile) to interact with the data.
- **Data Integrity:** Ensure data consistency, especially for transactions involving multiple accounts (transfers, debt repayments).
- **Security:** Protect user data through authentication (JWT) and authorization (ensuring users can only access their own data).
- **Validation:** Validate all incoming data to prevent errors and ensure consistency.

### Frontend Perspective
- **Clean, Intuitive Interface:** Provide a minimalist, blue-themed UI that's easy to navigate and visually appealing.
- **Responsive Design:** Ensure the application works well on all devices (mobile, tablet, desktop).
- **Real-time Updates:** Show changes to financial data in real-time without page refreshes.
- **Data Visualization:** Present financial data in clear, informative charts and graphs.
- **Customization:** Allow users to customize their experience (themes, language preferences).
- **Accessibility:** Ensure the application is usable by people with disabilities.
- **Offline Support:** (Future) Provide basic functionality when users are offline.

## User Experience Goals

### Backend Influencing UX
- **Responsiveness:** The API should respond quickly to client requests.
- **Reliability:** Data should be stored accurately and consistently.
- **Security:** Users must trust that their financial data is safe.
- **Ease of Use (for Frontend Devs):** The API should be well-documented (Swagger) and follow predictable REST conventions.

### Frontend UX
- **Intuitive Navigation:** Users should instinctively understand how to use the application.
- **Visual Clarity:** Information should be presented clearly with appropriate visual hierarchy.
- **Consistent Design:** UI elements should be consistent throughout the application.
- **Feedback:** Users should receive clear feedback on their actions.
- **Performance:** The interface should be fast and responsive.
- **Error Handling:** Errors should be presented in a user-friendly way.
- **Personalization:** Users should feel the application adapts to their needs.

## Core Entities

### Database Entities (from `prisma/schema.prisma`)
- `User`: Stores login credentials (email, hashed password).
- `Profile`: User-specific settings and potentially default currency/preferences (linked one-to-one with User).
- `Account`: Represents financial accounts (e.g., cash, bank account, credit card) with balances.
- `Transaction`: Records financial events (income, expense, transfer, debt operations) linked to accounts and categories.
- `Category`: User-defined categories for transactions.
- `Goal`: Financial goals set by the user.
- `Subscription`: (Mock entity for now, representing potential future premium features).
- `AIRequestLog`: (Mock entity for now, representing potential future AI-powered features).

### Frontend Components
- **Header/Navigation:** App navigation and user profile access.
- **Dashboard:** Overview of financial status and recent activity.
- **Transaction Management:** List, create, edit, and delete transactions.
- **Account Management:** Create, edit, and monitor account balances.
- **Category Management:** Organize transactions by custom categories.
- **Goal Tracking:** Set and monitor progress towards financial goals.
- **Settings:** Manage user preferences, theme, and language.
- **Reports/Charts:** Visualize financial data in meaningful ways. 