/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./pages/**/*.{vue,js}', 'App.vue', './components/**/*.{vue,js}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#1c98f8',
					light: '#1c8dff', // 可选：更浅
					dark: '#0d4b8b', // 可选：更深
				}
			}
		},
	},
	plugins: [],
	important: true,
}