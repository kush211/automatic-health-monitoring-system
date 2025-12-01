
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Appointment, Bed, Bill, Patient, User, AppSettings } from '@/lib/types';
import { initialPatients, doctors, appointments as initialAppointments, allUsers, kpiData, recentActivities } from '@/lib/data';
import { useCollection, useUser, useMemoFirebase } from '@/firebase';
import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';
import { useToast } from './use-toast';

interface NewAppointmentPayload {
    patient: Patient;
    doctor: User;
    dateTime: string;
    status?: 'Scheduled' | 'Arrived';
}

interface NewPatientPayload {
    name: string;
    dob: string;
    gender: 'Male' | 'Female' | 'Other';
    phone: string;
    address: string;
    primaryDoctorId: string;
}

const initialSettings: AppSettings = {
    aiRiskAnalysisEnabled: true,
    aiPatientSummaryEnabled: true,
};

interface AppContextType {
  appointments: Appointment[];
  beds: Bed[];
  patients: Patient[];
  dischargedPatientsForBilling: Patient[];
  billedPatients: Bill[];
  settings: AppSettings;
  transferAppointment: (appointmentId: string, newDoctor: User) => void;
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => void;
  addAppointment: (payload: NewAppointmentPayload) => void;
  addPatient: (payload: NewPatientPayload) => void;
  addBed: (ward: 'General' | 'ICU' | 'Maternity') => void;
  assignPatientToBed: (bedId: string, patient: Patient) => void;
  dischargePatientFromBed: (bedId: string) => void;
  generateBillForPatient: (patientId: string, billDetails: Omit<Bill, 'id' | 'billId' | 'status' | 'generatedAt' | 'generatedBy'>) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  clearAllData: () => void;
  DataSeeder: () => void;
  isSeeding: boolean;
  isSeedingComplete: boolean;
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

const useDataSeeder = () => {
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [isSeeding, setIsSeeding] = useState(false);
    const [isSeedingComplete, setIsSeedingComplete] = useState(false);

    const seedDatabase = useCallback(async () => {
        if (isSeeding || isSeedingComplete) return;

        setIsSeeding(true);
        toast({ title: "Database Seeding Started", description: "Populating Firestore with initial data..." });

        try {
            const batch = writeBatch(firestore);

            // Seed Patients
            const patientsCollection = collection(firestore, 'patients');
            initialPatients.forEach(patient => {
                const docRef = doc(patientsCollection);
                batch.set(docRef, patient);
            });

            // Seed Appointments
            const appointmentsCollection = collection(firestore, 'appointments');
            initialAppointments.forEach(appointment => {
                const docRef = doc(appointmentsCollection);
                batch.set(docRef, appointment);
            });

            // Seed Users
            const usersCollection = collection(firestore, 'users');
            allUsers.forEach(user => {
                const docRef = doc(usersCollection, user.uid); // Use UID as doc ID
                batch.set(docRef, user);
            });
            
            // Seed Beds (Create some initial beds)
            const bedsCollection = collection(firestore, 'beds');
            const wards = ['General', 'ICU', 'Maternity'];
            let bedCounter = 1;
            wards.forEach(ward => {
                for(let i=0; i< (ward === 'ICU' ? 5 : 10); i++) {
                    const bedId = `${ward.charAt(0)}-${100+bedCounter++}`;
                    const docRef = doc(bedsCollection);
                    batch.set(docRef, { bedId, ward, status: 'Available' });
                }
            });


            await batch.commit();

            toast({ title: "Database Seeding Successful", description: "Firestore has been populated." });
            setIsSeedingComplete(true);
        } catch (error) {
            console.error("Error seeding database:", error);
            toast({ title: "Seeding Failed", description: "Could not write initial data to Firestore. Check console and security rules.", variant: 'destructive' });
        } finally {
            setIsSeeding(false);
        }
    }, [firestore, isSeeding, isSeedingComplete, toast]);

    return { DataSeeder: seedDatabase, isSeeding, isSeedingComplete };
};


export function AppProvider({ children }: { children: ReactNode }) {
  const { firestore } = useFirebase();
  const { user: authUser, isUserLoading } = useUser();
  const { DataSeeder, isSeeding, isSeedingComplete } = useDataSeeder();

  // Conditionally create refs only when user is logged in
  const patientsRef = useMemoFirebase(() => authUser ? collection(firestore, 'patients') : null, [firestore, authUser]);
  const { data: patientsData, isLoading: isPatientsLoading } = useCollection<Patient>(patientsRef);

  const appointmentsRef = useMemoFirebase(() => authUser ? collection(firestore, 'appointments') : null, [firestore, authUser]);
  const { data: appointmentsData, isLoading: isAppointmentsLoading } = useCollection<Appointment>(appointmentsRef);
  
  const bedsRef = useMemoFirebase(() => authUser ? collection(firestore, 'beds') : null, [firestore, authUser]);
  const { data: bedsData, isLoading: isBedsLoading } = useCollection<Bed>(bedsRef);

  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [beds, setBeds] = useState<Bed[]>([]);


  useEffect(() => {
    if (patientsData) setPatients(patientsData);
  }, [patientsData]);

  useEffect(() => {
    if (appointmentsData) setAppointments(appointmentsData);
  }, [appointmentsData]);
  
  useEffect(() => {
    if (bedsData) setBeds(bedsData);
  }, [bedsData]);


  const [dischargedPatientsForBilling, setDischargedPatientsForBilling] = useState<Patient[]>(() => getInitialState('dischargedPatients', []));
  const [billedPatients, setBilledPatients] = useState<Bill[]>(() => getInitialState('billedPatients', []));
  const [settings, setSettings] = useState<AppSettings>(() => getInitialState('appSettings', initialSettings));

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

  useEffect(() => {
    try {
        window.localStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
        console.error("Failed to save settings to localStorage:", error);
    }
  }, [settings]);

  const transferAppointment = async (appointmentId: string, newDoctor: User) => {
    const appointmentRef = doc(firestore, 'appointments', appointmentId);
    await updateDoc(appointmentRef, {
        doctorId: newDoctor.uid,
        doctorName: newDoctor.name,
    });
  };

  const updateAppointmentStatus = async (appointmentId: string, status: Appointment['status']) => {
    const appointmentRef = doc(firestore, 'appointments', appointmentId);
    await updateDoc(appointmentRef, { status });
  };
  
  const addAppointment = async ({ patient, doctor, dateTime, status = 'Scheduled' }: NewAppointmentPayload) => {
    const appointmentsCollection = collection(firestore, 'appointments');
    await addDoc(appointmentsCollection, {
        patientId: patient.patientId,
        patientName: patient.name,
        patientAvatarUrl: patient.avatarUrl,
        doctorId: doctor.uid,
        doctorName: doctor.name,
        dateTime,
        status,
        createdBy: 'rec1', // Hardcoded for demo
        createdAt: new Date().toISOString(),
    });
  };
  
  const addPatient = async (payload: NewPatientPayload) => {
    const newPatientId = `PID-${patients.length + 1}-${new Date().getFullYear()}`;
    const primaryDoctor = doctors.find(d => d.uid === payload.primaryDoctorId);
    const newPatientData = {
        ...payload,
        id: newPatientId, // Use the same ID for firestore doc
        patientId: newPatientId,
        primaryDoctorName: primaryDoctor?.name || 'Unassigned',
        avatarUrl: `https://picsum.photos/seed/${newPatientId}/100/100`,
        consent_for_ai: true, // Defaulting to true for demo purposes
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const patientsCollection = collection(firestore, 'patients');
    await addDoc(patientsCollection, newPatientData);
  };

  const addBed = async (ward: 'General' | 'ICU' | 'Maternity') => {
    const newBedId = `Bed ${Math.floor(Math.random() * 900) + 100}`;
    const newBedData = {
      bedId: newBedId,
      ward: ward,
      status: 'Available',
    };
    const bedsCollection = collection(firestore, 'beds');
    await addDoc(bedsCollection, newBedData);
  };

  const assignPatientToBed = async (bedId: string, patient: Patient) => {
    const bed = beds.find(b => b.id === bedId);
    if (!bed) return;
    const bedRef = doc(firestore, 'beds', bed.id);
    await updateDoc(bedRef, {
        status: 'Occupied',
        assignedPatientId: patient.patientId,
        assignedPatientName: patient.name,
        assignedPatientAvatarUrl: patient.avatarUrl,
        assignedAt: new Date().toISOString(),
    });
  };

  const dischargePatientFromBed = (bedId: string) => {
    const bedToDischarge = beds.find(b => b.id === bedId);
    if (bedToDischarge && bedToDischarge.assignedPatientId) {
        const patientToBill = patients.find(p => p.patientId === bedToDischarge.assignedPatientId);
        if (patientToBill && !dischargedPatientsForBilling.find(p => p.patientId === patientToBill.patientId)) {
            setDischargedPatientsForBilling(prev => [...prev, patientToBill]);
        }
    }

    const bedRef = doc(firestore, 'beds', bedId);
    updateDoc(bedRef, {
        status: 'Available',
        assignedPatientId: null,
        assignedPatientName: null,
        assignedPatientAvatarUrl: null,
        assignedAt: null,
    });
  };

  const generateBillForPatient = (patientId: string, billDetails: Omit<Bill, 'id' | 'billId' | 'status' | 'generatedAt' | 'generatedBy'>) => {
    const patient = dischargedPatientsForBilling.find(p => p.patientId === patientId);
    if (!patient) return;

    const newBill: any = {
        ...billDetails,
        patientName: patient.name,
        status: 'Paid',
        generatedAt: new Date().toISOString(),
        generatedBy: 'rec1' // Hardcoded for demo
    }

    setBilledPatients(prev => [newBill, ...prev]);
    setDischargedPatientsForBilling(prev => prev.filter(p => p.patientId !== patientId));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }
  
  const clearAllData = () => {
    // This is a dangerous operation. In a real app, this would be heavily protected.
    // For the demo, we will clear collections.
    console.log("Clearing data is not fully implemented for Firestore yet. It will only clear local state.");
    window.localStorage.removeItem('dischargedPatients');
    window.localStorage.removeItem('billedPatients');
    window.localStorage.removeItem('appSettings');
    setDischargedPatientsForBilling([]);
    setBilledPatients([]);
    setSettings(initialSettings);
    // To clear firestore, you would need to delete documents one by one.
    // This is a complex operation and is omitted for this demo.
  };


  const value = {
    appointments,
    beds,
    patients,
    dischargedPatientsForBilling,
    billedPatients,
    settings,
    transferAppointment,
    updateAppointmentStatus,
    addAppointment,
    addPatient,
    addBed,
    assignPatientToBed,
    dischargePatientFromBed,
    generateBillForPatient,
    updateSettings,
    clearAllData,
    DataSeeder,
    isSeeding,
    isSeedingComplete,
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
