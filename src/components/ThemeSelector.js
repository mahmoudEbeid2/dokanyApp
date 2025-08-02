import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { themeAPI } from '../utils/api/api';
import theme from '../utils/theme';

const backupThemes = [
  {
    name: 'Elegant Light',
    image: require('../../assets/theme-one.webp'),
  },
  {
    name: 'Dark Modern',
    image: require('../../assets/theme-two.webp'),
  },
];

export default function ThemeSelector({ selectedTheme, onSelectTheme }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchThemes = async () => {
    try {
      const res = await themeAPI.get('');
      const fetchedThemes = res.data.themes.map((theme) => ({
        name: theme.name,
        image: { uri: theme.image },
      }));
      setThemes(fetchedThemes);
    } catch (error) {
      console.log('Failed to load themes from API, using backup', error.message);
      setThemes(backupThemes);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  const handleLongPress = (theme) => {
    setSelectedImage(theme.image);
    onSelectTheme(theme.name);
    setModalVisible(true);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#7569FA" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subHeader}>Choose Your Theme</Text>
      <View style={styles.themesRow}>
        {themes.map((theme) => (
          <TouchableOpacity
            key={theme.name}
            onLongPress={() => handleLongPress(theme)}
            onPress={() => onSelectTheme(theme.name)}
            style={[
              styles.themeBox,
              selectedTheme === theme.name && styles.selectedBox,
            ]}
          >
            <Image source={theme.image} style={styles.themeImage} />
            <Text style={styles.themeName}>{theme.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedTheme}</Text>
            <Image
              source={selectedImage}
              style={styles.modalImage}
              resizeMode="contain"
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    ...theme.shadow,
  },
  subHeader: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: theme.fonts.bold,
  },
  themesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  themeBox: {
    width: '48%',
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    padding: 5,
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    ...theme.shadow,
  },
  selectedBox: {
    borderColor: theme.colors.primary,
  },
  themeImage: {
    width: '100%',
    height: 120,
    borderRadius: theme.radius.sm,
  },
  themeName: {
    marginTop: 8,
    fontWeight: '500',
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: theme.radius.md,
    width: '90%',
    alignItems: 'center',
    ...theme.shadow,
  },
  modalTitle: {
    fontSize: theme.fonts.size.lg,
    fontWeight: '700',
    marginBottom: 16,
    color: theme.colors.text,
    marginTop: 10,
    fontFamily: theme.fonts.bold,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: theme.radius.sm,
  },
  closeButton: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    marginTop: 16,
    ...theme.shadow,
  },
  closeButtonText: {
    color: theme.colors.card,
    fontSize: theme.fonts.size.md,
    fontWeight: 'bold',
    fontFamily: theme.fonts.bold,
  },
});


