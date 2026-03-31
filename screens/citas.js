import { useState } from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
// 1. Importamos el hook del tema
import { useTheme } from '../Themecontext';
import { usePatients } from '../context/PatientsContext';

export default function Citas() {
  // 2. Extraemos los colores y el estado del tema global
  const { colors, isDarkMode } = useTheme();
  const { patients, addAppointment, deleteAppointment } = usePatients();
  const [filtro, setFiltro] = useState('Todas');
  const [modalVisible, setModalVisible] = useState(false);
  const [selPatientId, setSelPatientId] = useState(patients.length ? patients[0].id : '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('Pendiente');

  // construir lista global de citas a partir de pacientes
  const allCitas = patients.flatMap(p => (p.citas || []).map(c => ({ ...c, pacienteId: p.id, paciente: p.nombre })));

  const citasFiltradas = filtro === 'Todas' ? allCitas : allCitas.filter(c => c.estado === filtro);

  const renderCita = ({ item }) => (
    <View style={[styles.citaCard, { backgroundColor: colors.card }]}>
      <View style={[styles.timeContainer, { borderRightColor: colors.border }]}>
        <Text style={[styles.horaText, { color: colors.text }]}>{item.time || ''}</Text>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: item.estado === 'Urgente' ? '#FF3B30' : item.estado === 'Completada' ? '#34C759' : '#FF9500' }
        ]}>
          <Text style={styles.statusText}>{item.estado}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.pacienteText, { color: colors.text }]}>{item.paciente}</Text>
        <Text style={[styles.motivoText, { color: colors.subtext }]}>{item.motivo}</Text>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <TouchableOpacity onPress={() => deleteAppointment(item.pacienteId, item.id)} style={{ marginRight: 12 }}>
            <Text style={{ color: '#FF3B30' }}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const openNew = () => {
    setSelPatientId(patients.length ? patients[0].id : '');
    setDate(''); setTime(''); setReason(''); setStatus('Pendiente');
    setModalVisible(true);
  };

  const saveNew = () => {
    if (!selPatientId) return Alert.alert('Selecciona paciente');
    const appt = { id: Date.now().toString(), date: date || new Date().toISOString(), time, motivo: reason, estado: status };
    addAppointment(selPatientId, appt);
    (async () => {
      try {
        const Notifications = require('expo-notifications');
        const when = new Date(appt.date + (appt.time ? (' ' + appt.time) : ''));
        const trigger = when > new Date() ? when : new Date(Date.now() + 5 * 1000); // programar en futuro si la fecha es innvalida 
        await Notifications.scheduleNotificationAsync({
          content: { title: 'Recordatorio de cita', body: `${appt.motivo} — ${patients.find(p=>p.id===selPatientId)?.nombre || ''}` },
          trigger,
        });
      } catch (e) {
        console.warn('No se pudo programar notificación:', e);
      }
    })();

    setModalVisible(false);
  };

  return (
    // 4. El contenedor principal usa el fondo del tema
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Mi Agenda</Text>
        <Text style={[styles.dateText, { color: colors.primary }]}>{new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.filterBar}>
        {['Todas', 'Pendiente', 'Urgente', 'Completada'].map((f) => (
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

      <TouchableOpacity onPress={openNew} style={[styles.actionButton, { margin: 20, backgroundColor: colors.primary }]}>
        <Text style={[styles.actionButtonText, { color: '#fff' }]}>Nueva Cita</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <View style={[styles.header, { backgroundColor: colors.card }] }>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.backButton}>
              <Text style={[styles.backText, { color: colors.primary }]}>✕ Cerrar</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Nueva Cita</Text>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={{ color: colors.subtext, marginBottom: 8 }}>Paciente</Text>
            {patients.map(p => (
              <TouchableOpacity key={p.id} onPress={() => setSelPatientId(p.id)} style={{ padding: 10, borderRadius: 8, backgroundColor: selPatientId === p.id ? colors.primary : colors.card, marginBottom: 6 }}>
                <Text style={{ color: selPatientId === p.id ? '#fff' : colors.text }}>{p.nombre}</Text>
              </TouchableOpacity>
            ))}

            <TextInput placeholder="Fecha (YYYY-MM-DD)" value={date} onChangeText={setDate} style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]} />
            <TextInput placeholder="Hora (HH:MM)" value={time} onChangeText={setTime} style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]} />
            <TextInput placeholder="Motivo" value={reason} onChangeText={setReason} style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
              {['Pendiente','Completada','Cancelada'].map(s => (
                <TouchableOpacity key={s} onPress={() => setStatus(s)} style={{ padding: 10, borderRadius: 8, backgroundColor: status === s ? colors.primary : colors.border }}>
                  <Text style={{ color: status === s ? '#fff' : colors.subtext }}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={saveNew} style={[styles.actionButton, { backgroundColor: colors.primary }]}>
              <Text style={[styles.actionButtonText, { color: '#fff' }]}>Guardar Cita</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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