

'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Appointment, Bed, Bill, Patient, User, AppSettings, BillItem } from '@/lib/types';
import { initialPatients, doctors, appointments as initialAppointments } from '@/lib/data';
import { useUser, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc, writeBatch, getDocs, onSnapshot, query, orderBy, getDoc, addDoc, getFirestore } from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';
import { useToast } from './use-toast';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { BillableServices } from '@/lib/services';
import { differenceInDays } from 'date-fns';
import { getApp, getApps } from 'firebase/app';


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
  bedsLoading: boolean;
  bedsError: Error | null;
  patients: Patient[];
  dischargedPatientsForBilling: Patient[];
  billedPatients: Bill[];
  settings: AppSettings;
  transferAppointment: (appointmentId: string, newDoctor: User) => void;
  updateAppointmentStatus: (appointmentId?: string, status?: Appointment['status']) => void;
  addAppointment: (payload: NewAppointmentPayload) => void;
  addPatient: (payload: NewPatientPayload) => void;
  addBed: (ward: 'General' | 'ICU' | 'Maternity') => void;
  assignPatientToBed: (bedId: string, patient: Patient) => void;
  dischargePatientFromBed: (bedId: string) => void;
  generateBillForPatient: (patientId: string, billDetails: { subtotal: number; insuranceAdjustment: number; totalDue: number; items: BillItem[] }) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  clearAllData: () => void;
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
  const { firestore } = useFirebase();
  const { user: authUser } = useUser();
  const { toast } = useToast();

  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  
  const [beds, setBeds] = useState<Bed[]>([]);
  const [bedsLoading, setBedsLoading] = useState(true);
  const [bedsError, setBedsError] = useState<Error | null>(null);

  useEffect(() => {
    if (!firestore) return;

    const bedsRef = collection(firestore, "beds");
    const q = query(bedsRef, orderBy("bedId")); 
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Bed[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Bed));
        setBeds(data);
        setBedsLoading(false);
        setBedsError(null);
      },
      (error) => {
        console.error("Beds onSnapshot error:", error);
        setBedsError(error);
        setBedsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore]);


  useEffect(() => {
    if (authUser && firestore) {
      const patientsUnsub = onSnapshot(collection(firestore, 'patients'), (snapshot) => {
        setPatients(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as Patient)));
      });
      const appointmentsUnsub = onSnapshot(collection(firestore, 'appointments'), (snapshot) => {
        setAppointments(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Appointment)));
      });

      return () => {
        patientsUnsub();
        appointmentsUnsub();
      }
    }
  }, [authUser, firestore]);

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

    // utility to get firestore instance safely
    function getFirestoreSafe() {
        try {
        // if you initialized Firebase elsewhere, prefer getApp() usage
        const app = getApps().length ? getApp() : undefined;
        if (!app) {
            console.warn("Firebase app not initialized - getFirestoreSafe returning undefined");
            return undefined;
        }
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return getFirestore(app);
        } catch (err) {
        console.error("Failed to get Firestore instance:", err);
        return undefined;
        }
    }

  const transferAppointment = async (appointmentId: string, newDoctor: User) => {
    if (!firestore) return;

    const appointment = appointments.find(
      a => a.id === appointmentId || a.appointmentId === appointmentId
    );

    if (!appointment) {
      console.error("transferAppointment: Appointment not found:", appointmentId);
      return;
    }
    
    const firestoreDocId = appointment.id;
    if (!firestoreDocId) {
      console.error("transferAppointment: Missing Firestore doc id:", appointment);
      return;
    }

    const appointmentRef = doc(firestore, "appointments", firestoreDocId);

    await updateDoc(appointmentRef, {
      doctorId: newDoctor.uid,
      doctorName: newDoctor.name,
    });
  };

  const updateAppointmentStatus = async (appointmentId?: string, status?: Appointment['status']) => {
    try {
        if (!appointmentId) {
          console.warn("updateAppointmentStatus called without appointmentId");
          return;
        }
        if (!status) {
          console.warn("updateAppointmentStatus called without status");
          return;
        }
        // find appointment in local state - adapt field name to your structure
        // some projects use `id` as doc id, others `appointmentId` — check which one your data has
        const appointment = appointments.find(a => a.id === appointmentId || a.appointmentId === appointmentId);
        if (!appointment) {
          console.warn("No appointment found for id:", appointmentId, "search used id and appointmentId fields");
          return;
        }
    
        // safe firestore instance
        const firestore = getFirestoreSafe();
        if (!firestore) {
          console.error("Firestore instance unavailable. Aborting update.");
          return;
        }
    
        // pick the correct doc id for Firestore:
        // prefer document id (appointment.id) if present, else fallback to appointment.appointmentId
        const docId = appointment.id ?? appointment.appointmentId;
        if (!docId) {
          console.error("No document id available on appointment:", appointment);
          return;
        }
    
        const appointmentRef = doc(firestore, "appointments", String(docId));
        await updateDoc(appointmentRef, { status });
        // optionally update local state (optimistic)
        setAppointments(prev => prev.map(a => (a.id === appointment.id || a.appointmentId === appointment.id) ? { ...a, status } : a));
      } catch (err) {
        console.error("updateAppointmentStatus error:", err);
      }
  };
  
  const addAppointment = ({ patient, doctor, dateTime, status = 'Scheduled' }: NewAppointmentPayload) => {
    if (!firestore) return;
    const appointmentsCollection = collection(firestore, 'appointments');
    addDocumentNonBlocking(appointmentsCollection, {
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
  
  const addPatient = (payload: NewPatientPayload) => {
    if (!firestore) return;
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
    addDocumentNonBlocking(patientsCollection, newPatientData);
  };

  const addBed = (ward: 'General' | 'ICU' | 'Maternity') => {
    if (!firestore) return;
    const newBedId = `Bed ${Math.floor(Math.random() * 900) + 100}`;
    const newBedData = {
      bedId: newBedId,
      ward: ward,
      status: 'Available',
    };
    const bedsCollection = collection(firestore, 'beds');
    addDocumentNonBlocking(bedsCollection, newBedData);
  };

  const assignPatientToBed = (bedId: string, patient: Patient) => {
    if (!firestore) return;
    const bed = beds.find(b => b.id === bedId);
    if (!bed) return;
    const bedRef = doc(firestore, 'beds', bed.id);
    updateDoc(bedRef, {
        status: 'Occupied',
        assignedPatientId: patient.patientId,
        assignedPatientName: patient.name,
        assignedPatientAvatarUrl: patient.avatarUrl,
        assignedAt: new Date().toISOString(),
    });
  };

  const dischargePatientFromBed = async (bedId: string) => {
    if (!firestore) return;
    const bedToDischarge = beds.find(b => b.id === bedId);
    if (!bedToDischarge || !bedToDischarge.assignedPatientId || !bedToDischarge.assignedAt) return;

    // Log billable services before clearing bed
    const admissionDate = new Date(bedToDischarge.assignedAt);
    const dischargeDate = new Date();
    const daysAdmitted = Math.max(differenceInDays(dischargeDate, admissionDate), 1);
    
    const serviceCode = bedToDischarge.ward === 'ICU' ? 'icu_stay' : 'general_stay';

    const billableServicesRef = collection(firestore, 'patients', bedToDischarge.assignedPatientId, 'billable_services');
    await addDoc(billableServicesRef, {
        patientId: bedToDischarge.assignedPatientId,
        serviceCode: serviceCode,
        quantity: daysAdmitted,
        recordedBy: authUser?.uid || 'system',
        recordedAt: new Date().toISOString(),
    });

    const patientToBill = patients.find(p => p.patientId === bedToDischarge.assignedPatientId);
    if (patientToBill && !dischargedPatientsForBilling.find(p => p.patientId === patientToBill.patientId)) {
        setDischargedPatientsForBilling(prev => [...prev, patientToBill]);
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

  const generateBillForPatient = (patientId: string, billDetails: { subtotal: number; insuranceAdjustment: number; totalDue: number; items: BillItem[] }) => {
    const patient = dischargedPatientsForBilling.find(p => p.patientId === patientId);
    if (!patient) return;
    
    const newBill: Bill = {
        id: `INV-${patient.patientId.slice(4, 8)}-${Date.now()}`,
        billId: `INV-${patient.patientId.slice(4, 8)}-${Date.now()}`,
        patientId: patient.patientId,
        patientName: patient.name,
        items: billDetails.items,
        subtotal: billDetails.subtotal,
        insuranceAdjustment: billDetails.insuranceAdjustment,
        totalDue: billDetails.totalDue,
        status: 'Paid',
        generatedBy: authUser?.uid || 'rec1',
        generatedAt: new Date().toISOString(),
    }

    setBilledPatients(prev => [newBill, ...prev]);
    setDischargedPatientsForBilling(prev => prev.filter(p => p.patientId !== patientId));
    
    toast({
        title: "Bill Finalized",
        description: `The final bill for ${patient.name} has been generated.`,
    });
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }
  
  const clearAllData = async () => {
    if (!firestore) return;
    toast({ title: "Clearing Data...", description: "Removing all data from Firestore collections and local storage." });
    try {
        const collectionsToDelete = ['patients', 'appointments', 'beds'];
        const batch = writeBatch(firestore);

        for (const collectionName of collectionsToDelete) {
            const collectionRef = collection(firestore, collectionName);
            const snapshot = await getDocs(collectionRef);
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
        }
        
        await batch.commit();

        // Clear local state as well
        window.localStorage.removeItem('dischargedPatients');
        window.localStorage.removeItem('billedPatients');
        window.localStorage.removeItem('appSettings');
        window.localStorage.removeItem('seedingComplete');
        setDischargedPatientsForBilling([]);
        setBilledPatients([]);
        setSettings(initialSettings);
        
        toast({ title: "Data Cleared Successfully", description: "Please refresh the page to see the changes." });
        // Force a reload to reset all component states
        window.location.reload();

    } catch (error) {
        console.error("Error clearing data:", error);
        toast({ title: "Error Clearing Data", description: "Could not clear all data. See console for details.", variant: 'destructive' });
    }
  };


  const value = {
    appointments,
    beds,
    bedsLoading,
    bedsError,
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
