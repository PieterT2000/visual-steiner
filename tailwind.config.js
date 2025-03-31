/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
			success: 'hsl(var(--success))',
			warning: 'hsl(var(--warning))',
			error: 'hsl(var(--error))',
  			accent: 'hsl(var(--accent))',
  			layer1: 'hsl(var(--layer1))',
  			layer2: 'hsl(var(--layer2))',
  			text: 'hsl(var(--text))',
			label: 'hsl(var(--label))',
  			active: 'hsl(var(--selected-text))',
  			border: 'hsl(var(--border))',
			inputBorder: 'rgb(var(--input-border))',
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
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'var(--ring)',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		width: {
  			navbar: 'var(--navbar-width)',
  			sidebar: 'var(--sidebar-width)',
  			canvas: 'calc(100vw - var(--sidebar-width) - var(--navbar-width))'
  		},
  		boxShadow: {
  			'icon-bg': 'var(--shadow-icon-bg)',
			'inputFocus': '0 0 5px 0 var(--tw-shadow-color)',
			'canvasBox': '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
			'canvasBoxItem': '0 2px 8px 0 var(--tw-shadow-color)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

