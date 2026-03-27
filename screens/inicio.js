import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    SafeAreaView, 
    KeyboardAvoidingView, 
    Platform,
    ScrollView
} from 'react-native';

export default function Inicio({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    
                    <View style={styles.header}>
                        <Text style={styles.welcomeText}>Bienvenido</Text>
                        <Text style={styles.subtitle}>Gestión de Citas Médicas</Text>
                    </View>

                    <View style={styles.form}>
                        {/* Campo de Correo Electrónico */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Correo Electrónico</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="ejemplo@correo.com"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Campo de Contraseña */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Contraseña</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="********" 
                                placeholderTextColor="#999"
                                secureTextEntry={true} 
                            />
                        </View>

                        {/* Botón de Iniciar Sesión */}
                        <TouchableOpacity 
                            style={styles.button} 
                            onPress={() => navigation.navigate('ListaPacientes')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>Iniciar Sesión</Text>
                        </TouchableOpacity>

                        {/* Enlaces de "Olvidé mi contraseña" y "Crear cuenta" */}
                        <TouchableOpacity style={styles.linkContainer}>
                            <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.linkContainer}>
                            <Text style={styles.createAccountText}>
                                ¿No tienes cuenta? <Text style={{ fontWeight: 'bold' }}>Regístrate</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        height: 55,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#F9FAFB',
        color: '#000',
    },
    button: {
        backgroundColor: '#007AFF', 
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        color: '#007AFF',
        fontSize: 14,
    },
    createAccountText: {
        color: '#666',
        fontSize: 14,
    }
});
