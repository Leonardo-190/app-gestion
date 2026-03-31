import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const PatientsContext = createContext();

const INITIAL = [
  { id: '1', nombre: 'Martina Zuniga', edad: 28, diagnostico: 'Control General' },
  { id: '2', nombre: 'Emilio Navarro', edad: 45, diagnostico: 'Hipertensión' },
  { id: '3', nombre: 'Sofía Valdés', edad: 32, diagnostico: 'Seguimiento Post-op' },
  { id: '4', nombre: 'Ricardo Soto', edad: 50, diagnostico: 'Diabetes Tipo 2' },
];

const PATIENTS_KEY = '@AppGestion:patients';
const ADMIN_KEY = '@AppGestion:adminProfile';

export const PatientsProvider = ({ children }) => {
  const [patients, setPatients] = useState(INITIAL);
  const [adminProfile, setAdminProfile] = useState({ name: 'Dr. Admin', email: 'admin@ejemplo.com' });


  useEffect(() => {
    (async () => {
      try {
        const p = await AsyncStorage.getItem(PATIENTS_KEY);
        if (p) setPatients(JSON.parse(p));

        const a = await AsyncStorage.getItem(ADMIN_KEY);
        if (a) setAdminProfile(JSON.parse(a));
      } catch (e) {
        console.warn('Error loading persisted data', e);
      }
    })();
  }, []);

  
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
      } catch (e) {
        console.warn('Error saving patients', e);
      }
    })();
  }, [patients]);

  
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(ADMIN_KEY, JSON.stringify(adminProfile));
      } catch (e) {
        console.warn('Error saving admin profile', e);
      }
    })();
  }, [adminProfile]);

  const addPatient = (patient) => {
    setPatients(prev => [patient, ...prev]);
  };

  const deletePatient = (id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const updatePatient = (updated) => {
    setPatients(prev => prev.map(p => (p.id === updated.id ? { ...p, ...updated } : p)));
  };

  const getPatient = (id) => patients.find(p => p.id === id);

  return (
    <PatientsContext.Provider value={{ patients, addPatient, deletePatient, updatePatient, getPatient, adminProfile, setAdminProfile }}>
      {children}
    </PatientsContext.Provider>
  );
};

export const usePatients = () => useContext(PatientsContext);

export default PatientsContext;
