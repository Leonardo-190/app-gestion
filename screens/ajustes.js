import { Platform, SafeAreaView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from '../Themecontext';

export default function Ajustes() {
  const { isDarkMode, toggleTheme, colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }] }>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Configuración</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.optionItem, { backgroundColor: colors.card, borderColor: colors.border }] }>
          <Text style={[styles.optionText, { color: colors.text }]}>Modo Oscuro</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isDarkMode ? "#007AFF" : "#f4f3f4"}
          />
        </View>

        <TouchableOpacity style={[styles.logoutButton, { borderColor: '#FF3B30' }]}>
          <Text style={[styles.logoutText, { color: isDarkMode ? '#FF6B6B' : '#FF3B30' }]}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { padding: 25 },
  title: { fontSize: 32, fontWeight: 'bold' },
  content: { padding: 20 },
  optionItem: {
    padding: 18, borderRadius: 12, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderWidth: 1
  },
  optionText: { fontSize: 16, fontWeight: '500' },
  logoutButton: { marginTop: 30, padding: 18, borderRadius: 12, alignItems: 'center', borderWidth: 1 },
  logoutText: { fontWeight: 'bold' }
});