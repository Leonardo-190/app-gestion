import React from 'react';
import { StyleSheet, View,Text,FlatList, SafeAreaView } from 'react-native';

export default function Citas() {
  const isDarkMode = false; // funcion de modo oscuro

  const renderCita = ({ item }) => (
    <View style={[styles.card, isDarkMode ? styles.darkCard : styles.lightCard]}>
      <Text style={[styles.hora, isDarkMode ? styles.darkText : styles.lightText]}>{item.hora}</Text>
      <Text style={[styles.paciente, isDarkMode ? styles.darkText : styles.lightText]}>{item.paciente}</Text>
    </View>
  );
  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.darkBg : styles.lightBg]}>
      <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Mis Citas</Text>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  lightBg: { backgroundColor: '#F2F2F7' },
  darkBg: { backgroundColor: '#000' },
  darkText: { color: '#FFF' },
  lightText: { color: '#000' },
  darkCard: { backgroundColor: '#1C1C1E' },
  lightCard: { backgroundColor: '#FFF' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 20, borderRadius: 12, marginBottom: 15 },
  hora: { fontSize: 18, fontWeight: '600' },
  paciente: { fontSize: 16, color: '#555' }
});