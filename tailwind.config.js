export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cacao: {
          950: '#2B1810', // chocolate derretido — texto, nav, estados seleccionados
          800: '#4A2C1D',
          700: '#5C3824',
          500: '#8A6650',
          300: '#B99D89'
        },
        canela: {
          700: '#8C4620', // rama de canela — acento principal (botones de acción)
          600: '#AE5A2B',
          200: '#E8C9AD'
        },
        marshmallow: {
          50: '#FAF2E6',  // fondo general — leche espumada
          100: '#F3E3CE', // superficies con tinte
          surface: '#FFFCF6' // tarjetas y paneles
        },
        matcha: { 600: '#5B7553' }, // éxito — menta de guarnición
        chile: { 600: '#9C3B2E' },  // error/destructivo — chile de árbol
        miel: { 600: '#C98A2C' }    // advertencia — miel de abeja
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Work Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        warm: '0 12px 28px -10px rgba(43, 24, 16, 0.22)',
        warmsm: '0 4px 12px -4px rgba(43, 24, 16, 0.16)'
      },
      borderRadius: { '2xl': '1.25rem' }
    }
  },
  plugins: []
}
