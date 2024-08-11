/** @type {import('tailwindcss').Config} */
export const darkMode = ["class"];
export const content = [
  './pages/**/*.{js,jsx}',
  './components/**/*.{js,jsx}',
  './app/**/*.{js,jsx}',
  './src/**/*.{js,jsx}',
  './hooks/**/*.{js,jsx}',
];
export const prefix = "";
export const theme = {
  container: {
    center: true,
    padding: "2rem",
    screens: {
      "2xl": "1400px",
    },
  },
  extend: {
    colors: {
      fill: {
        1: "rgba(255, 255, 255, 0.10)",
      },
      medicalGradient: "#008080",
      teal: {
        100: "#b2d8d8",
        300: "#66b2b2",
        500: "#008080",
        700: "#006666",
        900: "#004c4c",
      },
      green: {
        500: '#10B981',
      },
      red: {
        500: '#EF4444',
      },
      yellow: {
        500: '#F59E0B',
      },
      blue: {
        500: '#3B82F6',
      },
      success: {
        25: "#F6FEF9",
        50: "#ECFDF3",
        100: "#D1FADF",
        600: "#039855",
        700: "#027A48",
        900: "#054F31",
      },
      black: {
        1: "#00214F",
        2: "#344054",
      },
      gray: {
        25: "#FCFCFD",
        200: "#EAECF0",
        300: "#D0D5DD",
        500: "#667085",
        600: "#475467",
        700: "#344054",
        900: "#101828",
      },
      border: "hsl(var(--border))",
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
    },
    boxShadow: {
      creditCard: "8px 10px 16px 0px rgba(0, 0, 0, 0.05)",
      profile:
          "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
    },
    fontFamily: {
      inter: "var(--font-inter)",
      "ibm-plex-serif": "var(--font-ibm-plex-serif)",
    },
    backgroundImage: {
      "medical-gradient": "linear-gradient(90deg, #008080 0%, #137d7d 100%)",
      "gradient-mesh": "url('/icons/gradient-mesh.svg')",
      "medical-green-gradient":
        "linear-gradient(90deg, #01797A 0%, #489399 100%)",
    },
    fontFamily: {
      inter: "var(--font-inter)",
      "ibm-plex-serif": "var(--font-ibm-plex-serif)",
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
    },
    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
    },
  },
};
export const plugins = [require("tailwindcss-animate")];