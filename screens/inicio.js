import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView,KeyboardAvoidingView, Platform, Alert, StatusBar, SafeAreaViewComponent } from 'react-native'
export default function Inicio({ navigation }) { //Manejo de estados de punto React Hooks
const [email, setEmail] = React.useState('');
const [password, setPassword] = React.useState('');

//Funcion que valida los botones
const handleLogin = () => {
    if (!email || !password) {
        Alert.alert('Error', 'Por favor, complete todos los campos');
        return;
    }
    // si pasa la navegacion avanza a la siguiente pantalla
    navigation.navigate('Lista de Pacientes');
};
return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <View style={styles.inner}>
          {/* Header con Jerarquía Visual */}
          <View style={styles.headerContainer}>
            <Text style={styles.brandTitle}>GEAR Medical</Text>
            <Text style={styles.welcomeText}>Bienvenido de nuevo</Text>
          </View>

          {/* Formulario con Accesibilidad */}
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Correo Electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder="ejemplo@correo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="********"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
            </View>

            {/* Botón Principal (Feedback Visual) */}
            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLogin}
              activeOpacity={0.7}
            >
              <Text style={styles.loginButtonText}>Ingresar al Sistema</Text>
            </TouchableOpacity>

            {/* Navegación Secundaria */}
            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2026 GEAR Systems</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    // Solución al SafeArea en Android
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
    color: '#007AFF',
    letterSpacing: 2,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
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
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
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
    color: '#007AFF',
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
