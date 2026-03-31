import { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, Platform, SafeAreaView, StatusBar, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { CommonActions } from '@react-navigation/native';
import { resetTo } from '../navigationRef';
import { usePatients } from '../context/PatientsContext';
import { useTheme } from '../Themecontext';

export default function Ajustes({ navigation }) {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const { patients, updatePatient, deletePatient, adminProfile, setAdminProfile, logout } = usePatients();
  const [userName, setUserName] = useState('Dr. Admin');
  const [userEmail, setUserEmail] = useState('admin@ejemplo.com');

  useEffect(() => {
    if (adminProfile) {
      setUserName(adminProfile.name || 'Dr. Admin');
      setUserEmail(adminProfile.email || 'admin@ejemplo.com');
    }
  }, [adminProfile]);

  // Edición de paciente
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editDiag, setEditDiag] = useState('');

  const openEdit = (p) => {
    setEditId(p.id);
    setEditName(String(p.nombre));
    setEditAge(String(p.edad));
    setEditDiag(String(p.diagnostico));
    setShowEditModal(true);
  };

  const saveEdit = () => {
    if (!editId) return setShowEditModal(false);
    updatePatient({ id: editId, nombre: editName, edad: editAge, diagnostico: editDiag });
    setShowEditModal(false);
  };

  const confirmDelete = (id) => {
    Alert.alert('Eliminar paciente', '¿Estás seguro que deseas eliminar este paciente?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deletePatient(id) }
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', style: 'destructive', onPress: async () => {
        // Ejecuta logout persistente y resetea la navegación en el stack raíz
        try {
          await logout();
        } catch (e) {
          console.warn('Error during logout', e);
        }
        try {
          resetTo('Inicio');
        } catch (err) {
          try { navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Inicio' }] })); } catch (e) { navigation.navigate('Inicio'); }
        }
      } }
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }] }>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Configuración</Text>
      </View>

      <View style={[styles.content, { flex: 1 }] }>
        <View style={[styles.optionItem, { backgroundColor: colors.card, borderColor: colors.border }] }>
          <Text style={[styles.optionText, { color: colors.text }]}>Modo Oscuro</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isDarkMode ? "#007AFF" : "#f4f3f4"}
          />
        </View>

        {/* Perfil de usuario simple */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }] }>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Perfil de Usuario</Text>
          <TextInput value={userName} onChangeText={setUserName} placeholder="Nombre" placeholderTextColor={colors.subtext} style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]} />
          <TextInput value={userEmail} onChangeText={setUserEmail} placeholder="Email" placeholderTextColor={colors.subtext} style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]} keyboardType="email-address" />
          <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={() => { setAdminProfile({ name: userName, email: userEmail }); Alert.alert('Perfil guardado', 'Los datos del perfil se han actualizado.'); }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Guardar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Gestión de pacientes */}
        <View style={[styles.section, { backgroundColor: 'transparent', flex: 1 } ]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Gestionar Pacientes</Text>
          <FlatList
            style={{ flex: 1 }}
            data={patients}
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <View style={[styles.patientRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View>
                  <Text style={{ color: colors.text, fontWeight: '600' }}>{item.nombre}</Text>
                  <Text style={{ color: colors.subtext }}>{item.edad} años • {item.diagnostico}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => openEdit(item)} style={[styles.smallBtn, { borderColor: colors.primary }] }>
                    <Text style={{ color: colors.primary }}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confirmDelete(item.id)} style={[styles.smallBtn, { borderColor: '#FF3B30', marginLeft: 8 }]}>
                    <Text style={{ color: '#FF3B30' }}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>

        <TouchableOpacity style={[styles.logoutButton, { borderColor: '#FF3B30' }]} onPress={handleLogout}>
          <Text style={[styles.logoutText, { color: isDarkMode ? '#FF6B6B' : '#FF3B30' }]}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Modal editar paciente */}
      <Modal visible={showEditModal} animationType="slide" transparent={true}>
        <View style={modalStyles.overlay}>
          <View style={[modalStyles.modal, { backgroundColor: colors.card }]}>
            <Text style={[modalStyles.title, { color: colors.text }]}>Editar Paciente</Text>
            <TextInput value={editName} onChangeText={setEditName} placeholder="Nombre" placeholderTextColor={colors.subtext} style={[modalStyles.input, { color: colors.text, borderColor: colors.border }]} />
            <TextInput value={editAge} onChangeText={setEditAge} placeholder="Edad" placeholderTextColor={colors.subtext} style={[modalStyles.input, { color: colors.text, borderColor: colors.border }]} keyboardType="numeric" />
            <TextInput value={editDiag} onChangeText={setEditDiag} placeholder="Diagnóstico" placeholderTextColor={colors.subtext} style={[modalStyles.input, { color: colors.text, borderColor: colors.border }]} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
              <TouchableOpacity style={[modalStyles.btn, { backgroundColor: colors.border }]} onPress={() => setShowEditModal(false)}>
                <Text style={{ color: colors.text }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[modalStyles.btn, { backgroundColor: colors.primary }]} onPress={saveEdit}>
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
  ,
  section: { marginBottom: 16, padding: 12, borderRadius: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 8 },
  saveButton: { padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  patientRow: { padding: 12, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1 },
  smallBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 }
});

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modal: { width: '90%', borderRadius: 12, padding: 18 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 10 },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 10 },
  btn: { padding: 12, borderRadius: 8, minWidth: 100, alignItems: 'center' }
});