# AqshaTracker Frontend

This is the frontend application for AqshaTracker, a personal finance tracking tool. The project is built using Next.js and follows the Feature Sliced Design (FSD) architecture.

## Feature Sliced Design

This project follows the Feature Sliced Design architecture, which organizes code into layers and slices:

### Layers

1. **app** - Application initialization, global providers, styles, and configuration
2. **pages** - Pages/screens that correspond to routes in the application
3. **widgets** - Complex, composite blocks, used within pages
4. **features** - User interactions that implement business logic
5. **entities** - Business entities and their operations
6. **shared** - Reusable infrastructure code (UI, API, utils, etc.)

### Segments in Each Layer

Each layer can have these segments:
- **ui** - UI components
- **model** - Business logic (store, state)
- **api** - API interactions
- **lib** - Utils/helpers
- **config** - Constants, configuration

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Folder Structure

```
src/
├── app/               # Application setup
│   ├── [locale]/      # Localized routes
│   ├── providers.tsx  # Global providers
│   ├── styles/        # Global styles
│   └── layout.tsx     # Root layout
│
├── pages/             # Application pages
│   ├── home/
│   │   ├── ui/        # Page UI components
│   │   └── index.ts   # Public API
│   ├── dashboard/
│   ├── transactions/
│   └── ...
│
├── widgets/           # Complex composite blocks
│   ├── Header/
│   ├── TransactionChart/
│   └── ...
│
├── features/          # User interactions
│   ├── auth/
│   ├── transactionFiltering/
│   └── ...
│
├── entities/          # Business entities
│   ├── user/
│   │   ├── api/
│   │   ├── model/
│   │   ├── ui/
│   │   └── index.ts
│   ├── transaction/
│   ├── account/
│   └── ...
│
├── shared/            # Shared code
│   ├── api/           # API utilities
│   ├── config/        # Global configuration
│   ├── lib/           # Utilities and helpers
│   ├── model/         # Global state
│   └── ui/            # UI components
│
└── middleware.ts      # Next.js middleware
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
