import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles/appStyles';

export default function TabItem({ label, isActive, onPress }) {
  return (
    <TouchableOpacity style={[styles.tabItem, isActive && styles.tabItemActive]} onPress={onPress}>
      <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}
