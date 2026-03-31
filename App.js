import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';
import { View } from 'react-native';


import { ThemeProvider, useTheme } from './Themecontext';
import { PatientsProvider, usePatients } from './context/PatientsContext';
import { initNotifications } from './utils/notifications';
import navigationRef from './navigationRef';

import Ajustes from "./screens/ajustes";
import Inicio from "./screens/inicio";
import ListaPacientes from "./screens/lista-pacientes";
import PerfilPaciente from "./screens/perfil.pacientes";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  // Creamos un componente interno que consume el tema (porque ThemeProvider está arriba)
  const ThemeAwareNavigation = () => {
    const { colors } = useTheme();
    const { adminProfile, hydrated } = usePatients();

   
    if (!hydrated) return null;

    const initialRoute = (adminProfile && adminProfile.email) ? 'Main' : 'Inicio';

    const MainTabs = () => (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.primary,
          // Iconos simples: círculos que cambian de color cuando están activos
          // (se definen por pantalla en `options.tabBarIcon`)
          tabBarShowLabel: true,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.subtext,
          tabBarStyle: { backgroundColor: colors.background },
        })}
      >
        <Tab.Screen
          name="Pacientes"
          component={ListaPacientes}
          options={{ title: 'Pacientes', headerShown: false, tabBarIcon: ({ focused }) => (
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: focused ? colors.primary : colors.border }} />
          ) }}
        />
        <Tab.Screen
          name="AjustesTab"
          component={Ajustes}
          options={{ title: 'Ajustes', headerShown: false, tabBarIcon: ({ focused }) => (
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: focused ? colors.primary : colors.border }} />
          ) }}
        />
      </Tab.Navigator>
    );

    return (
      <NavigationContainer ref={navigationRef}>
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
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="PerfilPaciente"
            component={PerfilPaciente}
            options={{ title: 'Perfil del Paciente' }}
          />

          {/* Citas eliminado del flujo principal por decisión del usuario */}
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

try {
  
  initNotifications().catch(() => {});
} catch (e) {
}