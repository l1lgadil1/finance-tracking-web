# AqshaTracker Theme System

This document outlines the theme system for AqshaTracker application, including all color variables, their usage patterns, and guidance for maintaining visual consistency across light and dark themes.

## Theme Variables

The theme system uses CSS variables to define colors and other design tokens that change between light and dark modes. These variables are defined in `src/app/styles/globals.css` and are used throughout the application.

### Base Theme Variables

These variables define the foundation of the UI in both light and dark themes:

| Variable | Light Theme | Dark Theme | Usage |
|----------|-------------|------------|-------|
| `--background` | #ffffff | #0f172a | Main background color |
| `--foreground` | #0f172a | #f8fafc | Main text color |
| `--card` | #ffffff | #1e293b | Card component background |
| `--card-foreground` | #0f172a | #f8fafc | Text color inside cards |
| `--card-hover` | #f8fafc | #334155 | Card hover state background |
| `--border` | #e2e8f0 | #334155 | Border color for UI elements |
| `--input` | #ffffff | #1e293b | Input field background |
| `--input-foreground` | #0f172a | #f8fafc | Input field text color |
| `--muted` | #f1f5f9 | #1e293b | Background for muted elements |
| `--muted-foreground` | #64748b | #94a3b8 | Text color for muted elements |
| `--accent` | #e6f1ff | #001766 | Accent element background |
| `--accent-foreground` | #0073ff | #66abff | Text on accent backgrounds |
| `--ring` | #e2e8f0 | #334155 | Focus ring color |
| `--shadow` | rgba(15, 23, 42, 0.08) | rgba(0, 0, 0, 0.25) | Shadow color |
| `--focus-ring` | rgba(0, 115, 255, 0.3) | rgba(102, 171, 255, 0.3) | Focus ring color |

### Semantic Colors

These colors represent different semantic states in the application:

| Variable | Value | Usage |
|----------|-------|-------|
| `--success` | #10b981 | Success states, confirmations |
| `--success-foreground` | #ffffff | Text on success backgrounds |
| `--warning` | #f59e0b | Warning states, important alerts |
| `--warning-foreground` | #ffffff | Text on warning backgrounds |
| `--error` | #ef4444 | Error states, critical failures |
| `--error-foreground` | #ffffff | Text on error backgrounds |
| `--info` | #3b82f6 | Informational states, neutral alerts |
| `--info-foreground` | #ffffff | Text on info backgrounds |

### Brand Colors

The primary brand color palette for AqshaTracker:

| Variable | Value | Usage |
|----------|-------|-------|
| `--primary-50` | #e6f1ff | Lightest shade, subtle backgrounds |
| `--primary-100` | #cce3ff | Very light, hover states |
| `--primary-200` | #99c7ff | Light shade, selected items |
| `--primary-300` | #66abff | Medium-light, active backgrounds |
| `--primary-400` | #338fff | Medium shade, focus states |
| `--primary-500` | #0073ff | Base primary color, buttons, links |
| `--primary-600` | #005cd9 | Medium-dark, hover states for primary |
| `--primary-700` | #0044b3 | Dark shade, active states |
| `--primary-800` | #002d8c | Very dark, special UI elements |
| `--primary-900` | #001766 | Darkest shade, special contrast cases |

## Usage Guidelines

### Component Theming

When building or updating components, follow these guidelines:

1. **Use semantic tokens over color values**:
   - Use `text-foreground` instead of specific color values
   - Use `bg-card` instead of `bg-white`/`bg-gray-800`

2. **Always test in both themes**:
   - Ensure readability and contrast in both light and dark modes
   - Check that interactive states (hover, focus, active) work well in both themes

3. **For text**:
   - Primary text: `text-foreground`
   - Secondary/muted text: `text-muted-foreground`
   - Links and buttons: `text-primary-500` (or appropriate variant)

4. **For backgrounds**:
   - Page backgrounds: `bg-background`
   - Card backgrounds: `bg-card`
   - Secondary elements: `bg-muted`
   - Accent/highlighted areas: `bg-accent`

### Accessibility Guidelines

To ensure good accessibility:

1. **Contrast**: Maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text
2. **Focus states**: Always provide visible focus indicators using `focus:ring-focus-ring`
3. **Hover effects**: Ensure hover states are visible but not too dramatic
4. **Text size**: Use relative sizing (rem) and maintain a minimum text size of 16px (1rem)

## Theme Switching

The application uses `next-themes` for theme switching. The theme can be toggled using the `ThemeToggle` component, and the theme state can be accessed using the `useTheme` hook:

```tsx
import { useTheme } from 'next-themes';

const MyComponent = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle theme
    </button>
  );
};
```

## Helper Classes

The theme system includes several helper classes for common styling needs:

- `.theme-root`: Apply to containers that need theme variables
- `.card`: Basic card styling
- `.btn`, `.btn-primary`, `.btn-secondary`: Button styling
- `.form-input`: Styling for form inputs
- `.high-contrast`, `.high-contrast-inverse`: Helper classes for accessible text 