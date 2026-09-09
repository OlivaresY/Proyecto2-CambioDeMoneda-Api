import { StyleSheet, Switch, Text, View } from 'react-native';
import Custombutton from '../../src/components/CustomButton';
import { useAuth } from '../../src/contexts/AuthContext';
import { useTheme } from '../../src/contexts/ThemeContext';


export default function SettingsScreen() {
    const { theme, toggleTheme } = useTheme();
    const isDarkMode = theme === 'dark';
    
    const { user, logout } = useAuth();
    const themeStyles = isDarkMode ? darkStyles : lightStyles;

    return (
        <View style={[styles.container, themeStyles.background]}>
            <View style={[styles.card, themeStyles.cardBg]}>
                <Text style={[styles.title, themeStyles.text]}>Settings</Text>

                {user && (
                    <Text style={[styles.userInfo, themeStyles.text]}>
                        Logged in as: {user.name || 'User'}
                    </Text>
                )}

                <View style={styles.row}>
                    <Text style={[styles.label, themeStyles.text]}>Dark Mode</Text>
                    <Switch
                        value={isDarkMode}
                        onValueChange={toggleTheme}
                    />
                </View>

                <Custombutton title="Logout" onPress={logout} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    card: { padding: 20, borderRadius: 12 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    userInfo: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    label: { fontSize: 18 }
});

const lightStyles = StyleSheet.create({
    background: { backgroundColor: '#F3F4F6' },
    cardBg: { backgroundColor: '#FFFFFF' },
    text: { color: '#1F2937' }
});

const darkStyles = StyleSheet.create({
    background: { backgroundColor: '#111827' },
    cardBg: { backgroundColor: '#1F2937' },
    text: { color: '#F9FAFB' }
});


