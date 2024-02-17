tailwind.config = {
  theme: {
    screens: {
      "sm": "576px",
      "md": "768px",
      "lg": "992px",
      "xl": "1200px"
    },
    extend: {
      fontFamily: {
        "open-sans": ["'OpenSans'", ...tailwind.defaultConfig.theme.fontFamily.serif]
      },
      colors: {
        "primary": "var(--pm-color)",
        "second": "var(--sc-color)",
        "accent": "var(--accent-color)",
        "accent1": "var(--accent1-color)",
        "text-light": "var(--text-light-color)",
        "text-dark": "var(--text-dark-color)",
      }
    }
  }
}