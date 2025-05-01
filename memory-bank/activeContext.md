# Active Context

## Current Focus

- Strict separation of UI and business logic (moving logic to hooks/services)
- Removing all mock data; integrating real backend API throughout
- Ensuring type safety with TypeScript
- Implementing robust loading and error states
- Organizing code by Feature Sliced Design (FSD)

## Recent Changes

- Migrated sidebar icons to React Icons
- Improved component and type organization
- Replaced mock analytics with real transaction data
- Added loading/error states to charts
- Implemented dark/light mode in charts
- Integrated real transaction data in analytics (15-day aggregation)
- Fixed backend enum/type errors in transaction service; now using Prisma enum for all transaction type logic. debt_give/debt_take mapped to 'debt' due to schema constraints.

## Next Steps

1. Implement real AI insights in analytics
2. Add interactive features to transaction chart (date range filtering)
3. Replace mock subscription module with real implementation
4. Add error boundaries for improved resilience
5. Begin unit and E2E test coverage for business logic and flows

## Technical Decisions

- Feature Sliced Design (FSD) for frontend
- TypeScript for type safety
- Zustand for global state, React Query for server state
- Jest/RTL for unit/component tests, Cypress for E2E
- Recharts for data visualization

## Known Issues

- Mock data remains in subscription module
- Incomplete error handling and loading states in some components
- Incomplete test coverage
- AI insights placeholder needs real implementation
- Ongoing: UI/logic separation, type safety, error handling
- debt_give/debt_take are not distinguished in backend logic due to current Prisma schema; both are mapped to 'debt'. 