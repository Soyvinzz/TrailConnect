import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { styles } from '../styles/appStyles';

export default function CustomInput({ label, error, style, ...props }) {
  return (
    <View>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput style={[styles.input, style]} {...props} />
      {!!error && <Text style={styles.inlineError}>{error}</Text>}
    </View>
  );
}