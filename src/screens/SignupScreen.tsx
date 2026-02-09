import { useState } from "react";
import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { supabase } from "../lib/supabase";
import Input from "../components/Input";
import Button from "../components/Button";
import { Mail, Lock, UserPlus } from "lucide-react-native";

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);

    if (error) alert(error.message);
    else alert("Check your email to confirm signup");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <UserPlus size={40} color="#374151" />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
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

          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={Lock}
          />
          
          <Button 
            title="Create Account" 
            onPress={signup}
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
  },
  formContainer: {
    gap: 8,
  },
  actionsContainer: {
    marginTop: 32,
  },
});
