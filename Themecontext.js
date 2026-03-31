import { createContext, useContext, useState } from 'react';

//crea el contenido
const ThemeContext = createContext();

// creacion de el proveedor 
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    };

    //Define los colores 
    const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
        background: isDarkMode ? '#1C1C1E' : '#F2F2F7',
        card: isDarkMode ? '#2C2C2E' : '#FFF',
      text: isDarkMode ? '#FFFFFF' : '#1A1A1A',
        subtext: isDarkMode ? '#A1A1A1' : '#555',
        primary: isDarkMode ? '#007AFF' : '#007AFF',
        border: isDarkMode ? '#2C2C2E' : '#E5E5EA',
    },
  };
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}
export const useTheme = () => useContext(ThemeContext);