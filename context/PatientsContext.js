import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { scheduleNotification, cancelNotification } from '../utils/notifications';

const PatientsContext = createContext();

const INITIAL = [
  { id: '1', nombre: 'Martina Zuniga', edad: 28, diagnostico: 'Control General', notas: [], signos: [], citas: [] },
  { id: '2', nombre: 'Emilio Navarro', edad: 45, diagnostico: 'Hipertensión', notas: [], signos: [], citas: [] },
  { id: '3', nombre: 'Sofía Valdés', edad: 32, diagnostico: 'Seguimiento Post-op', notas: [], signos: [], citas: [] },
  { id: '4', nombre: 'Ricardo Soto', edad: 50, diagnostico: 'Diabetes Tipo 2', notas: [], signos: [], citas: [] },
];

const PATIENTS_KEY = '@AppGestion:patients';
const ADMIN_KEY = '@AppGestion:adminProfile';

export const PatientsProvider = ({ children }) => {
  const [patients, setPatients] = useState(INITIAL);
  const [adminProfile, setAdminProfile] = useState({ name: '', email: '' });
  const [hydrated, setHydrated] = useState(false);


  useEffect(() => {
    (async () => {
      try {
        const p = await AsyncStorage.getItem(PATIENTS_KEY);
        if (p) setPatients(JSON.parse(p));

        const a = await AsyncStorage.getItem(ADMIN_KEY);
        if (a) setAdminProfile(JSON.parse(a));
        
        // marcar como cargado (hydrated) después de intentar restaurar
        setHydrated(true);
      } catch (e) {
        console.warn('Error al cargar datos persistidos', e);
        setHydrated(true);
      }
    })();
  }, []);

  
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
      } catch (e) {
        console.warn('Error al guardar pacientes', e);
      }
    })();
  }, [patients]);

  
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(ADMIN_KEY, JSON.stringify(adminProfile));
      } catch (e) {
        console.warn('Error al guardar perfil admin', e);
      }
    })();
  }, [adminProfile]);

  const addPatient = (patient) => {
    const withDefaults = { ...patient, notas: patient.notas || [], signos: patient.signos || [], citas: patient.citas || [] };
    setPatients(prev => [withDefaults, ...prev]);
  };

  const deletePatient = (id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const updatePatient = (updated) => {
    setPatients(prev => prev.map(p => (p.id === updated.id ? { ...p, ...updated } : p)));
  };

  const getPatient = (id) => patients.find(p => p.id === id);

  const addAppointment = async (patientId, appointment) => {
    
    const id = appointment.id || Date.now().toString();
    const newAppointment = { ...appointment, id, notificationId: null };
   
    try {
      if (appointment.date) {
        const notifId = await scheduleNotification({
          title: `Cita: ${appointment.title || 'Consulta'}`,
          body: appointment.description || `Cita con paciente`,
          date: new Date(appointment.date),
        });
        newAppointment.notificationId = notifId;
      }
    } catch (e) {
      console.warn('Error', e);
    }
    setPatients(prev => prev.map(p => {
      if (p.id !== patientId) return p;
      const citas = [newAppointment, ...(p.citas || [])];
      return { ...p, citas };
    }));
  };

  const updateAppointment = async (patientId, appointment) => {
    setPatients(prev => prev.map(p => {
      if (p.id !== patientId) return p;
      const citas = (p.citas || []).map(c => c.id === appointment.id ? { ...c, ...appointment } : c);
      return { ...p, citas };
    }));
    try {
      const patient = getPatient(patientId);
      const existing = (patient?.citas || []).find(c => c.id === appointment.id);
      if (existing && existing.notificationId) {
        await cancelNotification(existing.notificationId);
      }
      if (appointment.date) {
        const notifId = await scheduleNotification({
          title: `Cita: ${appointment.title || 'Consulta'}`,
          body: appointment.description || `Cita con paciente`,
          date: new Date(appointment.date),
        });
        setPatients(prev => prev.map(p => {
          if (p.id !== patientId) return p;
          const citas = (p.citas || []).map(c => c.id === appointment.id ? { ...c, notificationId: notifId } : c);
          return { ...p, citas };
        }));
      }
    } catch (e) {
      console.warn('Error n', e);
    }
  };

  const deleteAppointment = async (patientId, appointmentId) => {
    try {
      const patient = getPatient(patientId);
      const toDelete = (patient?.citas || []).find(c => c.id === appointmentId);
      if (toDelete && toDelete.notificationId) {
        await cancelNotification(toDelete.notificationId);
      }
    } catch (e) {
      console.warn('Error ', e);
    }
    setPatients(prev => prev.map(p => {
      if (p.id !== patientId) return p;
      const citas = (p.citas || []).filter(c => c.id !== appointmentId);
      return { ...p, citas };
    }));
  };

  const logout = async () => {
    try {
     
    } catch (e) {
      console.warn('Error durante el cierre de sesión', e);
    }
  };

  return (
    <PatientsContext.Provider value={{
      patients,
      addPatient,
      deletePatient,
      updatePatient,
      getPatient,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      adminProfile,
      setAdminProfile,
      logout,
      hydrated
    }}>
      {children}
    </PatientsContext.Provider>
  );
};

export const usePatients = () => useContext(PatientsContext);

export default PatientsContext;
