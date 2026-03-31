import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import 'react-native-gesture-handler';


import { ThemeProvider, useTheme } from './Themecontext';
import { PatientsProvider, usePatients } from './context/PatientsContext';

import Ajustes from "./screens/ajustes";
import Citas from "./screens/citas";
import Inicio from "./screens/inicio";
import ListaPacientes from "./screens/lista-pacientes";
import PerfilPaciente from "./screens/perfil.pacientes";

const Stack = createStackNavigator();

export default function App() {
  // Creamos un componente interno que consume el tema (porque ThemeProvider está arriba)
  const ThemeAwareNavigation = () => {
    const { colors } = useTheme();
    const { adminProfile, hydrated } = usePatients();

    // while we restore persisted state, avoid rendering navigation (prevents flicker)
    if (!hydrated) return null;

    const initialRoute = (adminProfile && adminProfile.email) ? 'ListaPacientes' : 'Inicio';

    return (
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName={initialRoute}
          screenOptions={{
            headerStyle: { backgroundColor: colors.card }, 
            headerTintColor: colors.primary,
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
            name="PerfilPaciente" 
            component={PerfilPaciente} 
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
    );
  };

  return (
    <ThemeProvider>
      <PatientsProvider>
        <ThemeAwareNavigation />
      </PatientsProvider>
    </ThemeProvider>
  );
}