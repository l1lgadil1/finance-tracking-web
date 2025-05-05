# System Patterns: AqshaTracker

## Architecture Overview

The AqshaTracker application follows a modern client-server architecture:

1. **Backend**: NestJS REST API with a modular architecture
2. **Frontend**: Next.js React application with Feature Sliced Design (FSD) architecture
3. **Database**: PostgreSQL with Prisma ORM

## Backend Architecture

### NestJS Modules

- **Core Modules**:
  - `AppModule`: Root module
  - `AuthModule`: Authentication and authorization
  - `UsersModule`: User management
  - `PrismaModule`: Database connectivity
  - `ConfigModule`: Environment configuration

- **Feature Modules**:
  - `AccountsModule`: Banking and financial accounts
  - `TransactionsModule`: Financial transactions
  - `CategoriesModule`: Transaction categorization
  - `GoalsModule`: Financial goals
  - `SubscriptionsModule`: Subscription management (mock)
  - `AiModule`: AI integration for financial insights

### API Structure

- RESTful endpoints with consistent naming
- Resource-based routing with versioning
- JWT authentication with guards
- DTOs for request/response validation
- Swagger documentation

## Frontend Architecture

### Feature Sliced Design (FSD)

The frontend follows the FSD methodology with the following layers:

1. **App**: Global application setup
   - `/app`: Layout, providers, styles, entry points
   - `providers.tsx`: Global providers for themes, state, etc.

2. **Pages**: Route components
   - `/pages`: Page components corresponding to routes

3. **Widgets**: Complex UI blocks composed of entities/features
   - `/widgets`: Self-contained sections of pages (e.g., TransactionHistory, AccountsList)

4. **Features**: User interactions that change application state
   - `/features`: Functional elements (e.g., AddTransaction, EditAccount)

5. **Entities**: Business objects with logic
   - `/entities`: Models and related components (e.g., Transaction, Account)

6. **Shared**: Reusable primitives
   - `/shared/ui`: UI components (buttons, inputs, cards, etc.)
   - `/shared/lib`: Utility functions and hooks
   - `/shared/api`: API client methods
   - `/shared/config`: Configuration constants

### UI Component System

The UI component system follows a modular, composable approach:

1. **Base Components**: 
   - Located in `/shared/ui` directory
   - Each component in its own folder or file
   - Focused on presentation, not business logic
   - Consistently styled with Tailwind CSS using theme variables
   - Support for light/dark themes via CSS variables

2. **Component Design Principles**:
   - Separation of concerns (presentation vs. logic)
   - Props-based configuration
   - Consistent styling and accessibility
   - Comprehensive TypeScript types
   - Support for various states (loading, error, disabled)
   - Motion and animation via Framer Motion
   
3. **Financial UI Components**:
   - Specialized components for financial workflows:
     - `CurrencyInput`: Handles monetary values with proper formatting and currency symbols
     - `DatePicker`: Date selection for transactions with locale support 
     - `ProgressBar`: Goal and budget progress visualization with customizable styles
     - `Dialog`: Confirmation dialogs for financial actions
     - `TransactionCard`: Displays transaction information with appropriate visual cues
     - `TransactionDetail`: Displays detailed transaction information in a structured format
     - `FinancialSummaryCard`: Financial metrics with trend visualization

4. **Theming System**:
   - Global CSS variables for colors, spacing, etc.
   - Semantic token names (e.g., primary, secondary, accent)
   - Consistent use of Tailwind CSS classes
   - Dark/light mode support with theme context

## Data Flow

1. **Backend**:
   - Controllers receive requests
   - DTOs validate request data
   - Services handle business logic
   - Prisma repositories manage database operations
   - Guards ensure authentication and authorization

2. **Frontend**:
   - Pages define routes and layouts
   - Widgets compose UI from features and entities
   - Features implement user interactions
   - API client methods handle data fetching
   - Zustand stores manage state
   - UI components render the interface

3. **Real-time Updates**:
   - Transaction creation/update/deletion flow:
     1. UI form collects transaction data
     2. Form submission triggers API call
     3. Backend processes transaction
     4. After successful operation, UI:
        - Refreshes transaction list
        - Updates financial statistics
        - Closes relevant modals
        - Resets UI state
     5. User sees immediate updates without page reload

## Authentication Flow

1. User submits credentials
2. Backend validates and returns JWT token
3. Frontend stores token in local storage
4. Token is included in subsequent API requests
5. Protected routes check authentication status
6. Token refresh mechanism maintains session

## Key Design Patterns

1. **Repository Pattern** (Backend): Prisma service abstracts database operations
2. **Module Pattern** (Backend): NestJS modules encapsulate related functionality
3. **Provider Pattern** (Frontend): React context provides global state/services
4. **Render Props/Hooks Pattern** (Frontend): Shared logic via custom hooks
5. **Feature Slice Pattern** (Frontend): Code organization by business domains
6. **Component Composition** (Frontend): UI built from smaller, reusable components
7. **Callback Pattern** (Frontend): onSuccess callbacks for post-operation UI updates
8. **Observable Store Pattern** (Frontend): Zustand for centralized state management with real-time UI updates

## Technical Decisions
- Comprehensive theme system with semantic color tokens and CSS variables.
- Type-safe components with proper TypeScript typing.
- Toast notification system using React Context for global state.
- Modal pattern for entity creation/editing to maintain context and focus.
- Use of React Icons for UI consistency.
- Recharts for data visualization.
- All forms validated client-side and server-side.
- Responsive/mobile-first layouts.
- Real-time UI updates through post-operation refresh mechanisms.
- Ongoing: Remove all mock data, replace with real API integration.

## UI Patterns

### General UI Patterns
- Semantic color tokens for consistent UI theming across components.
- Accessibility-focused design with proper color contrast and focus states.
- Card-based layouts for entity display.
- Modal forms for entity creation and editing.
- Toast notifications for transient feedback.
- Loading/error states for async operations.
- Clickable elements with visual feedback (hover effects).
- Consistent action buttons with appropriate visual hierarchy.
- Dark/light theme support across all components with CSS variables.
- UI showcase for component reference and theme demonstration.
- Financial data visualization with appropriate color coding by transaction type.
- Transaction type indicators with consistent iconography.

### Transaction UI Patterns
- Minimalist card UI with reduced visual noise for better readability.
- Smart action buttons that:
  - On desktop: Appear on hover in a semi-transparent container
  - On mobile: Show a single menu button to conserve space
- Context-aware button positioning centered vertically for balance
- Responsive spacing between transaction cards based on screen size
- Visual grouping of transactions (by date, category, etc.)
- Transaction status indicators with consistent color coding
- Progressive disclosure of transaction details

## Theme System
- CSS variables for dynamic theme switching.
- Semantic color tokens (background, foreground, card, etc.) for consistent usage.
- Component-specific variables (card-foreground, muted-foreground, etc.).
- Tailwind integration with CSS variables for utility class usage.
- Proper color contrast for accessibility (WCAG guidelines).
- Focus states and interactive element styling for keyboard navigation.
- Helper classes for common styling patterns.
- Theme documentation for developers.
- Comprehensive UI showcase with examples and contrast demonstrations.
- Financial-specific color tokens for transaction types (income, expense, transfer, debt).

## Data Visualization Patterns

The application uses a consistent approach to data visualization, especially for financial information:

1. **Chart Components**:
   - All charts are built using Recharts library
   - Consistent styling and theming across different chart types
   - Charts adapt to light/dark theme automatically
   - Proper tooltips and legends for data interpretation
   - Responsive containers to adapt to different screen sizes
   - Accessible implementation with ARIA attributes and keyboard navigation

2. **Chart Types and Use Cases**:
   - **Bar Charts**: For comparing income vs expenses over time periods
   - **Pie Charts**: For category distribution and percentage breakdowns
   - **Line Charts**: For trend analysis and performance over time
   - **Area Charts**: For cumulative growth visualization (planned)
   - **Donut Charts**: For account balance distribution

3. **Chart Interaction Patterns**:
   - Tooltips for detailed data on hover
   - Interactive legends for filtering data
   - Time period selection with consistent UI patterns
   - Custom date range selectors for detailed analysis
   - Filters for data refinement with consistent UI elements
   - Smooth animations for transitions between data sets

4. **Financial Data Representations**:
   - Consistent color coding (income: blue, expense: red)
   - Clear labeling and formatting of monetary values
   - Contextual percentage changes with positive/negative indicators
   - Proper handling of zero values and empty states
   - Clear visual hierarchies for primary vs secondary data
   - Proper number formatting following locale conventions

5. **Accessibility Considerations**:
   - Color choices that work with color blindness
   - Text alternatives for chart data
   - Keyboard navigable interactive elements
   - Proper focus management for interactive charts
   - Screen reader support with aria-labels
   - High contrast options for better readability

6. **Dashboard Integration**:
   - Charts as self-contained, reusable components
   - Consistent layout and spacing in dashboard contexts
   - Proper loading and error states
   - Effective use of card containers for visual grouping
   - Contextual relationship between charts and summary data
   
This visualization system ensures that financial data is presented consistently, clearly, and accessibly throughout the application, providing users with intuitive and informative insights into their financial situation.
