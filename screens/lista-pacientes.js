import { useState } from 'react';
import { Alert, FlatList, Modal, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../Themecontext';
import { usePatients } from '../context/PatientsContext';

export default function ListaPacientes({ navigation }) {
  const { colors, isDarkMode } = useTheme();
  const { patients, addPatient, logout } = usePatients();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newDiag, setNewDiag] = useState('');

  // Función de la busqueda
  const handleSearch = (text) => {
    setSearch(text);
  };

  // Componente de las tarjetas
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('PerfilPaciente', { paciente: item })}
    >
      <View style={styles.cardInfo}>
        <Text style={[styles.patientName, { color: colors.text }]}>{item.nombre}</Text>
        <Text style={[styles.patientSub, { color: colors.subtext }]}>{item.edad} años • {item.diagnostico}</Text>
      </View>
      <View style={styles.arrowContainer}>
        <Text style={[styles.arrow, { color: colors.border }]}>〉</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Cabecera */}
      <View style={[styles.header, { borderBottomColor: colors.border }] }>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Pacientes</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.card, marginRight: 10 }]}
            onPress={() => {
              Alert.alert('Cerrar sesión', '¿Deseas cerrar la sesión?', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Salir', style: 'destructive', onPress: async () => {
                  try {
                    await logout();
                  } catch (e) {
                    console.warn('Logout error', e);
                  }
                  navigation.reset({ index: 0, routes: [{ name: 'Inicio' }] });
                } }
              ]);
            }}
          >
            <Text style={[styles.iconText, { color: colors.text }]}>Salir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.card, marginRight: 10 }]} onPress={() => navigation.navigate('Ajustes')}>
            <Text style={[styles.iconText, { color: colors.text }]}>⚙</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={() => setShowAddModal(true)}>
            <Text style={[styles.addButtonText, { color: '#FFF' }]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Buscador (Criterio de UX) */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: isDarkMode ? '#2C2C2E' : '#E9EBEE', color: colors.text, borderColor: colors.border } ]}
          placeholder="Buscar paciente..."
          placeholderTextColor={colors.subtext}
          value={search}
          onChangeText={(text) => handleSearch(text)}
        />
      </View>

      {/* Lista Eficiente (Criterio de Rendimiento: FlatList) */}
      <FlatList
        data={search ? patients.filter(item => item.nombre.toUpperCase().includes(search.toUpperCase())) : patients}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.subtext }]}>No se encontraron pacientes.</Text>
        }
      />

      {/* Modal para añadir paciente (local) */}
      <Modal visible={showAddModal} animationType="slide" transparent={true}>
        <View style={modalStyles.overlay}>
          <View style={[modalStyles.modal, { backgroundColor: colors.card }] }>
            <Text style={[modalStyles.modalTitle, { color: colors.text }]}>Añadir Paciente</Text>
            <TextInput placeholder="Nombre" placeholderTextColor={colors.subtext} style={[modalStyles.input, { color: colors.text, borderColor: colors.border }]} value={newName} onChangeText={setNewName} />
            <TextInput placeholder="Edad" placeholderTextColor={colors.subtext} style={[modalStyles.input, { color: colors.text, borderColor: colors.border }]} value={newAge} onChangeText={setNewAge} keyboardType="numeric" />
            <TextInput placeholder="Diagnóstico" placeholderTextColor={colors.subtext} style={[modalStyles.input, { color: colors.text, borderColor: colors.border }]} value={newDiag} onChangeText={setNewDiag} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <TouchableOpacity style={[modalStyles.btn, { backgroundColor: colors.border }]} onPress={() => setShowAddModal(false)}>
                <Text style={{ color: colors.text }}>Cerrar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[modalStyles.btn, { backgroundColor: colors.primary }]} onPress={() => {
                const newPatient = { id: String(Date.now()), nombre: newName || 'Paciente', edad: newAge || 'N/A', diagnostico: newDiag || 'N/A' };
                addPatient(newPatient);
                setNewName(''); setNewAge(''); setNewDiag(''); setShowAddModal(false);
              }}>
                <Text style={{ color: '#fff' }}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#E9EBEE',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  patientSub: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  arrowContainer: {
    justifyContent: 'center',
  },
  arrow: {
    fontSize: 18,
    color: '#CCC',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
    fontSize: 16,
  }
});

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modal: { width: '90%', borderRadius: 12, padding: 18 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 10 },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 10 },
  btn: { padding: 12, borderRadius: 8, minWidth: 100, alignItems: 'center' }
});

// estilos de iconos pequeños
styles.iconButton = { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' };
styles.iconText = { fontSize: 18 };