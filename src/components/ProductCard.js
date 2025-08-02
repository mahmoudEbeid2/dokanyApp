import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../utils/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProductCard({ product, onPress }) {
  const imageUri = product?.images?.[0]?.image;

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(product.id)} activeOpacity={0.88}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <LinearGradient
        colors={['rgba(0,0,0,0.01)', 'rgba(0,0,0,0.55)']}
        style={styles.gradientOverlay}
      />
      <View style={styles.titleOverlay}>
        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: theme.radius.lg,
    margin: 7,
    backgroundColor: theme.colors.card,
    maxWidth: 170,
    height: 210,
    overflow: 'hidden',
    ...theme.shadow,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
  },
  titleOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: theme.fonts.size.lg,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    fontFamily: theme.fonts.bold,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 0.2,
    paddingHorizontal: 2,
  },
});

