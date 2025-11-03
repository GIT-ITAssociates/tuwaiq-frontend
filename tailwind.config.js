
module.exports = {
  content: [ "./app/**/*.js", 'components/**/*.js'],


  theme: {
    extend: {
      colors:{
        primary:'#B68C5A', // E1B65E
        textColor:'#3A3D3F',
        bodyText:'#242628',
        borderColor:'#1B3A57',
        secondary : '#3A3D3F',
        bgColor:'#E0E0E0',

      },
      screens:{
        xs:"360px",
   
        
      }
    }, // Customize the default Tailwind theme if needed
  },
  plugins: [],
};
