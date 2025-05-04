import React from 'react';

/**
 * Accessibility Best Practices Guide
 * 
 * This file serves as a reference for implementing accessibility best practices
 * across the AqshaTracker application. It contains guidelines and examples for
 * making our financial components more accessible.
 */

const AccessibilityBest = () => {
  return (
    <div>
      <h1>AqshaTracker Accessibility Guidelines</h1>
      
      <section>
        <h2>1. Semantic HTML</h2>
        <ul>
          <li>
            Use semantic HTML elements like <code>button</code>, <code>nav</code>, 
            <code>header</code>, <code>footer</code>, <code>main</code>, etc. instead of <code>div</code> 
            for UI elements with specific roles.
          </li>
          <li>
            Use <code>label</code> with <code>htmlFor</code> attribute for form controls.
          </li>
          <li>
            Use headings (<code>h1</code>-<code>h6</code>) in a hierarchical order.
          </li>
        </ul>
      </section>

      <section>
        <h2>2. ARIA Attributes</h2>
        <ul>
          <li>
            Use <code>aria-label</code> for elements without visible text (e.g., icon buttons).
          </li>
          <li>
            Use <code>aria-expanded</code> for expandable UI elements.
          </li>
          <li>
            Use <code>aria-controls</code> to associate controls with the elements they control.
          </li>
          <li>
            Use <code>aria-hidden=&quot;true&quot;</code> for decorative elements.
          </li>
          <li>
            Use <code>aria-live</code> regions for dynamic content.
          </li>
          <li>
            Use <code>aria-selected</code> for selected items in a list.
          </li>
          <li>
            Use <code>aria-current</code> for current items in navigation.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Keyboard Navigation</h2>
        <ul>
          <li>
            Ensure all interactive elements are keyboard accessible with <code>Tab</code> key navigation.
          </li>
          <li>
            Add proper focus styles for better visual indication.
          </li>
          <li>
            Implement keyboard shortcuts for common actions.
          </li>
          <li>
            Ensure focus management in modals and dropdowns.
          </li>
          <li>
            Use <code>tabIndex=&quot;0&quot;</code> for custom interactive elements.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Color and Contrast</h2>
        <ul>
          <li>
            Maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text.
          </li>
          <li>
            Don&apos;t rely solely on color to convey information.
          </li>
          <li>
            Provide additional indicators like icons or patterns.
          </li>
          <li>
            Test with color blindness simulators.
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Text and Typography</h2>
        <ul>
          <li>
            Use relative units (rem, em) for font sizes.
          </li>
          <li>
            Ensure minimum text size of 16px for body text.
          </li>
          <li>
            Maintain proper line spacing for readability.
          </li>
          <li>
            Avoid justified text alignment.
          </li>
        </ul>
      </section>

      <section>
        <h2>6. Financial Data Accessibility</h2>
        <ul>
          <li>
            Provide proper labels for financial charts and graphs.
          </li>
          <li>
            Ensure numerical data has appropriate context.
          </li>
          <li>
            Add descriptions for complex financial visualizations.
          </li>
          <li>
            Implement table captions and summaries for financial tables.
          </li>
          <li>
            Provide alternative text for financial charts.
          </li>
        </ul>
      </section>

      <section>
        <h2>7. Form Accessibility</h2>
        <ul>
          <li>
            Group related form fields with <code>fieldset</code> and <code>legend</code>.
          </li>
          <li>
            Provide clear error messages and validation feedback.
          </li>
          <li>
            Mark required fields with both visual indicators and <code>aria-required</code>.
          </li>
          <li>
            Ensure form controls have descriptive labels.
          </li>
          <li>
            Implement accessible date and currency inputs.
          </li>
        </ul>
      </section>

      <section>
        <h2>8. Testing</h2>
        <ul>
          <li>
            Test with screen readers (NVDA, VoiceOver, JAWS).
          </li>
          <li>
            Validate with automated tools (axe, Lighthouse).
          </li>
          <li>
            Perform keyboard-only testing.
          </li>
          <li>
            Conduct usability testing with people with disabilities.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default AccessibilityBest; 