
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Appointment, Bed, Patient, User } from '@/lib/types';
import { appointments as initialAppointments, patients as allPatients } from '@/lib/data';

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
  transferAppointment: (appointmentId: string, newDoctor: User) => void;
  addAppointment: (payload: NewAppointmentPayload) => void;
  addBed: (ward: 'General' | 'ICU' | 'Maternity') => void;
  assignPatientToBed: (bedId: string, patient: Patient) => void;
  dischargePatientFromBed: (bedId: string) => void;
  generateBillForPatient: (patientId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [beds, setBeds] = useState<Bed[]>(initialBeds);
  const [dischargedPatientsForBilling, setDischargedPatientsForBilling] = useState<Patient[]>([]);

  const transferAppointment = (appointmentId: string, newDoctor: User) => {
    setAppointments(prev =>
      prev.map(app =>
        app.appointmentId === appointmentId
          ? { ...app, doctorId: newDoctor.uid, doctorName: newDoctor.name }
          : app
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
        if (patientToBill) {
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

  const generateBillForPatient = (patientId: string) => {
    setDischargedPatientsForBilling(prev => prev.filter(p => p.patientId !== patientId));
  }


  const value = {
    appointments,
    beds,
    dischargedPatientsForBilling,
    transferAppointment,
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
