// theme.js

const colors = {
  primary: '#5B67F3',
  secondary: '#A259F7',
  accent: '#FFB86C',
  background: '#F7F8FA',
  card: '#FFFFFF',
  text: '#222B45',
  textSecondary: '#6E7FAA',
  border: '#E5E9F2',
  success: '#4CD964',
  error: '#FF5A5F',
  warning: '#FFD600',
  shadow: 'rgba(91, 103, 243, 0.08)',
};

const fonts = {
  regular: undefined,
  bold: undefined,
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
};

const radius = {
  sm: 8,
  md: 16,
  lg: 24,
};

const shadow = {
  shadowColor: colors.shadow || '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.12,
  shadowRadius: 12,
  elevation: 4,
};

const strongShadow = {
  shadowColor: colors.shadow || '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.25,
  shadowRadius: 16,
  elevation: 8,
};

// Unified Header Styles
const header = {
  // Main header container
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 20,
    marginTop: 15,
    backgroundColor: 'transparent',
  },
  // Main title style - centered
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    flex: 1,
  },
  // Back button style
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    shadowColor: colors.shadow || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Placeholder for balance
  placeholder: {
    width: 40,
    height: 40,
  },
};

// Unified FAB (Floating Action Button) Style
const fab = {
  position: 'absolute',
  bottom: 50,
  right: 20,
  backgroundColor: colors.primary,
  width: 56,
  height: 56,
  borderRadius: 28,
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: colors.shadow || '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.12,
  shadowRadius: 12,
  elevation: 4,
  zIndex: 10,
};

export default {
  colors,
  fonts,
  radius,
  shadow,
  strongShadow,
  header,
  fab,
}; 