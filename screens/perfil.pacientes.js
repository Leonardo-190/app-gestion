import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../Themecontext';

export default function PerfilPaciente({ route, navigation }) {
  // Recibe los datos del paciente desde la pantalla anterior
  const { paciente } = route.params || { paciente: { nombre: 'Paciente Desconocido', edad: 'N/A', diagnostico: 'N/A' } };
  const { colors, isDarkMode } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Header con botón de regreso */}
      <View style={[styles.header, { backgroundColor: colors.card }] }>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.primary }]}>← Volver</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Ficha Médica</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Sección de Perfil  */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }] }>
          <View style={[styles.avatar, { backgroundColor: isDarkMode ? '#2C2C2E' : '#E1E9FF' }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>{paciente.nombre.charAt(0)}</Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{paciente.nombre}</Text>
          <Text style={[styles.details, { color: colors.subtext }]}>{paciente.edad} años • ID: 2026-00{paciente.id}</Text>
        </View>

        {/* Información Clínica */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Diagnóstico Actual</Text>
          <View style={[styles.infoBox, { backgroundColor: colors.card, borderLeftColor: colors.primary }]}>
            <Text style={[styles.infoText, { color: colors.text }]}>{paciente.diagnostico}</Text>
          </View>
        </View>

        {/* Historial  */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Historial de Consultas</Text>
          
          <View style={[styles.historyItem, { backgroundColor: colors.card }] }>
            <Text style={[styles.historyDate, { color: colors.primary }]}>15 Mar 2026</Text>
            <Text style={[styles.historyDesc, { color: colors.subtext }]}>Revisión de rutina y ajuste de medicación.</Text>
          </View>

          <View style={[styles.historyItem, { backgroundColor: colors.card }] }>
            <Text style={[styles.historyDate, { color: colors.primary }]}>02 Feb 2026</Text>
            <Text style={[styles.historyDesc, { color: colors.subtext }]}>Reportó fatiga leve. Se solicitaron análisis de sangre.</Text>
          </View>
        </View>

        {/* Acciones Rápidas */}
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}>
          <Text style={[styles.actionButtonText, { color: '#fff' }]}>Nueva Nota Médica</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { marginRight: 15 },
  backText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  
  scrollContent: { padding: 20 },
  
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E1E9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#007AFF' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' },
  details: { fontSize: 14, color: '#666', marginTop: 5 },

  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  infoBox: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#007AFF',
  },
  infoText: { fontSize: 16, color: '#444' },

  historyItem: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  historyDate: { fontSize: 12, color: '#007AFF', fontWeight: 'bold', marginBottom: 5 },
  historyDesc: { fontSize: 14, color: '#555' },

  actionButton: {
    backgroundColor: '#34C759',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  actionButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});