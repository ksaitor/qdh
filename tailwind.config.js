module.exports = {
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyan: '#02FCF9',
        'accent-1': '#333',
      },
      animation: {
        'spin-fast': 'spin .6s linear infinite',
      },
    },
  },
  variants: {
    zIndex: ['responsive', 'hover'],
  },
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
}
