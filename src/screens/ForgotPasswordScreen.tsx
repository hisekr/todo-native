import { useState } from "react";
import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { supabase } from "../lib/supabase";
import Input from "../components/Input";
import Button from "../components/Button";
import { Mail, KeyRound } from "lucide-react-native";

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    
    if (error) alert(error.message);
    else alert("Password reset email sent");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <KeyRound size={40} color="#374151" />
          </View>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Enter your email to receive reset instructions</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            icon={Mail}
          />
          
          <Button 
            title="Send Reset Email" 
            onPress={reset}
            loading={loading}
            className="mt-4"
          />
        </View>

        <View style={styles.actionsContainer}>
          <Button 
            title="Back to Login" 
            onPress={() => navigation.goBack()} 
            variant="ghost"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    backgroundColor: '#e5e7eb',
    padding: 20,
    borderRadius: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  formContainer: {
    gap: 8,
  },
  actionsContainer: {
    marginTop: 32,
  },
});
