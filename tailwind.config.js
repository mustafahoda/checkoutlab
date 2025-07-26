/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    colors: {
      border: "hsl(var(--border))",
      adyen: "var(--custom-accent)",
      code: "hsl(var(--custom-accent-code))",
      variable: "var(--code-variable)",
      property: "var(--code-property)",
      reserved: "var(--code-reserved)",
      grey: "hsl(var(--grey))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },

      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
      warning: {
        DEFAULT: "var(--color-warning)",
      },
      info: {
        DEFAULT: "var(--custom-accent-info)",
      },
      js: {
        DEFAULT: "var(--color-js-icon)",
      },
      preview: {
        DEFAULT: "var(--color-preview-icon)",
      },
    },
    extend: {
      fontSize: {
        xxs: "var(--custom-font-xxs)", // Example: 10px
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        typing: {
          "0%": {
            width: "0%",
            visibility: "visible",
            borderRightWidth: "2px",
            borderRightColor: "hsl(var(--foreground))"
          },
          "99.9%": {
            borderRightWidth: "2px",
            borderRightColor: "hsl(var(--foreground))"
          },
          "100%": {
            width: "100%",
            borderRightWidth: "0px"
          },
        },
        cursor: {
          "0%, 100%": {
            borderRightColor: "hsl(var(--foreground))"
          },
          "50%": {
            borderRightColor: "transparent"
          }
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "slide-in-from-top": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" }
        },
        "bubble-slow": {
          '0%': { transform: 'translateY(0) scale(0.8)', opacity: '0.4' },
          '50%': { transform: 'translateY(-20px) scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'translateY(-40px) scale(0.8)', opacity: '0' },
        },
        "bubble-medium": {
          '0%': { transform: 'translateY(0) scale(0.8)', opacity: '0.4' },
          '50%': { transform: 'translateY(-15px) scale(1.1)', opacity: '0.8' },
          '100%': { transform: 'translateY(-30px) scale(0.8)', opacity: '0' },
        },
        "bubble-fast": {
          '0%': { transform: 'translateY(0) scale(0.8)', opacity: '0.4' },
          '50%': { transform: 'translateY(-10px) scale(1.1)', opacity: '0.8' },
          '100%': { transform: 'translateY(-20px) scale(0.8)', opacity: '0' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        typing: "typing 2s steps(40), cursor 1s step-end infinite",
        "slide-in": "slide-in 0.4s ease-out",
        "slide-in-right": "slide-in-right 0.4s ease-out",
        "slide-in-from-top": "slide-in-from-top 0.4s ease-out",
        "bubble-slow": "bubble-slow 3s ease-in-out infinite",
        "bubble-medium": "bubble-medium 2.5s ease-in-out infinite",
        "bubble-fast": "bubble-fast 2s ease-in-out infinite",
      },
      backgroundImage: {
        'dotted-grid': 'radial-gradient(circle, hsla(var(--border) / 0.3) 1.3px, transparent 0.5px)',
      },
      backgroundSize: {
        'grid': '8px 8px',
      },
      boxShadow: {
        'hover': '0 1px 1px 0 rgba(0, 0, 0, .12), 0 2px 5px 0 rgba(48, 49, 61, .08)',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addVariant }) {
      addVariant('embed-iframe', '.embed-iframe &')
    },
  ],
};
