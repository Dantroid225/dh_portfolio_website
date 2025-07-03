// Layout components
export { default as Navbar } from './layout/Navbar';
export { default as Footer } from './layout/Footer';

// Context
export { ThemeProvider } from './context/ThemeContext';
export { useTheme } from '@/shared/hooks/useTheme';
export { AuthProvider, useAuth } from './context/AuthContext';
