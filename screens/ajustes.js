import { SafeAreaView, StatusBar, Switch, Text, TouchableOpacity, View } from "react-native";

export default function Ajustes(){
const [isDarkMode, setIsDarkMode] = useState(false);

//colores dinamicos
const themeContainerStyle = isDarkMode ? styles.darkContainer : styles.lightContainer;
const themetext = isDarkMode ? styles.darkText : styles.lightText;
const themecarta = isDarkMode ? styles.darkCarta : styles.lightCarta;

return(
 <SafeAreaView style={[styles.container, themeContainer]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      <View style={styles.header}>
        <Text style={[styles.title, themeText]}>Configuración</Text>
      </View>

      <View style={styles.content}>
        {/* Selector de Modo Oscuro */}
        <View style={[styles.optionItem, themeCard]}>
          <Text style={[styles.optionText, themeText]}>Modo Oscuro</Text>
          <Switch 
            value={isDarkMode} 
            onValueChange={(value) => setIsDarkMode(value)}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isDarkMode ? "#007AFF" : "#f4f3f4"}
          />
        </View>

        <TouchableOpacity style={[styles.logoutButton, { borderColor: isDarkMode ? '#FF453A' : '#FF3B30' }]}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  lightContainer: { backgroundColor: '#F2F2F7' },
  darkContainer: { backgroundColor: '#1C1C1E' },
  header: { padding: 25 },
  title: { fontSize: 32, fontWeight: 'bold' },
  lightText: { color: '#1A1A1A' },
  darkText: { color: '#FFFFFF' },
  content: { padding: 20 },
  optionItem: { 
    padding: 18, borderRadius: 12, flexDirection: 'row', 
    justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 
  },
  lightCard: { backgroundColor: '#FFF' },
  darkCard: { backgroundColor: '#2C2C2E' },
  optionText: { fontSize: 16, fontWeight: '500' },
  logoutButton: { marginTop: 30, padding: 18, borderRadius: 12, alignItems: 'center', borderWidth: 1 },
  logoutText: { color: '#FF3B30', fontWeight: 'bold' }
});