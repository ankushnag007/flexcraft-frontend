export type Theme = {
  name: string;
  primary: string;
  background: string;
  accent: string;
  text: string;
  textoption: string;
  card?: string;
  highlight?: string;
};

export const themes: Theme[] = [
  {
    name: 'Classic Light',
    primary: 'black',
    background: '#f8f9fa',
    accent: '#3a86ff',
    text: '#212529',
    textoption: '#495057',
    card: '#ffffff',
    highlight: '#f8f9fa'
  },
  {
    name: 'Classic Dark',
    primary: '#212529',
    background: '#121212',
    accent: '#3a86ff',
    text: '#e9ecef',
    textoption: '#adb5bd',
    card: '#343a40',
    highlight: '#495057'
  },
  {
    name: 'Ocean Breeze',
    primary: '#e3f2fd',
    background: '#bbdefb',
    accent: '#1976d2',
    text: '#0d47a1',
    textoption: '#1565c0',
    card: '#ffffff',
    highlight: '#90caf9'
  },
  {
    name: 'Deep Ocean',
    primary: '#01579b',
    background: '#002f6c',
    accent: '#4fc3f7',
    text: '#e1f5fe',
    textoption: '#b3e5fc',
    card: '#0277bd',
    highlight: '#0288d1'
  },

];

export const defaultTheme = themes[0];