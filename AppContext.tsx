import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, User, AttendanceRecord, LeaveRequest } from '../types';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  getDoc
} from 'firebase/firestore';

interface AppContextType extends AppState {
  login: (email: string, password?: string) => Promise<void>;
  signup: (user: Omit<User, 'id'>, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status' | 'adminComments'>) => Promise<void>;
  updateLeaveRequestStatus: (id: string, status: LeaveRequest['status'], comments?: string) => Promise<void>;
  checkIn: (userId: string) => Promise<void>;
  checkOut: (userId: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCurrentUser({ ...docSnap.data(), id: firebaseUser.uid } as User);
          } else {
            setCurrentUser(null);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
        setUsers([]);
        setAttendanceRecords([]);
        setLeaveRequests([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const unsubs: (() => void)[] = [];

    unsubs.push(onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User)));
    }, (error) => console.error("Error fetching users:", error)));

    unsubs.push(onSnapshot(collection(db, 'attendance'), (snapshot) => {
      setAttendanceRecords(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as AttendanceRecord)));
    }, (error) => console.error("Error fetching attendance:", error)));

    unsubs.push(onSnapshot(collection(db, 'leaves'), (snapshot) => {
      setLeaveRequests(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as LeaveRequest)));
    }, (error) => console.error("Error fetching leaves:", error)));

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [currentUser]);

  const login = async (email: string, password?: string) => {
    await signInWithEmailAndPassword(auth, email, password || 'password123');
  };

  const signup = async (userData: Omit<User, 'id'>, password?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password || 'password123');
    const newUser: User = { ...userData, id: userCredential.user.uid };
    await setDoc(doc(db, 'users', newUser.id), newUser);
    setCurrentUser(newUser);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUser = async (updatedUser: User) => {
    await updateDoc(doc(db, 'users', updatedUser.id), { ...updatedUser });
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const deleteUser = async (id: string) => {
    // Note: This only deletes the Firestore document.
    // Deleting the Firebase Auth user requires Admin SDK.
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'users', id));
  };

  const addLeaveRequest = async (request: Omit<LeaveRequest, 'id' | 'status' | 'adminComments'>) => {
    const newId = `l${Date.now()}`;
    const newRequest: LeaveRequest = {
      ...request,
      id: newId,
      status: 'Pending',
    };
    await setDoc(doc(db, 'leaves', newId), newRequest);
  };

  const updateLeaveRequestStatus = async (id: string, status: LeaveRequest['status'], comments?: string) => {
    await updateDoc(doc(db, 'leaves', id), { status, adminComments: comments || '' });
  };

  const checkIn = async (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().split(' ')[0].substring(0, 5);
    
    const recordId = `${userId}_${today}`;
    const newRecord: AttendanceRecord = {
      id: recordId,
      userId,
      date: today,
      checkIn: now,
      status: 'Present',
    };
    await setDoc(doc(db, 'attendance', recordId), newRecord);
  };

  const checkOut = async (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().split(' ')[0].substring(0, 5);
    const recordId = `${userId}_${today}`;
    
    await updateDoc(doc(db, 'attendance', recordId), { checkOut: now });
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      attendanceRecords,
      leaveRequests,
      login,
      signup,
      logout,
      updateUser,
      deleteUser,
      addLeaveRequest,
      updateLeaveRequestStatus,
      checkIn,
      checkOut,
      loading
    }}>
      {!loading && children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
