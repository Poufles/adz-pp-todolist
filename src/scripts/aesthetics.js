const Aesthetics = function() {
    return {
        colors: {
            yellow: {
                light: '#FFFEEB',
                dark: '#FFFDF6'
            },
            green: {
                light: '#DEEDC4',
                dark: '#F1FFDA'
            },
            blue: {
                light: '#F0FFF9',
                dark: '#F6FFF7'
            },
            violet: {
                light: '#F7E3FF',
                dark: '#FDF8FF'
            },
            orange: {
                light: '#FFF8E2',
                dark: undefined,
            },
            red: {
                light: '#FFDADB',
                dark: undefined,
            },
        },
        sounds: {
            background: '',
            click: '',
            keyboard: ''
        }
    };
}();

export default Aesthetics;