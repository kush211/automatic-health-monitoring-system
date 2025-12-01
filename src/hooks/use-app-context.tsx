
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Appointment, Bed, Patient, User } from '@/lib/types';
import { appointments as initialAppointments } from '@/lib/data';

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

interface AppContextType {
  appointments: Appointment[];
  beds: Bed[];
  transferAppointment: (appointmentId: string, newDoctor: User) => void;
  addBed: (ward: 'General' | 'ICU' | 'Maternity') => void;
  assignPatientToBed: (bedId: string, patient: Patient) => void;
  dischargePatientFromBed: (bedId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [beds, setBeds] = useState<Bed[]>(initialBeds);

  const transferAppointment = (appointmentId: string, newDoctor: User) => {
    setAppointments(prev =>
      prev.map(app =>
        app.appointmentId === appointmentId
          ? { ...app, doctorId: newDoctor.uid, doctorName: newDoctor.name }
          : app
      )
    );
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


  const value = {
    appointments,
    beds,
    transferAppointment,
    addBed,
    assignPatientToBed,
    dischargePatientFromBed,
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
