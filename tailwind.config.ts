import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
export default {
    darkMode: ['class'],
    content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
			p1: "#2EF2FF",
			p2: "#3C52D9",
			p3: "#C8EA80",
			p4: "#EAEDFF",
			p5: "#C4CBF5",
			s1: "#080D27",
			s2: "#0C1838",
			s3: "#334679",
			s4: "#1959AD",
			s5: "#263466",
			black: {
			DEFAULT: "#000000",
			100: "#05091D",
			},
  			primary: {
  				'50': '#f0f9ff',
  				'100': '#e0f2fe',
  				'200': '#bae6fd',
  				'300': '#7dd3fc',
  				'400': '#38bdf8',
  				'500': '#0ea5e9',
  				'600': '#0284c7',
  				'700': '#0369a1',
  				'800': '#075985',
  				'900': '#0c4a6e',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
				
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
			14: "14px",
			20: "20px",
			40: "40px",
			half: "50%",
			"7xl": "40px",
  		},
		  boxShadow: {
			100: "0px 4px 4px rgba(0, 0, 0, 0.25), 0px 16px 24px rgba(0, 0, 0, 0.25), inset 0px 3px 6px #1959AD",
			200: "0px 4px 4px rgba(0, 0, 0, 0.25), 0px 16px 24px rgba(0, 0, 0, 0.25), inset 0px 4px 10px #3391FF",
			300: "0px 4px 4px rgba(0, 0, 0, 0.25), 0px 16px 24px rgba(0, 0, 0, 0.25), inset 0px 3px 6px #1959AD",
			400: "inset 0px 2px 4px 0 rgba(255, 255, 255, 0.05)",
			500: "0px 16px 24px rgba(0, 0, 0, 0.25), 0px -14px 48px rgba(40, 51, 111, 0.7)",
		  },
		  fontFamily: {
			inter: ["Inter", "sans-serif"],
			poppins: ["Poppins", "sans-serif"],
		  },
		  transitionProperty: {
			borderColor: "border-color",
		  },
		  spacing: {
			"1/5": "20%",
			"2/5": "40%",
			"3/5": "60%",
			"4/5": "80%",
			"3/20": "15%",
			"7/20": "35%",
			"9/20": "45%",
			"11/20": "55%",
			"13/20": "65%",
			"15/20": "75%",
			"17/20": "85%",
			"19/20": "95%",
			22: "88px",
			100: "100px",
			512: "512px",
			330: "330px",
			388: "388px",
			400: "400px",
			440: "440px",
			640: "640px",
			960: "960px",
			1230: "1230px",
		  },
		  zIndex: {
			1: "1",
			2: "2",
			4: "4",
		  },
		  lineHeight: {
			12: "48px",
		  },
		  flex: {
			50: "0 0 50%",
			320: "1px 0 320px",
			300: "0 0 300px",
			540: "0 0 540px",
			280: "0 0 280px",
			256: "0 0 256px",
			100: "0 0 100%",
		  },
  	}
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;