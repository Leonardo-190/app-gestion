import { useState } from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView, StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
// 1. Importamos el hook del tema
import { useTheme } from '../Themecontext';

const CITAS_DATA = [
  { id: '1', hora: '09:00 AM', paciente: 'Martina Zuniga', motivo: 'Chequeo General', estado: 'Completada' },
  { id: '2', hora: '10:30 AM', paciente: 'Emilio Navarro', motivo: 'Revisión Presión', estado: 'Pendiente' },
  { id: '3', hora: '12:00 PM', paciente: 'Sofía Valdés', motivo: 'Entrega Resultados', estado: 'Pendiente' },
  { id: '4', hora: '04:30 PM', paciente: 'Ricardo Soto', motivo: 'Consulta Diabetes', estado: 'Urgente' },
];

export default function Citas() {
  // 2. Extraemos los colores y el estado del tema global
  const { colors, isDarkMode } = useTheme();
  const [filtro, setFiltro] = useState('Todas');

  const citasFiltradas = filtro === 'Todas' 
    ? CITAS_DATA 
    : CITAS_DATA.filter(c => c.estado === filtro);

  const renderCita = ({ item }) => (
    // 3. Aplicamos color de tarjeta dinámico
    <View style={[styles.citaCard, { backgroundColor: colors.card }]}>
      <View style={[styles.timeContainer, { borderRightColor: colors.border }]}>
        <Text style={[styles.horaText, { color: colors.text }]}>{item.hora}</Text>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: item.estado === 'Urgente' ? '#FF3B30' : 
                            item.estado === 'Completada' ? '#34C759' : '#FF9500' }
        ]}>
          <Text style={styles.statusText}>{item.estado}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.pacienteText, { color: colors.text }]}>{item.paciente}</Text>
        <Text style={[styles.motivoText, { color: colors.subtext }]}>{item.motivo}</Text>
      </View>
    </View>
  );

  return (
    // 4. El contenedor principal usa el fondo del tema
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Mi Agenda</Text>
        <Text style={[styles.dateText, { color: colors.primary }]}>Lunes, 30 de Marzo</Text>
      </View>

      <View style={styles.filterBar}>
        {['Todas', 'Pendiente', 'Urgente'].map((f) => (
          <TouchableOpacity 
            key={f} 
            style={[
              styles.filterBtn, 
              { backgroundColor: filtro === f ? colors.primary : colors.border }
            ]}
            onPress={() => setFiltro(f)}
          >
            <Text style={[
              styles.filterBtnText, 
              { color: filtro === f ? '#FFF' : colors.subtext }
            ]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={citasFiltradas}
        keyExtractor={item => item.id}
        renderItem={renderCita}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { padding: 20, borderBottomWidth: 1 },
  title: { fontSize: 28, fontWeight: 'bold' },
  dateText: { fontSize: 16, color: '#007AFF', marginTop: 5, fontWeight: '500' },
  filterBar: { flexDirection: 'row', padding: 15, justifyContent: 'space-around' },
  filterBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  filterBtnText: { fontWeight: '600' },
  list: { padding: 20 },
  citaCard: {
    borderRadius: 16, padding: 16, marginBottom: 15, flexDirection: 'row', alignItems: 'center',
    ...Platform.select({ ios: { shadowOpacity: 0.1, shadowRadius: 5 }, android: { elevation: 3 } })
  },
  timeContainer: { alignItems: 'center', borderRightWidth: 1, paddingRight: 15, width: 90 },
  horaText: { fontSize: 14, fontWeight: 'bold' },
  statusBadge: { marginTop: 8, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  statusText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  infoContainer: { paddingLeft: 15, flex: 1 },
  pacienteText: { fontSize: 18, fontWeight: 'bold' },
  motivoText: { fontSize: 14, marginTop: 3 },
});