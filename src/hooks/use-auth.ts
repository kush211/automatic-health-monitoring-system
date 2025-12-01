
'use client';

import { demoUser, nurseUser, receptionistUser } from "@/lib/data";
import type { User, UserRole } from "@/lib/types";

// This is a mock auth hook.
// In a real app, you would implement actual authentication logic here.
export function useAuth(): { user: User | null; role: UserRole | null; isLoading: boolean } {
  // For demonstration purposes, we'll hardcode the role.
  // You can change this to 'Doctor', 'Nurse' or other roles to test different views.
  const role: UserRole = 'Receptionist'; 
  
  let user: User;
  if (role === 'Doctor') {
    user = demoUser;
  } else if (role === 'Nurse') {
    user = nurseUser;
  } else {
    user = receptionistUser;
  }

  return { user, role, isLoading: false };
}
