import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
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
      <View style={styles.contentWrapper}>
        <Image
        source={require('../assets/images/bac_logo.png')}
        style={styles.logo}
        resizeMode="contain"
        />

        <Text style={[styles.title, themeStyles.text]}>Sign In</Text>

        <View style={styles.inputContainer}>

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
      </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        ) : (
          <View style={styles.buttonContainer}>
            <CustomButton title="Login" onPress={handleLogin} />
          </View>
        )}
        <Text style={[styles.footerText, themeStyles.footerText]}>
          © {new Date().getFullYear()} YOR. Todos los derechos reservados.
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  contentWrapper: {
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logo: {
    width: '85%',
    maxWidth: 320,
    height: 110,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  inputContainer: {
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
  footerText: {
    marginTop: 35,
    fontSize: 12,
    letterSpacing: 0.5,
    textAlign: "center",
  },
});

const lightStyles = StyleSheet.create({
  background: {
    backgroundColor: '#F3F4F6',
  },
  text: {
    color: '#111827',
  },
  footerText: {
    color: '#9CA3AF', //gris modo claro
  },
});

const darkStyles = StyleSheet.create({
  background: {
    backgroundColor: '#1F2937',
  },
  text: {
    color: '#F9FAFB',
  },
  footerText: {
    color: '#6B7280',//gris modo oscuro
  }
});