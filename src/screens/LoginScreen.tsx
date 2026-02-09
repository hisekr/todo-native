import { useState } from "react";
import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { supabase } from "../lib/supabase";
import Input from "../components/Input";
import Button from "../components/Button";
import { Mail, Lock, LogIn } from "lucide-react-native";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) alert(error.message);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <LogIn size={40} color="#374151" />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
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
            title="Sign In" 
            onPress={login} 
            loading={loading}
            className="mt-4"
          />
        </View>

        <View style={styles.actionsContainer}>
          <Button 
            title="Create Account" 
            onPress={() => navigation.navigate("Signup")} 
            variant="secondary"
          />
          <Button 
            title="Forgot Password?" 
            onPress={() => navigation.navigate("Forgot")} 
            variant="ghost"
            className="py-2"
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
    gap: 16,
  },
});
