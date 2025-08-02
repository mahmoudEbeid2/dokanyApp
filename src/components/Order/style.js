import theme from '../../utils/theme';
import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 0,
    width: '100%',
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.fonts.size.xl,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.colors.text,
    marginTop: 10,
  },
  pikerContinuer: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '100%',
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: theme.fonts.size.lg,
    paddingVertical: 5,
    color: theme.colors.text,
  },
  inputAndroid: {
    fontSize: theme.fonts.size.lg,
    paddingVertical: 5,
    color: theme.colors.text,
  },
  placeholder: {
    color: theme.colors.textSecondary,
  },
};

const loderStyles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { styles, pickerSelectStyles, loderStyles };
