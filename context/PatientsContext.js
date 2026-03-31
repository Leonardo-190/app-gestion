import { createContext, useContext, useState } from 'react';

const PatientsContext = createContext();

const INITIAL = [
  { id: '1', nombre: 'Martina Zuniga', edad: 28, diagnostico: 'Control General' },
  { id: '2', nombre: 'Emilio Navarro', edad: 45, diagnostico: 'Hipertensión' },
  { id: '3', nombre: 'Sofía Valdés', edad: 32, diagnostico: 'Seguimiento Post-op' },
  { id: '4', nombre: 'Ricardo Soto', edad: 50, diagnostico: 'Diabetes Tipo 2' },
];

export const PatientsProvider = ({ children }) => {
  const [patients, setPatients] = useState(INITIAL);

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
    <PatientsContext.Provider value={{ patients, addPatient, deletePatient, updatePatient, getPatient }}>
      {children}
    </PatientsContext.Provider>
  );
};

export const usePatients = () => useContext(PatientsContext);

export default PatientsContext;
