
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Appointment, Bed, Bill, Patient, User } from '@/lib/types';
import { appointments as initialAppointments, patients as allPatients } from '@/lib/data';
import { BillableServices } from '@/lib/services';

const initialBeds: Bed[] = [
  {
    bedId: 'Bed 101',
    ward: 'General',
    status: 'Occupied',
    assignedPatientId: 'PID-1-2024',
    assignedPatientName: 'Aarav Sharma',
    assignedPatientAvatarUrl: 'https://picsum.photos/seed/patient1/100/100',
    assignedAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
  },
  {
    bedId: 'Bed 102',
    ward: 'General',
    status: 'Available',
  },
  {
    bedId: 'Bed 401',
    ward: 'ICU',
    status: 'Available',
  },
];

interface NewAppointmentPayload {
    patient: Patient;
    doctor: User;
    dateTime: string;
    status?: 'Scheduled' | 'Arrived';
}

interface AppContextType {
  appointments: Appointment[];
  beds: Bed[];
  dischargedPatientsForBilling: Patient[];
  billedPatients: Bill[];
  transferAppointment: (appointmentId: string, newDoctor: User) => void;
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => void;
  addAppointment: (payload: NewAppointmentPayload) => void;
  addBed: (ward: 'General' | 'ICU' | 'Maternity') => void;
  assignPatientToBed: (bedId: string, patient: Patient) => void;
  dischargePatientFromBed: (bedId: string) => void;
  generateBillForPatient: (patientId: string, billDetails: Omit<Bill, 'billId' | 'status' | 'generatedAt' | 'generatedBy'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getInitialState = <T,>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') {
        return fallback;
    }
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (error) {
        console.error(`Error reading from localStorage for key "${key}":`, error);
        return fallback;
    }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(() => getInitialState('appointments', initialAppointments));
  const [beds, setBeds] = useState<Bed[]>(() => getInitialState('beds', initialBeds));
  const [dischargedPatientsForBilling, setDischargedPatientsForBilling] = useState<Patient[]>(() => getInitialState('dischargedPatients', []));
  const [billedPatients, setBilledPatients] = useState<Bill[]>(() => getInitialState('billedPatients', []));

  useEffect(() => {
    try {
        window.localStorage.setItem('appointments', JSON.stringify(appointments));
    } catch (error) {
        console.error("Failed to save appointments to localStorage:", error);
    }
  }, [appointments]);
  
  useEffect(() => {
    try {
        window.localStorage.setItem('beds', JSON.stringify(beds));
    } catch (error) {
        console.error("Failed to save beds to localStorage:", error);
    }
  }, [beds]);

  useEffect(() => {
    try {
        window.localStorage.setItem('dischargedPatients', JSON.stringify(dischargedPatientsForBilling));
    } catch (error) {
        console.error("Failed to save discharged patients to localStorage:", error);
    }
  }, [dischargedPatientsForBilling]);

  useEffect(() => {
    try {
        window.localStorage.setItem('billedPatients', JSON.stringify(billedPatients));
    } catch (error) {
        console.error("Failed to save billed patients to localStorage:", error);
    }
  }, [billedPatients]);


  const transferAppointment = (appointmentId: string, newDoctor: User) => {
    setAppointments(prev =>
      prev.map(app =>
        app.appointmentId === appointmentId
          ? { ...app, doctorId: newDoctor.uid, doctorName: newDoctor.name }
          : app
      )
    );
  };

  const updateAppointmentStatus = (appointmentId: string, status: Appointment['status']) => {
    setAppointments(prev =>
        prev.map(app =>
            app.appointmentId === appointmentId ? { ...app, status } : app
        )
    );
  };
  
  const addAppointment = ({ patient, doctor, dateTime, status = 'Scheduled' }: NewAppointmentPayload) => {
    const newAppointment: Appointment = {
        appointmentId: `APP-${Date.now()}`,
        patientId: patient.patientId,
        patientName: patient.name,
        patientAvatarUrl: patient.avatarUrl,
        doctorId: doctor.uid,
        doctorName: doctor.name,
        dateTime,
        status,
        createdBy: 'rec1', // Hardcoded for demo
        createdAt: new Date().toISOString(),
    };
    setAppointments(prev => [...prev, newAppointment]);
  };
  
  const addBed = (ward: 'General' | 'ICU' | 'Maternity') => {
    const newBedId = `Bed ${Math.floor(Math.random() * 900) + 100}`;
    const newBed: Bed = {
      bedId: newBedId,
      ward: ward,
      status: 'Available',
    };
    setBeds(prev => [...prev, newBed]);
  };

  const assignPatientToBed = (bedId: string, patient: Patient) => {
    setBeds(prev =>
      prev.map(b =>
        b.bedId === bedId
          ? {
              ...b,
              status: 'Occupied',
              assignedPatientId: patient.patientId,
              assignedPatientName: patient.name,
              assignedPatientAvatarUrl: patient.avatarUrl,
              assignedAt: new Date().toISOString(),
            }
          : b
      )
    );
  };

  const dischargePatientFromBed = (bedId: string) => {
    const bedToDischarge = beds.find(b => b.bedId === bedId);
    if (bedToDischarge && bedToDischarge.assignedPatientId) {
        const patientToBill = allPatients.find(p => p.patientId === bedToDischarge.assignedPatientId);
        if (patientToBill && !dischargedPatientsForBilling.find(p => p.patientId === patientToBill.patientId)) {
            setDischargedPatientsForBilling(prev => [...prev, patientToBill]);
        }
    }

    setBeds(prev =>
      prev.map(b =>
        b.bedId === bedId
          ? {
              ...b,
              status: 'Available',
              assignedPatientId: undefined,
              assignedPatientName: undefined,
              assignedPatientAvatarUrl: undefined,
              assignedAt: undefined,
            }
          : b
      )
    );
  };

  const generateBillForPatient = (patientId: string, billDetails: Omit<Bill, 'billId' | 'status' | 'generatedAt' | 'generatedBy'>) => {
    const patient = dischargedPatientsForBilling.find(p => p.patientId === patientId);
    if (!patient) return;

    const newBill: Bill = {
        ...billDetails,
        billId: `INV-${patient.patientId.slice(4, 8)}-${new Date().getFullYear()}`,
        patientName: patient.name,
        status: 'Paid',
        generatedAt: new Date().toISOString(),
        generatedBy: 'rec1' // Hardcoded for demo
    }

    setBilledPatients(prev => [newBill, ...prev]);
    setDischargedPatientsForBilling(prev => prev.filter(p => p.patientId !== patientId));
  }


  const value = {
    appointments,
    beds,
    dischargedPatientsForBilling,
    billedPatients,
    transferAppointment,
    updateAppointmentStatus,
    addAppointment,
    addBed,
    assignPatientToBed,
    dischargePatientFromBed,
    generateBillForPatient,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
