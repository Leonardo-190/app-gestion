import { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../Themecontext';
import { usePatients } from '../context/PatientsContext';

export default function PerfilPaciente({ route, navigation }) {
  const { paciente } = route.params || { paciente: { id: '0', nombre: 'Paciente Desconocido', edad: 'N/A', diagnostico: 'N/A' } };
  const { colors, isDarkMode } = useTheme();
  const { updatePatient, getPatient } = usePatients();

  // Obtener la versión actual desde el contexto (si existe)
  const storedPatient = getPatient(paciente.id) || paciente;

  const [notes, setNotes] = useState(storedPatient.notas || []);
  const [modalVisible, setModalVisible] = useState(false);
  const [noteFields, setNoteFields] = useState([{ label: '', value: '' }]);

  // sincronizar si el paciente cambia en el contexto
  useEffect(() => {
    const p = getPatient(paciente.id);
    if (p) setNotes(p.notas || []);
  }, [paciente.id]);

  const addField = () => setNoteFields((s) => [...s, { label: '', value: '' }]);
  const removeField = (index) => setNoteFields((s) => s.filter((_, i) => i !== index));
  const changeField = (index, key, text) => {
    setNoteFields((s) => {
      const copy = [...s];
      copy[index] = { ...copy[index], [key]: text };
      return copy;
    });
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

        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]} onPress={() => setModalVisible(true)}>
          <Text style={[styles.actionButtonText, { color: '#fff' }]}>Nueva Nota Médica</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
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
        </Modal>

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
