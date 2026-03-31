import React from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, SafeAreaView,
  StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
//  Importacion del hook del tema
import { useTheme } from '../Themecontext';
import { usePatients } from '../context/PatientsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Inicio({ navigation }) {
  //  Extraemos los colores y el estado del tema global
  const { colors, isDarkMode } = useTheme();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const { setAdminProfile } = usePatients();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = () => {
    
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('El correo es requerido');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Formato de correo inválido');
      return;
    }
    if (!password) {
      setPasswordError('La contraseña es requerida');
      return;
    }
    // Guardar datos de perfil del admin para que persistan y se muestren en Ajustes
    try {
      const profile = { name: email.split('@')[0] || 'Admin', email };
      setAdminProfile(profile);
      
      AsyncStorage.setItem('@AppGestion:adminProfile', JSON.stringify(profile)).catch(() => {});
    } catch (e) {
      console.warn('No se pudo guardar perfil admin', e);
    }

    navigation.reset({
      index: 0,
     
      routes: [{ name: 'Main' }],
    });
  };

  return (
    //  Fondo dinámico 
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <View style={styles.inner}>
          <View style={styles.headerContainer}>
            <Text style={[styles.brandTitle, { color: colors.primary }]}>Medical Care</Text>
            <Text style={[styles.welcomeText, { color: colors.text }]}>Bienvenido de nuevo</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: colors.subtext }]}>Correo Electrónico</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.card, 
                  color: colors.text, 
                  borderColor: colors.border 
                }]}
                placeholder="ejemplo@correo.com"
                placeholderTextColor={isDarkMode ? "#666" : "#A1A1A1"}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {emailError ? <Text style={{ color: '#FF4D4F', marginTop: 6 }}>{emailError}</Text> : null}
            </View>

            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: colors.subtext }]}>Contraseña</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.card, 
                  color: colors.text, 
                  borderColor: colors.border 
                }]}
                placeholder="********"
                placeholderTextColor={isDarkMode ? "#666" : "#A1A1A1"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
              {passwordError ? <Text style={{ color: '#FF4D4F', marginTop: 6 }}>{passwordError}</Text> : null}
            </View>

            
            <TouchableOpacity 
              style={[styles.loginButton, { backgroundColor: colors.primary, opacity: (email && password && emailRegex.test(email)) ? 1 : 0.6 }]} 
              onPress={handleLogin}
              activeOpacity={0.7}
              disabled={!(email && password && emailRegex.test(email))}
            >
              <Text style={styles.loginButtonText}>Ingresar al Sistema</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotButton} onPress={() => {
              if (!email) {
                Alert.alert('Recuperar contraseña', 'Por favor ingresa tu correo en el campo para recibir instrucciones.');
                return;
              }
              if (!emailRegex.test(email)) {
                Alert.alert('Correo inválido', 'El correo ingresado no tiene un formato válido.');
                return;
              }
              // simulación de envío
              Alert.alert('Recuperar contraseña', `Se ha enviado un enlace de recuperación a ${email}.`);
            }}>
              <Text style={[styles.forgotText, { color: colors.primary }]}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.subtext }]}>© 2026 UPQ TIID</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
      {/* "Olvidaste tu contraseña" manejado con Alert en el botón; bloque obsoleto eliminado */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  flex: { flex: 1 },
  inner: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'space-around',
  },
  headerContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    marginTop: 10,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
  },
  loginButton: {
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  forgotText: {
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: '#A1A1A1',
    fontSize: 12,
  },
});