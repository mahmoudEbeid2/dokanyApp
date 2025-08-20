import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../utils/theme';

const TabNavigation = ({ activeTab, onTabChange, tabs }) => {
  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => onTabChange(tab.key)}
          style={[
            styles.tabButton,
            activeTab === tab.key && styles.activeTab
          ]}
        >
          <Text style={[
            styles.tabText,
            activeTab === tab.key && styles.activeText
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.size.sm,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: theme.fonts.size.sm,
  },
});

export default TabNavigation;
