# System Patterns: AqshaTracker

## Architecture
- Backend: Modular NestJS REST API, Prisma ORM, PostgreSQL, JWT auth, Zod validation, Swagger docs.
- Frontend: Feature Sliced Design (FSD), React, Zustand, Tailwind, i18n, dark/light theme, responsive design.

## Key Patterns
- Strict separation of UI and business logic (hooks/services for logic, presentational components for UI).
- All backend CRUD operations scoped to authenticated user (data ownership enforced).
- DTO validation via nestjs-zod; all endpoints validated and documented.
- Error and loading states handled at component and API layer.
- State management: Zustand (global), React Query (server), local state for UI.
- API integration: Typed API clients, error boundaries, loading skeletons.
- Theming and i18n: Component-level translation dictionaries, theme variables.
- Testing: Jest/RTL for unit/component, Cypress for E2E.

## Component Relationships
- Shared UI components reused across features.
- Feature modules encapsulate business logic and state.
- Entities layer provides data models and API integration.
- Widgets/pages compose features and entities for user flows.

## Technical Decisions
- Use of React Icons for UI consistency.
- Recharts for data visualization.
- All forms validated client-side and server-side.
- Responsive/mobile-first layouts.
- Ongoing: Remove all mock data, replace with real API integration.
