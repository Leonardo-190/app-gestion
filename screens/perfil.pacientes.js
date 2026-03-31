import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../Themecontext';
import { usePatients } from '../context/PatientsContext';

export default function PerfilPaciente({ route, navigation }) {
  const { paciente } = route.params || { paciente: { id: '0', nombre: 'Paciente Desconocido', edad: 'N/A', diagnostico: 'N/A' } };
  const { colors, isDarkMode } = useTheme();
  const { updatePatient, getPatient } = usePatients();

  // Obtener la versión actual desde el contexto (si existe)
  const storedPatient = getPatient(paciente.id) || paciente;

  const [notes, setNotes] = useState(storedPatient.notas || []);
  const [vitals, setVitals] = useState(storedPatient.signos || []);
  const [appointments, setAppointments] = useState(storedPatient.citas || []);
  const [modalVisible, setModalVisible] = useState(false);
  const [noteFields, setNoteFields] = useState([{ label: '', value: '' }]);
  const [vitalsModalVisible, setVitalsModalVisible] = useState(false);
  const [weight, setWeight] = useState('');
  const [pressure, setPressure] = useState('');
  const [apptModalVisible, setApptModalVisible] = useState(false);
  const [apptDate, setApptDate] = useState('');
  const [apptTime, setApptTime] = useState('');
  const [apptReason, setApptReason] = useState('');
  const [apptStatus, setApptStatus] = useState('Pendiente');

  // sincronizar si el paciente cambia en el contexto
  useEffect(() => {
    const p = getPatient(paciente.id);
    if (p) setNotes(p.notas || []);
    if (p) setVitals(p.signos || []);
    if (p) setAppointments(p.citas || []);
  }, [paciente.id]);

  const ModalComponent = typeof Modal !== 'undefined' ? Modal : View;

  const addField = () => setNoteFields((s) => [...s, { label: '', value: '' }]);
  const removeField = (index) => setNoteFields((s) => s.filter((_, i) => i !== index));
  const changeField = (index, key, text) => {
    setNoteFields((s) => {
      const copy = [...s];
      copy[index] = { ...copy[index], [key]: text };
      return copy;
    });
  };

  const saveVital = () => {
    if (!weight && !pressure) {
      Alert.alert('Campos vacíos', 'Ingresa al menos peso o presión');
      return;
    }

    const newVital = { id: Date.now().toString(), date: new Date().toISOString(), peso: weight, presion: pressure };
    const updatedVitals = [newVital, ...vitals];
    setVitals(updatedVitals);

    const updatedPatient = { ...storedPatient, signos: updatedVitals };
    try {
      updatePatient(updatedPatient);
    } catch (e) {
      console.warn('Error al guardar signos del paciente', e);
    }

    setWeight('');
    setPressure('');
    setVitalsModalVisible(false);
  };

  const saveNote = () => {
    const filled = noteFields.filter((f) => f.label.trim() || f.value.trim());
    if (filled.length === 0) {
      Alert.alert('Nota vacía', 'Agrega al menos un campo con contenido.');
      return;
    }

    const newNote = { id: Date.now().toString(), date: new Date().toISOString(), fields: filled };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);

    const updatedPatient = { ...storedPatient, notas: updatedNotes };
    try {
      updatePatient(updatedPatient);
    } catch (e) {
      console.warn('Error al guardar la nota del paciente', e);
    }

    setNoteFields([{ label: '', value: '' }]);
    setModalVisible(false);
  };

  const saveAppointment = () => {
    if (!apptDate && !apptTime && !apptReason) {
      Alert.alert('Campos vacíos', 'Ingresa fecha/hora o motivo de la cita');
      return;
    }
    const appt = { id: Date.now().toString(), date: apptDate || new Date().toISOString(), time: apptTime, motivo: apptReason, estado: apptStatus };
    const updatedAppointments = [appt, ...appointments];
    setAppointments(updatedAppointments);

    const updatedPatient = { ...storedPatient, citas: updatedAppointments };
    try {
      // usar la función del contexto
      // addAppointment guarda en el contexto y AsyncStorage también
      if (typeof updatePatient === 'function') {
        updatePatient(updatedPatient);
      }
    } catch (e) {
      console.warn('Error al guardar cita', e);
    }

    setApptDate(''); setApptTime(''); setApptReason(''); setApptStatus('Pendiente');
    setApptModalVisible(false);
  };

  const removeAppointment = (id) => {
    Alert.alert('Eliminar cita', '¿Seguro que deseas eliminar esta cita?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => {
          const updated = appointments.filter(a => a.id !== id);
          setAppointments(updated);
          try {
            const updatedPatient = { ...storedPatient, citas: updated };
            if (typeof updatePatient === 'function') updatePatient(updatedPatient);
          } catch (e) { console.warn('Error al eliminar cita', e); }
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { backgroundColor: colors.card }] }>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.primary }]}>← Volver</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Ficha Médica</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }] }>
          <View style={[styles.avatar, { backgroundColor: isDarkMode ? '#2C2C2E' : '#E1E9FF' }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>{(paciente.nombre || '?').charAt(0)}</Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{paciente.nombre}</Text>
          <Text style={[styles.details, { color: colors.subtext }]}>{paciente.edad} años • ID: 2026-00{paciente.id}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Diagnóstico Actual</Text>
          <View style={[styles.infoBox, { backgroundColor: colors.card, borderLeftColor: colors.primary }]}> 
            <Text style={[styles.infoText, { color: colors.text }]}>{paciente.diagnostico}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Signos Vitales</Text>

          {vitals.length === 0 && (
            <Text style={[styles.historyDesc, { color: colors.subtext, marginTop: 8 }]}>No hay registros de signos vitales.</Text>
          )}

          {vitals.map((v) => (
            <View key={v.id} style={[styles.historyItem, { backgroundColor: colors.card }] }>
              <Text style={[styles.historyDate, { color: colors.primary }]}>{new Date(v.date).toLocaleString()}</Text>
              {v.peso ? <Text style={[styles.historyDesc, { color: colors.subtext }]}>Peso: {v.peso} kg</Text> : null}
              {v.presion ? <Text style={[styles.historyDesc, { color: colors.subtext }]}>Presión: {v.presion}</Text> : null}
            </View>
          ))}

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]} onPress={() => setVitalsModalVisible(true)}>
            <Text style={[styles.actionButtonText, { color: '#fff' }]}>Agregar Signos Vitales</Text>
          </TouchableOpacity>

        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Historial de Consultas</Text>

          {notes.length === 0 && (
            <Text style={[styles.historyDesc, { color: colors.subtext, marginTop: 8 }]}>No hay notas registradas.</Text>
          )}

          {notes.map((n) => (
            <View key={n.id} style={[styles.historyItem, { backgroundColor: colors.card }] }>
              <Text style={[styles.historyDate, { color: colors.primary }]}>{new Date(n.date).toLocaleString()}</Text>
              {n.fields.map((f, i) => (
                <Text key={i} style={[styles.historyDesc, { color: colors.subtext }]}>{f.label}: {f.value}</Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Citas</Text>

          {appointments.length === 0 && (
            <Text style={[styles.historyDesc, { color: colors.subtext, marginTop: 8 }]}>No hay citas registradas.</Text>
          )}

          {appointments.map((c) => (
            <View key={c.id} style={[styles.historyItem, { backgroundColor: colors.card }] }>
              <Text style={[styles.historyDate, { color: colors.primary }]}>{c.date} {c.time ? `- ${c.time}` : ''}</Text>
              <Text style={[styles.historyDesc, { color: colors.subtext }]}>{c.motivo}</Text>
              <Text style={[styles.historyDesc, { color: colors.subtext }]}>Estado: {c.estado}</Text>
              <TouchableOpacity onPress={() => removeAppointment(c.id)} style={{ marginTop: 8 }}>
                <Text style={{ color: '#FF3B30' }}>Eliminar cita</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]} onPress={() => setApptModalVisible(true)}>
            <Text style={[styles.actionButtonText, { color: '#fff' }]}>Agregar Cita</Text>
          </TouchableOpacity>

        </View>

        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]} onPress={() => setModalVisible(true)}>
          <Text style={[styles.actionButtonText, { color: '#fff' }]}>Nueva Nota Médica</Text>
        </TouchableOpacity>

        <ModalComponent visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <View style={[styles.header, { backgroundColor: colors.card }] }>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.backButton}>
                <Text style={[styles.backText, { color: colors.primary }]}>✕ Cerrar</Text>
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Nueva Nota Médica</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
              {noteFields.map((f, idx) => (
                <View key={idx} style={{ marginBottom: 12 }}>
                  <TextInput
                    placeholder="Etiqueta (ej. Síntomas)"
                    placeholderTextColor={colors.subtext}
                    value={f.label}
                    onChangeText={(t) => changeField(idx, 'label', t)}
                    style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                  />
                  <TextInput
                    placeholder="Valor / descripción"
                    placeholderTextColor={colors.subtext}
                    value={f.value}
                    onChangeText={(t) => changeField(idx, 'value', t)}
                    style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                    multiline
                  />
                  <TouchableOpacity onPress={() => removeField(idx)} style={{ alignSelf: 'flex-end', marginTop: 6 }}>
                    <Text style={{ color: colors.primary }}>Eliminar campo</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity onPress={addField} style={{ marginBottom: 16 }}>
                <Text style={{ color: colors.primary }}>+ Agregar campo</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={saveNote} style={[styles.actionButton, { backgroundColor: colors.primary }]}> 
                <Text style={[styles.actionButtonText, { color: '#fff' }]}>Guardar Nota</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </ModalComponent>

        <ModalComponent visible={vitalsModalVisible} animationType="slide" onRequestClose={() => setVitalsModalVisible(false)}>
          <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <View style={[styles.header, { backgroundColor: colors.card }] }>
              <TouchableOpacity onPress={() => setVitalsModalVisible(false)} style={styles.backButton}>
                <Text style={[styles.backText, { color: colors.primary }]}>✕ Cerrar</Text>
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Agregar Signos Vitales</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
              <TextInput
                placeholder="Peso (kg)"
                placeholderTextColor={colors.subtext}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              />

              <TextInput
                placeholder="Presión arterial (ej. 120/80)"
                placeholderTextColor={colors.subtext}
                value={pressure}
                onChangeText={setPressure}
                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              />

              <TouchableOpacity onPress={saveVital} style={[styles.actionButton, { backgroundColor: colors.primary }]}> 
                <Text style={[styles.actionButtonText, { color: '#fff' }]}>Guardar Signos</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </ModalComponent>

        <ModalComponent visible={apptModalVisible} animationType="slide" onRequestClose={() => setApptModalVisible(false)}>
          <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <View style={[styles.header, { backgroundColor: colors.card }] }>
              <TouchableOpacity onPress={() => setApptModalVisible(false)} style={styles.backButton}>
                <Text style={[styles.backText, { color: colors.primary }]}>✕ Cerrar</Text>
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Nueva Cita</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
              <TextInput
                placeholder="Fecha (YYYY-MM-DD)"
                placeholderTextColor={colors.subtext}
                value={apptDate}
                onChangeText={setApptDate}
                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              />

              <TextInput
                placeholder="Hora (HH:MM)"
                placeholderTextColor={colors.subtext}
                value={apptTime}
                onChangeText={setApptTime}
                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              />

              <TextInput
                placeholder="Motivo"
                placeholderTextColor={colors.subtext}
                value={apptReason}
                onChangeText={setApptReason}
                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                {['Pendiente','Completada','Cancelada'].map(s => (
                  <TouchableOpacity key={s} onPress={() => setApptStatus(s)} style={{ padding: 10, borderRadius: 8, backgroundColor: apptStatus === s ? colors.primary : colors.border }}>
                    <Text style={{ color: apptStatus === s ? '#fff' : colors.subtext }}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity onPress={saveAppointment} style={[styles.actionButton, { backgroundColor: colors.primary }]}> 
                <Text style={[styles.actionButtonText, { color: '#fff' }]}>Guardar Cita</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </ModalComponent>

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
  actionButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    padding: 10,
    borderRadius: 10,
    marginBottom: 6,
  }
});
