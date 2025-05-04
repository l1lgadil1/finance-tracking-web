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
- Framer Motion for animations

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
  │   ├── docs/         # Documentation
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

### Theme System
- CSS Variables for dynamic theming
- Semantic color tokens for light/dark modes
- Component-specific variables
- Tailwind integration with CSS variables
- Accessibility-focused with proper contrast ratios (WCAG AA compliant)
- Focus states for keyboard navigation
- UI showcase and documentation with contrast examples
- Support for high-contrast modes

### Data Management
- No mock data in production
- Proper API integration
- Type-safe data handling
- Proper error boundaries
- Loading states

### UI Components
- Button: Primary, Secondary, Outline, Ghost, Link, Destructive variants
- Card: Default, Secondary, Outline, Ghost variants with optional hover effects
- Input: Standard, with helper text, with error, with icon
- Modal: Flexible modal system with customizable header, body, footer
- Toast: Notification system with Success, Error, Warning, Info variants
- Toast Provider: Context-based toast management with centralized control
- Theme Toggle: Light/dark mode switcher
- Form components with validation

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
- **Styling:** Tailwind CSS, semantic theme system with CSS variables
- **State Management:** Zustand (global), React Query (server)
- **Theming:** Light/dark mode with CSS variables, semantic color tokens, accessibility-focused
- **i18n:** Custom implementation, component-level dictionaries, English/Russian
- **Notifications:** Toast system with context-based state management
- **Visualization:** Recharts
- **Icons:** React Icons
- **Animation:** Framer Motion
- **Testing:** Jest, React Testing Library, Cypress
- **PWA:** Planned

## Technical Constraints
- All backend endpoints must be validated and documented
- All frontend components must support i18n, theming, and responsiveness
- Strict type safety throughout (TypeScript)
- All UI components must use the semantic theme system
- All components must be accessible (WCAG compliant)
- No mock data in production
- Data scoping: All user data must be isolated by userId
- Error/loading states required for all async operations
- Reuse shared UI components where possible
- Accessibility and performance optimizations required 
- All components must have proper TypeScript typing (no 'any' types) 