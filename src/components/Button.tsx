import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}

export default function Button({ onPress, title, loading, variant = 'primary', className }: ButtonProps) {
  const buttonStyles = [
    styles.base,
    variant === 'primary' && styles.primary,
    variant === 'secondary' && styles.secondary,
    variant === 'ghost' && styles.ghost,
    loading && styles.loading,
  ];

  const textStyles = [
    styles.textBase,
    variant === 'primary' && styles.textPrimary,
    variant === 'secondary' && styles.textSecondary,
    variant === 'ghost' && styles.textGhost,
  ];

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={buttonStyles}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator 
          color={variant === 'primary' ? 'white' : '#374151'} 
          style={styles.loader}
        />
      )}
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: '#374151',
  },
  secondary: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  loading: {
    opacity: 0.7,
  },
  textBase: {
    fontSize: 16,
    fontWeight: '600',
  },
  textPrimary: {
    color: '#ffffff',
  },
  textSecondary: {
    color: '#111827',
  },
  textGhost: {
    color: '#6b7280',
  },
  loader: {
    marginRight: 8,
  },
});
