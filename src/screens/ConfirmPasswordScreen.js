import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import {authAPI} from '../utils/api/api';
import theme from '../utils/theme';

export default function ConfirmPasswordScreen({ route }) {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
  const token = route?.params?.token;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenHeight(window.height);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  const handleConfirm = async () => {
    setError('');
    setMessage('');

    if (!newPassword.trim()) {
      setError('Password is required');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const res = await authAPI.post('seller/reset-password/confirm', { token, newPassword });
      setMessage(res.data.message || 'Password has been reset successfully.');
    } catch (err) {
      setError(err?.response?.data?.error || 'Password reset failed');
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Set New Password</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="New password"
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  setError('');
                  setMessage('');
                }}
                secureTextEntry
                placeholderTextColor={theme.colors.textSecondary}
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}
              {message ? <Text style={styles.success}>{message}</Text> : null}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleConfirm}>
              <Text style={styles.buttonText}>Confirm Password</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    minHeight: Dimensions.get('window').height - 100,
  },
  title: {
    fontSize: theme.fonts.size.lg,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: theme.colors.text,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.card,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  error: {
    color: theme.colors.error,
    marginTop: 6,
    fontSize: theme.fonts.size.sm,
  },
  success: {
    color: theme.colors.success,
    marginTop: 6,
    fontSize: theme.fonts.size.sm,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonText: {
    color: theme.colors.card,
    fontWeight: 'bold',
    fontSize: theme.fonts.size.md,
  },
});

