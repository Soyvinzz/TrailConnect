import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles/appStyles';

export default function CustomButton({
  label,
  onPress,
  disabled = false,
  variant = 'primary',
  extraStyle = null,
  textStyle = null,
}) {
  const buttonStyle = [
    variant === 'primary' ? styles.primaryButton : styles.button,
    variant === 'secondary' ? styles.buttonSecondary : null,
    disabled ? styles.primaryButtonDisabled : null,
    extraStyle,
  ];

  const labelStyle = [
    variant === 'primary' ? styles.primaryButtonText : styles.buttonText,
    variant === 'secondary' ? styles.buttonSecondaryText : null,
    textStyle,
  ];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled}>
      <Text style={labelStyle}>{label}</Text>
    </TouchableOpacity>
  );
}
