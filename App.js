import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import 'react-native-gesture-handler';


import { ThemeProvider } from './Themecontext';

import Ajustes from "./screens/ajustes";
import Citas from "./screens/citas";
import Inicio from "./screens/inicio";
import ListaPacientes from "./screens/lista-pacientes";
import PerfilPacientes from "./screens/perfil.pacientes";

const Stack = createStackNavigator();

export default function App() {
  return (
    
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Inicio"
          screenOptions={{
            headerStyle: { backgroundColor: '#f8f9fa' }, 
            headerTintColor: '#007AFF',
          }}
        >
          <Stack.Screen 
            name="Inicio" 
            component={Inicio} 
            options={{ headerShown: false }} 
          />

          <Stack.Screen 
            name="ListaPacientes" 
            component={ListaPacientes} 
            options={{ title: 'Lista de Pacientes' }} 
          />

          <Stack.Screen 
            name="PerfilPacientes" 
            component={PerfilPacientes} 
            options={{ title: 'Perfil del Paciente' }} 
          />

          <Stack.Screen 
            name="Citas" 
            component={Citas} 
            options={{ title: 'Registro de Cita' }} 
          />

          <Stack.Screen 
            name="Ajustes" 
            component={Ajustes} 
            options={{ title: 'Ajustes' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}