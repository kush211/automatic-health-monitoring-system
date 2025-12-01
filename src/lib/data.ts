
import { Patient, User, Appointment, RecentActivity, MonthlyVisit } from "./types";

export const demoUser: User = {
  uid: 'doc1',
  name: "Dr. Priya Sharma",
  email: "priya.sharma@example.com",
  role: "Doctor",
  clinicId: "clinic123",
  avatarUrl: "https://picsum.photos/seed/doc1/100/100",
};

export const nurseUser: User = {
    uid: 'nurse1',
    name: 'Sameer Kumar',
    email: 'sameer.kumar@example.com',
    role: 'Nurse',
    clinicId: 'clinic123',
    avatarUrl: 'https://picsum.photos/seed/nurse1/100/100',
};

export const allUsers: User[] = [
    demoUser,
    {
      uid: 'doc2',
      name: 'Dr. Vikram Reddy',
      email: 'vikram.reddy@example.com',
      role: 'Doctor',
      clinicId: 'clinic123',
      avatarUrl: 'https://picsum.photos/seed/doc2/100/100',
    },
    {
      uid: 'doc3',
      name: 'Dr. Sunita Desai',
      email: 'sunita.desai@example.com',
      role: 'Doctor',
      clinicId: 'clinic123',
      avatarUrl: 'https://picsum.photos/seed/doc3/100/100',
    },
    nurseUser,
];


export const doctors: User[] = allUsers.filter(u => u.role === 'Doctor');

export const patients: Patient[] = [
  {
    patientId: "PID-1-2024",
    name: "Aarav Sharma",
    dob: "1988-07-21",
    gender: "Male",
    phone: "+91-9876543210",
    address: "12, Gandhi Nagar, Jaipur, Rajasthan",
    primaryDoctorId: "doc1",
    primaryDoctorName: "Dr. Anjali Sharma",
    consent_for_ai: true,
    avatarUrl: "https://picsum.photos/seed/patient1/100/100",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-05-20T14:30:00Z",
  },
  {
    patientId: "PID-2-2024",
    name: "Priya Singh",
    dob: "1992-11-22",
    gender: "Female",
    phone: "9876543211",
    address: "456, Park Avenue, Mumbai",
    primaryDoctorId: "doc1",
    primaryDoctorName: "Dr. Anjali Sharma",
    consent_for_ai: false,
    avatarUrl: "https://picsum.photos/seed/patient2/100/100",
    createdAt: "2024-02-15T11:00:00Z",
    updatedAt: "2024-05-21T09:00:00Z",
  },
  {
    patientId: 'PID-3-2024',
    name: 'Rohan Mehta',
    dob: '1978-03-12',
    gender: 'Male',
    phone: '9123456789',
    address: '789 Tech Park, Bangalore',
    primaryDoctorId: 'doc2',
    primaryDoctorName: 'Dr. Vikram Reddy',
    consent_for_ai: true,
    avatarUrl: 'https://picsum.photos/seed/patient3/100/100',
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-05-19T18:00:00Z',
  },
  {
    patientId: 'PID-4-2024',
    name: 'Sunita Gupta',
    dob: '2001-07-30',
    gender: 'Female',
    phone: '9988776655',
    address: '101 Rose Gardens, Pune',
    primaryDoctorId: 'doc1',
    primaryDoctorName: 'Dr. Anjali Sharma',
    consent_for_ai: true,
    avatarUrl: 'https://picsum.photos/seed/patient4/100/100',
    createdAt: '2024-04-20T16:20:00Z',
    updatedAt: '2024-05-22T11:45:00Z',
  },
  {
    patientId: 'PID-5-2024',
    name: "Amit Kumar",
    dob: "1985-05-15",
    gender: "Male",
    phone: "9876543210",
    address: "123, Main Street, Delhi",
    primaryDoctorId: "doc1",
    primaryDoctorName: "Dr. Anjali Sharma",
    consent_for_ai: true,
    avatarUrl: "https://picsum.photos/seed/patient5/100/100",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-05-20T14:30:00Z",
  },
];

export const appointments: Appointment[] = [
  {
    appointmentId: "APP-1",
    patientId: "PID-1-2024",
    patientName: "Aarav Sharma",
    patientAvatarUrl: "https://picsum.photos/seed/patient1/100/100",
    doctorId: "doc1",
    doctorName: "Dr. Priya Sharma",
    dateTime: "2024-07-28T10:00:00Z",
    status: "Scheduled",
    createdBy: "receptionist1",
    createdAt: "2024-07-20T10:00:00Z",
  },
  {
    appointmentId: "APP-2",
    patientId: "PID-2-2024",
    patientName: "Priya Singh",
    patientAvatarUrl: "https://picsum.photos/seed/patient2/100/100",
    doctorId: "doc1",
    doctorName: "Dr. Priya Sharma",
    dateTime: "2024-07-28T11:00:00Z",
    status: "Scheduled",
    createdBy: "receptionist1",
    createdAt: "2024-07-20T11:00:00Z",
  },
   {
    appointmentId: "APP-3",
    patientId: "PID-3-2024",
    patientName: "Rohan Mehta",
    patientAvatarUrl: "https://picsum.photos/seed/patient3/100/100",
    doctorId: "doc2",
    doctorName: "Dr. Vikram Reddy",
    dateTime: "2024-07-28T12:00:00Z",
    status: "Completed",
    createdBy: "receptionist1",
    createdAt: "2024-07-20T12:00:00Z",
  },
  {
    appointmentId: "APP-4",
    patientId: "PID-4-2024",
    patientName: "Sunita Gupta",
    patientAvatarUrl: "https://picsum.photos/seed/patient4/100/100",
    doctorId: "doc1",
    doctorName: "Dr. Priya Sharma",
    dateTime: "2024-07-28T14:00:00Z",
    status: "Scheduled",
    createdBy: "receptionist1",
    createdAt: "2024-07-20T14:00:00Z",
  },
];

export const recentActivities: RecentActivity[] = [
    {
        id: "1",
        patientName: "Sunita Gupta",
        patientAvatarUrl: 'https://picsum.photos/seed/patient4/100/100',
        action: "Lab report uploaded",
        timestamp: "10 min ago",
        actorName: "LabTech"
    },
    {
        id: "2",
        patientName: "Rohan Mehta",
        patientAvatarUrl: 'https://picsum.photos/seed/patient3/100/100',
        action: "Vitals updated",
        timestamp: "1 hour ago",
        actorName: "Nurse"
    },
    {
        id: "3",
        patientName: "Priya Singh",
        patientAvatarUrl: 'https://picsum.photos/seed/patient2/100/100',
        action: "Discharged",
        timestamp: "3 hours ago",
        actorName: "Dr. A. Sharma"
    },
    {
        id: "4",
        patientName: "Aarav Sharma",
        patientAvatarUrl: 'https://picsum.photos/seed/patient1/100/100',
        action: "New prescription added",
        timestamp: "Yesterday",
        actorName: "Dr. A. Sharma"
    }
]

export const monthlyVisits: MonthlyVisit[] = [
    { month: 'Jan', visits: 186 },
    { month: 'Feb', visits: 205 },
    { month: 'Mar', visits: 237 },
    { month: 'Apr', visits: 203 },
    { month: 'May', visits: 259 },
    { month: 'Jun', visits: 280 },
    { month: 'Jul', visits: 322 },
    { month: 'Aug', visits: 290 },
    { month: 'Sep', visits: 250 },
    { month: 'Oct', visits: 210 },
    { month: 'Nov', visits: 260 },
    { month: 'Dec', visits: 290 },
]

export const kpiData = {
    totalPatients: { value: "1,254", change: "+12.5%" },
    visitsThisMonth: { value: "322", change: "-2.1%" },
    bedOccupancy: { value: "75%", change: "+5%" },
    commonDiagnosis: { value: "Hypertension", change: "" },
}

    
