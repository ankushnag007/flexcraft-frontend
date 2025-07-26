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
    primary: '#ffffff',
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
  {
    name: 'Emerald',
    primary: '#e8f5e9',
    background: '#c8e6c9',
    accent: '#2e7d32',
    text: '#1b5e20',
    textoption: '#388e3c',
    card: '#ffffff',
    highlight: '#a5d6a7'
  },
  {
    name: 'Forest Night',
    primary: '#1b5e20',
    background: '#003300',
    accent: '#69f0ae',
    text: '#e8f5e9',
    textoption: '#a5d6a7',
    card: '#2e7d32',
    highlight: '#388e3c'
  },
  {
    name: 'Sunset',
    primary: '#fff3e0',
    background: '#ffe0b2',
    accent: '#e65100',
    text: '#bf360c',
    textoption: '#d84315',
    card: '#ffffff',
    highlight: '#ffcc80'
  },
  {
    name: 'Royal Purple',
    primary: '#f3e5f5',
    background: '#e1bee7',
    accent: '#7b1fa2',
    text: '#4a148c',
    textoption: '#6a1b9a',
    card: '#ffffff',
    highlight: '#ce93d8'
  },
  {
    name: 'Midnight',
    primary: '#0a192f',
    background: '#020c1b',
    accent: '#64ffda',
    text: '#ccd6f6',
    textoption: '#8892b0',
    card: '#112240',
    highlight: '#233554'
  },
  {
    name: 'Coral',
    primary: '#ffebee',
    background: '#ffcdd2',
    accent: '#c62828',
    text: '#b71c1c',
    textoption: '#d32f2f',
    card: '#ffffff',
    highlight: '#ef9a9a'
  },
  {
    name: 'Modern Teal',
    primary: '#e0f2f1',
    background: '#b2dfdb',
    accent: '#00897b',
    text: '#004d40',
    textoption: '#00796b',
    card: '#ffffff',
    highlight: '#80cbc4'
  },
  {
    name: 'Nordic',
    primary: '#eceff4',
    background: '#e5e9f0',
    accent: '#5e81ac',
    text: '#2e3440',
    textoption: '#3b4252',
    card: '#d8dee9',
    highlight: '#81a1c1'
  },
  {
    name: 'Amber',
    primary: '#fff8e1',
    background: '#ffecb3',
    accent: '#ff8f00',
    text: '#ff6f00',
    textoption: '#ffa000',
    card: '#ffffff',
    highlight: '#ffe082'
  },
  {
    name: 'Sakura',
    primary: '#fce4ec',
    background: '#f8bbd0',
    accent: '#ad1457',
    text: '#880e4f',
    textoption: '#c2185b',
    card: '#ffffff',
    highlight: '#f48fb1'
  },
  {
    name: 'Cyberpunk',
    primary: '#0f0f1a',
    background: '#070710',
    accent: '#ff2a6d',
    text: '#d1f7ff',
    textoption: '#05d9e8',
    card: '#1a1a2e',
    highlight: '#2a2a40'
  }
];

export const defaultTheme = themes[0];