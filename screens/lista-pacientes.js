import { useState } from 'react';
import { FlatList, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PACIENTES_DATA = [
  { id: '1', nombre: 'Martina Zuniga', edad: 28, diagnostico: 'Control General' },
  { id: '2', nombre: 'Emilio Navarro', edad: 45, diagnostico: 'Hipertensión' },
  { id: '3', nombre: 'Sofía Valdés', edad: 32, diagnostico: 'Seguimiento Post-op' },
  { id: '4', nombre: 'Ricardo Soto', edad: 50, diagnostico: 'Diabetes Tipo 2' },
];
export default function ListaPacientes({ navigation }) {
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState(PACIENTES_DATA);

  // Función de la busqueda
  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const newData = PACIENTES_DATA.filter(item => {
        const itemData = item.nombre ? item.nombre.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
    } else {
      setFilteredData(PACIENTES_DATA);
    }
  };

  // Componente de las tarjetas
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PerfilPaciente', { paciente: item })}
    >
      <View style={styles.cardInfo}>
        <Text style={styles.patientName}>{item.nombre}</Text>
        <Text style={styles.patientSub}>{item.edad} años • {item.diagnostico}</Text>
      </View>
      <View style={styles.arrowContainer}>
        <Text style={styles.arrow}>〉</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Cabecera */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pacientes</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Buscador (Criterio de UX) */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar paciente..."
          value={search}
          onChangeText={(text) => handleSearch(text)}
        />
      </View>

      {/* Lista Eficiente (Criterio de Rendimiento: FlatList) */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No se encontraron pacientes.</Text>
        }
      />
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