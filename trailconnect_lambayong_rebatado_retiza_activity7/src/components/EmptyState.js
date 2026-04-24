import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styles/appStyles';

export default function EmptyState({ message = 'No data available.' }) {
  return (
    <View style={styles.emptyStateCard}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}
