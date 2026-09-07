import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import CustomButton from "../src/components/CustomButton";
import CustomInput from "../src/components/CustomInput";
import { useTheme } from "../src/contexts/ThemeContext";
import { useLoginViewModel } from "../src/viewmodels/useLoginViewModel";

export default function LoginScreen() {
  const { theme} = useTheme();
  const isDarkMode = theme === "dark";
  const { email, setEmail, password, setPassword, handleLogin, loading, error } = useLoginViewModel();

  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  return (
    <View style={[styles.container, themeStyles.background]}>
      <Text style={[styles.title, themeStyles.text]}>Sign In</Text>

      <CustomInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        />
      <CustomInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        ) : (
          <CustomButton title="Login" onPress={handleLogin} />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20},
  title: {
    fontSize: 28, fontWeight: "bold", marginBottom: 30, textAlign: "center"},
    loader: {
      marginTop: 20,
    },
    errorText: {
      color: "red",
      marginBottom: 15,
      textAlign: "center"}
});

const lightStyles = StyleSheet.create({
  background: {
    backgroundColor: '#F3F4F6' },
  text: {
    color: '#111827' }
  });

  const darkStyles = StyleSheet.create({
    background: {
      backgroundColor: '#1F2937' },
    text: {
      color: '#F9FAFB' }
  });