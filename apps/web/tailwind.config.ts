import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          page: 'var(--color-surface-page)',
          sidebar: 'var(--color-surface-sidebar)',
          base: 'var(--color-surface-base)',
          muted: 'var(--color-surface-muted)',
          white50: 'var(--color-surface-white-50)',
          panel: 'var(--color-surface-panel)',
          elevated: 'var(--color-surface-elevated)',
          inverse: 'var(--color-surface-inverse)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          inverse: 'var(--color-text-inverse)',
          accent: 'var(--color-text-accent)',
          danger: 'var(--color-text-danger)',
        },
        border: {
          subtle: 'var(--color-border-subtle)',
          default: 'var(--color-border-default)',
          strong: 'var(--color-border-strong)',
        },
        brand: {
          primary: 'var(--color-brand-primary)',
          secondary: 'var(--color-brand-secondary)',
          glow: 'var(--color-brand-glow)',
        },
        status: {
          success: 'var(--color-status-success)',
          warning: 'var(--color-status-warning)',
          danger: 'var(--color-status-danger)',
          notification: 'var(--color-status-notification)',
          info: 'var(--color-status-info)',
        },
      },
      borderRadius: {
        xs: 'var(--radius-badge)',
        sm: 'var(--radius-card)',
        md: 'var(--radius-card)',
        lg: 'var(--radius-container)',
        xl: 'var(--radius-container)',
        pill: 'var(--radius-pill)',
        input: 'var(--radius-input)',
      },
      spacing: {
        '2xs': 'var(--space-2xs)',
        '3xs': 'var(--space-3xs)',
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        'layout-header-offset': 'var(--space-layout-header-offset)',
        'layout-sidebar-nav-to-settings': 'var(--space-layout-sidebar-nav-to-settings)',
        'layout-settings-to-card': 'var(--space-layout-settings-to-card)',
        'layout-sidebar-card-bottom': 'var(--space-layout-sidebar-card-bottom)',
        'card-padding': 'var(--space-card-padding)',
        'card-content-gap': 'var(--space-card-content-gap)',
        'container-padding': 'var(--space-container-padding)',
        'container-content-gap': 'var(--space-container-content-gap)',
        'button-x': 'var(--space-button-x)',
        'button-y': 'var(--space-button-y)',
        'button-content-gap': 'var(--space-button-content-gap)',
        'input-x': 'var(--space-input-x)',
        'input-y': 'var(--space-input-y)',
        'badge-x': 'var(--space-badge-x)',
        'badge-content-gap': 'var(--space-badge-content-gap)',
      },
      borderWidth: {
        input: 'var(--border-width-input)',
        'brand-strong': 'var(--border-width-brand-strong)',
        'brand-dark': 'var(--size-border-brand-dark)',
      },
      boxShadow: {
        card: 'none',
        panel: '0 20px 45px -30px rgba(0, 0, 0, 0.45)',
        floating: '0 22px 48px -26px rgba(0, 0, 0, 0.5)',
        'floating-fab': 'var(--shadow-floating-fab)',
        'badge-orange-inset': 'var(--shadow-badge-orange-inset)',
      },
      backgroundImage: {
        'surface-page': 'var(--gradient-surface-page)',
        'brand-primary-border': 'var(--gradient-brand-primary-border)',
        'brand-dark-border': 'var(--gradient-brand-dark-border)',
      },
      fontFamily: {
        sans: ['var(--font-family-base)', 'var(--font-geist-sans)', 'ui-sans-serif', 'system-ui'],
        heading: ['var(--font-family-heading)', 'var(--font-geist-sans)', 'ui-sans-serif', 'system-ui'],
        button: ['var(--font-family-button)', 'var(--font-geist-sans)', 'ui-sans-serif', 'system-ui'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular'],
      },
      fontSize: {
        'body-sm': ['var(--font-size-body-sm)', { lineHeight: 'var(--line-height-body-sm)', letterSpacing: 'var(--letter-spacing-default)' }],
        'body-md': ['var(--font-size-body-md)', { lineHeight: 'var(--line-height-body-md)', letterSpacing: 'var(--letter-spacing-default)' }],
        'heading-lg': ['var(--font-size-heading-lg)', { lineHeight: 'var(--line-height-heading-lg)', letterSpacing: 'var(--letter-spacing-default)' }],
        button: ['var(--font-size-button)', { lineHeight: 'var(--line-height-button)', letterSpacing: 'var(--letter-spacing-button)' }],
      },
      fontWeight: {
        regular: 'var(--font-weight-regular)',
        medium: 'var(--font-weight-medium)',
        bold: 'var(--font-weight-bold)',
      },
    },
  },
  plugins: [],
};

export default config;
