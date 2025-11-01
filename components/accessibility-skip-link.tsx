export function AccessibilitySkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-accent-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
    >
      Skip to main content
    </a>
  )
}
