# Product Context: AqshaTracker

## Why This Project Exists
- To help users track, analyze, and manage their personal finances efficiently.
- To provide actionable insights and visualizations for better financial decisions.
- To offer a secure, user-centric platform for managing accounts, transactions, categories, goals, and subscriptions.

## Problems It Solves
- Centralizes all personal finance data in one place.
- Enables users to categorize and filter transactions, set goals, and monitor progress.
- Provides real-time analytics and (planned) AI-driven insights.
- Ensures data privacy and ownership (all data scoped to user).

## How It Should Work
- Users register/login securely; all data is private and user-specific.
- Users can CRUD accounts, transactions, categories, and goals.
- Transactions update account balances and support filtering by type, date, etc.
- Dashboard provides charts, summaries, and (planned) AI insights.
- Subscription and AI modules are being transitioned from mock to real implementations.
- All features are accessible via a responsive, internationalized UI.

## User Experience Goals
- Fast, intuitive, and mobile-friendly interface.
- Consistent theming (light/dark), clear data visualization.
- Seamless navigation and feedback (loading, error states).
- Multi-language support (English, Russian at minimum).
- Accessibility and performance as first-class concerns.

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