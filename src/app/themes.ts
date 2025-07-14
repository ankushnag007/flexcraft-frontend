export type Theme = {
  name: string;
  primary: string;
  background: string;
  accent: string;
  text: string;
  textoption: string;
};

export const themes: Theme[] = [
  {
    name: 'Classic Light',
    primary: '#ffffff',
    background: '#f5f5f5',
    accent: '#4285f4',
    text: '#222222',
    textoption: 'black',
  },
  {
    name: 'Classic Dark',
    primary: '#222222',
    background: '#181818',
    accent: '#4285f4',
    text: '#ffffff',
    textoption: 'black',
  },
  {
    name: 'Oceanic',
    primary: '#006b8f',
    background: '#e0f7fa',
    accent: '#00bcd4',
    text: '#00363a',
    textoption: 'black',
  },
  {
    name: 'Rose',
    primary: '#e91e63',
    background: '#fce4ec',
    accent: '#ad1457',
    text: '#3a003a',
    textoption: 'black',
  },
  {
    name: 'Forest',
    primary: '#388e3c',
    background: '#e8f5e9',
    accent: '#43a047',
    text: '#1b5e20',
    textoption: 'black',
  },
  {
    name: 'Slate',
    primary: '#607d8b',
    background: '#eceff1',
    accent: '#90a4ae',
    text: '#263238',
    textoption: 'black',
  },
  {
    name: 'Solarized Light',
    primary: '#fdf6e3',
    background: '#eee8d5',
    accent: '#b58900',
    text: '#657b83',
    textoption: 'black',
  },
  {
    name: 'Solarized Dark',
    primary: '#002b36',
    background: '#073642',
    accent: '#b58900',
    text: '#93a1a1', 
    textoption: 'black',
  },
];

export const defaultTheme = themes[0];
