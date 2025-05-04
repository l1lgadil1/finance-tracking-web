# AqshaTracker Dashboard UI/UX Guide

This guide outlines the UI/UX standards for the AqshaTracker dashboard to ensure consistency, accessibility, and a high-quality user experience.

## Core Principles

1. **Consistency** - Use consistent styling, spacing, and component behaviors
2. **Accessibility** - Ensure all components are accessible (WCAG AA level)
3. **Responsiveness** - All components should work well on mobile, tablet, and desktop
4. **Performance** - Optimize for fast loading and minimal layout shifts
5. **Localization** - Support for multiple languages (currently English and Russian)
6. **Theme Support** - Components should work in both light and dark modes

## Color System

All colors should use the theme variables defined in `tailwind.config.ts`:

- Background: `bg-background` instead of hardcoded colors
- Text: `text-foreground`, `text-muted-foreground`
- Cards: `bg-card`, `text-card-foreground`
- Borders: `border-border`
- Accents: `bg-accent`, `text-accent-foreground`
- Primary elements: `bg-primary-*`, `text-primary-*`

Avoid using hardcoded color values like `bg-gray-50` or `text-gray-800`.

## Component Guidelines

### Cards

- Use the `Card` component for all dashboard widgets
- Include proper headings (`<h2>`, `<h3>`) for each section
- Provide proper loading, error, and empty states
- Use motion effects consistently

```tsx
<Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
  <CardHeader>
    <h2 className="text-xl font-semibold">{title}</h2>
  </CardHeader>
  <CardBody>
    {content}
  </CardBody>
</Card>
```

### Data Visualization

- Use consistent colors for charts and graphs
- Provide alternative text representation for screen readers
- Ensure hover states have proper focus management
- Include legends where appropriate

### Loading States

- Use standardized loading indicators across all components
- Provide proper ARIA attributes for loading states

```tsx
<div aria-live="polite" aria-busy="true">
  <div className="w-12 h-12 border-t-4 border-primary-500 rounded-full animate-spin" role="progressbar"></div>
  <span className="sr-only">{loadingText}</span>
</div>
```

### Error States

- Use consistent error messaging and styling
- Provide actionable error messages when possible
- Include appropriate ARIA attributes

```tsx
<div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md" role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

### Empty States

- Provide helpful empty states with actions when appropriate
- Use consistent styling across empty states

```tsx
<div className="p-6 bg-background text-center rounded-md">
  {emptyStateMessage}
</div>
```

## Accessibility Requirements

- All interactive elements must be keyboard accessible
- Use appropriate ARIA roles and attributes
- Maintain proper heading hierarchy
- Ensure sufficient color contrast
- Provide alternative text for all images
- Use semantic HTML elements

```tsx
<section aria-labelledby="section-title">
  <h2 id="section-title">Section Title</h2>
  <div role="list">
    {items.map(item => (
      <div role="listitem" key={item.id}>
        {item.content}
      </div>
    ))}
  </div>
</section>
```

## Animation Standards

- Use `framer-motion` for consistent animations
- Keep animations subtle and purposeful
- Respect user preferences with `prefers-reduced-motion`
- Use consistent timing and easing functions

```tsx
<motion.div
  whileHover={{ scale: 1.01 }}
  transition={{ type: "spring", stiffness: 400, damping: 10 }}
>
  {content}
</motion.div>
```

## Responsive Design

- Design mobile-first
- Use appropriate breakpoints for responsive layouts
- Test on various viewport sizes
- Ensure touch targets are sufficiently large on mobile

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {content}
</div>
```

## Internationalization

- Use translation objects for all user-facing text
- Support both left-to-right and right-to-left layouts
- Format dates, numbers, and currencies according to locale

```tsx
const translations = {
  en: { title: 'Dashboard', empty: 'No data available' },
  ru: { title: 'Панель управления', empty: 'Данные отсутствуют' }
};

const t = translations[locale] || translations.en;
```

## Implementation Checklist

When creating new dashboard components:

- [ ] Use semantic HTML elements
- [ ] Add appropriate ARIA attributes
- [ ] Implement all states (loading, error, empty)
- [ ] Test with keyboard navigation
- [ ] Ensure consistent styling with other components
- [ ] Add translations for all user-facing text
- [ ] Test in both light and dark modes
- [ ] Test responsive behavior
- [ ] Optimize for performance 