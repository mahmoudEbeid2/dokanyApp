import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import theme from '../../utils/theme';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 0,
    width: '100%',
    backgroundColor: theme.colors.background,
  },
  title: {
    textAlign: 'center',
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

const customerInfoStyle = StyleSheet.create({
  title: {
    fontSize: theme.fonts.size.lg,
    fontWeight: '700',
    marginBottom: 16,
    color: theme.colors.text,
    marginTop: 10,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.lg,
  },
  name: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  data: {
    color: theme.colors.primary,
    fontSize: theme.fonts.size.sm,
  },
  icon: {
    width: 50,
    height: 50,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const summaryItemStyle = StyleSheet.create({
  continuer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    width: '100%',
    gap: 16,
  },
  image: { width: 70, height: 70, borderRadius: theme.radius.md },
  name: { fontWeight: '500', fontSize: theme.fonts.size.md, color: theme.colors.text },
  data: { color: theme.colors.textSecondary, fontSize: theme.fonts.size.sm },
});

const statusStyle = StyleSheet.create({
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
    marginTop: 20,
    color: "#120F1A",
  },
  dropdown: {
    marginBottom: 10,
    borderColor: "#7569FA",
  },
  dropdownContainer: {
    borderColor: "#7569FA",
  },
  list: {
    marginTop: 20,
  },
  Button: {
    color: "#7569FA",
  },
  ButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  ButtonDisabled: {
    color: "#ccc",
  },
  ButtonDisabledText: {
    color: "white",
    fontWeight: "bold",
  },
});

export { styles, pickerSelectStyles, customerInfoStyle, summaryItemStyle, statusStyle };
