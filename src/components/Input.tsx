import { TextInput, View, TextInputProps, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  icon?: LucideIcon;
  error?: string;
  className?: string;
}

export default function Input({ icon: Icon, error, className, ...props }: InputProps) {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, error && styles.containerError]}>
        {Icon && <Icon size={20} color="#9ca3af" style={styles.icon} />}
        <TextInput 
          style={styles.input}
          placeholderTextColor="#9ca3af"
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderColor: '#e5e7eb',
  },
  containerError: {
    borderColor: '#ef4444',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#111827',
    fontSize: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
});
