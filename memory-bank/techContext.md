# Tech Context: AqshaTracker

## Frontend Architecture

### Core Technologies
- Next.js 15.3.1 with App Router
- React 19.0.0
- TypeScript
- Tailwind CSS
- Zustand for state management
- React Query for server state
- React Hook Form for forms
- Zod for validation

### Code Organization
- Feature Sliced Design (FSD) architecture
- Strict separation of concerns:
  ```
  src/
  ├── app/                 # Next.js app router pages
  ├── entities/           # Business entities
  ├── features/          # User features
  ├── shared/            # Shared code
  │   ├── api/          # API client
  │   ├── config/       # Configuration
  │   ├── lib/          # Libraries
  │   └── ui/           # UI components
  └── widgets/          # Complex UI blocks
  ```

### Component Structure
- UI and Logic Separation:
  ```
  feature/
  ├── ui/               # Pure UI components
  │   ├── Component.tsx
  │   └── Component.types.ts
  └── model/           # Business logic
      ├── useFeature.ts
      ├── feature.types.ts
      └── feature.utils.ts
  ```

### Data Management
- No mock data in production
- Proper API integration
- Type-safe data handling
- Proper error boundaries
- Loading states

## Backend Architecture

### Core Technologies
- NestJS
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Swagger/OpenAPI

### API Structure
- RESTful endpoints
- Proper validation
- Error handling
- Authentication/Authorization
- Rate limiting

## Development Standards

### Code Quality
- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Unit testing with Jest
- E2E testing with Cypress

### Git Workflow
- Feature branches
- Pull request reviews
- Conventional commits
- CI/CD pipeline

### Documentation
- Code comments
- API documentation
- Component documentation
- Architecture documentation

## Performance Optimization

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Performance monitoring

### Backend
- Query optimization
- Caching strategy
- Rate limiting
- Resource optimization

## Security

### Authentication
- JWT tokens
- Refresh token rotation
- Session management
- CSRF protection

### Data Protection
- Input validation
- Output sanitization
- CORS configuration
- Security headers

## Testing Strategy

### Unit Tests
- Business logic
- Utility functions
- Hooks
- Components

### Integration Tests
- API endpoints
- Database operations
- Authentication flow

### E2E Tests
- Critical user paths
- Form submissions
- Navigation
- Error scenarios

## Monitoring & Logging

### Error Tracking
- Error boundaries
- Error logging
- Performance monitoring
- User analytics

### Logging
- Application logs
- Access logs
- Error logs
- Audit logs

## Deployment

### Environment Setup
- Development
- Staging
- Production
- CI/CD pipeline

### Infrastructure
- Cloud hosting
- Database hosting
- CDN configuration
- SSL/TLS setup 

## Frontend
- **Framework:** Next.js (React, App Router)
- **Architecture:** Feature Sliced Design (FSD)
- **Styling:** Tailwind CSS, custom theme variables
- **State Management:** Zustand (global), React Query (server)
- **i18n:** Custom implementation, component-level dictionaries, English/Russian
- **Theming:** Light/dark mode, theme variables
- **Visualization:** Recharts
- **Icons:** React Icons
- **Testing:** Jest, React Testing Library, Cypress
- **PWA:** Planned

## Technical Constraints
- All backend endpoints must be validated and documented
- All frontend components must support i18n, theming, and responsiveness
- Strict type safety throughout (TypeScript)
- No mock data in production
- Data scoping: All user data must be isolated by userId
- Error/loading states required for all async operations
- Reuse shared UI components where possible
- Accessibility and performance optimizations required 