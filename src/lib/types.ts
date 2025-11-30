export type UserRole = "Admin" | "Doctor" | "Nurse" | "Receptionist" | "Pharmacist" | "LabTech";

export type User = {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  clinicId: string;
  avatarUrl?: string;
};

export type Patient = {
  patientId: string;
  name: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  phone: string;
  address: string;
  primaryDoctorId: string;
  primaryDoctorName: string;
  activeAdmissionId?: string;
  consent_for_ai: boolean;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type Appointment = {
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientAvatarUrl: string;
  doctorId: string;
  doctorName: string;
  dateTime: string;
  status: "Scheduled" | "Arrived" | "Completed" | "Cancelled";
  createdBy: string;
  createdAt: string;
};

export type Bed = {
  bedId: string;
  ward: "General" | "ICU" | "Maternity";
  status: "Available" | "Occupied";
  assignedPatientId?: string;
  assignedPatientName?: string;
  assignedPatientAvatarUrl?: string;
  assignedAt?: string;
};

export type Bill = {
  billId: string;
  patientId: string;
  items: {
    service: string;
    qty: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  insuranceAdjustment: number;
  totalDue: number;
  status: "Draft" | "Finalized" | "Paid";
  generatedBy: string;
  generatedAt: string;
};

export type RecentActivity = {
  id: string;
  patientName: string;
  patientAvatarUrl: string;
  action: string;
  timestamp: string;
  actorName: string;
};

export type MonthlyVisit = {
  month: string;
  visits: number;
};
