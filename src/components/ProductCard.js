import React, { memo, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../utils/theme';

const ProductCard = memo(({ product, onPress }) => {
  const imageUri = product?.images?.[0]?.image;

  const handlePress = useCallback(() => {
    onPress(product.id);
  }, [onPress, product.id]);

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
         <Image 
           source={{ uri: imageUri }} 
           style={styles.image}
           resizeMethod="resize"
           fadeDuration={0}
         />
         {product?.discount && (
           <View style={styles.discountBadge}>
             <Text style={styles.discountText}>-{product.discount}%</Text>
           </View>
         )}
       </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${product?.price || '0'}</Text>
          {product?.discount && (
            <Text style={styles.originalPrice}>${product?.originalPrice || product?.price}</Text>
          )}
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusIndicator, 
            { backgroundColor: product?.status === 'active' ? theme.colors.success : theme.colors.error }
          ]} />
          <Text style={styles.statusText}>{product?.status || 'N/A'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: theme.radius.lg,
    margin: 7,
    backgroundColor: theme.colors.card,
    maxWidth: 170,
    height: 280,
    overflow: 'hidden',
    elevation: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#f8f9fa',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.colors.error,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 40,
    alignItems: 'center',
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: theme.fonts.size.md,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: theme.fonts.size.lg,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
  },
});

export default ProductCard;

