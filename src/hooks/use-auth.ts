
'use client';

import { useState, useEffect } from 'react';
import { demoUser, nurseUser, receptionistUser } from "@/lib/data";
import type { User, UserRole } from "@/lib/types";
import { useRouter } from 'next/navigation';

// This is a mock auth hook that simulates a real authentication flow.
// It uses localStorage to persist the user's role across sessions.
export function useAuth(): { user: User | null; role: UserRole | null; isLoading: boolean } {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // This code runs only on the client-side
    const storedRole = localStorage.getItem('userRole') as UserRole | null;
    
    if (storedRole) {
      setRole(storedRole);
      switch (storedRole) {
        case 'Doctor':
          setUser(demoUser);
          break;
        case 'Nurse':
          setUser(nurseUser);
          break;
        case 'Receptionist':
          setUser(receptionistUser);
          break;
        default:
          setUser(null);
      }
    } else {
        // If no role is found, they are not "logged in"
        // In a real app, you might redirect to the login page.
        // For this demo, we'll leave them unauthenticated on non-protected routes.
    }
    
    setIsLoading(false);
  }, []);

  return { user, role, isLoading };
}
