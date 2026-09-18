'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  type User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { api, type OwnerPublic, ApiError } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  owner: OwnerPublic | null;
  profile: OwnerPublic | null;
  loading: boolean;
  isSandbox: boolean;
  requiresProfileCompletion: boolean;
  projects: any[];
  currentProject: any | null;
  setCurrentProject: (project: any) => void;
  reloadProjects: () => Promise<void>;
  signIn: () => Promise<void>;
  signInWithSandbox: (name?: string, company?: string) => Promise<void>;
  signInWithToken: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: (forceRefresh?: boolean) => Promise<string | null>;
  updateProfile: (data: { name: string; company?: string }) => Promise<OwnerPublic>;
  refreshOwner: () => Promise<OwnerPublic | null>;
  executeWithAuth: <T>(operation: (token: string) => Promise<T>) => Promise<T>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [owner, setOwner] = useState<OwnerPublic | null>(null);
  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const mode = localStorage.getItem('zg_auth_mode');
    if (mode === 'sandbox' || mode === 'token') return true;
    return Boolean(auth);
  });
  const [isSandbox, setIsSandbox] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('zg_auth_mode') === 'sandbox';
    }
    return false;
  });
  const [requiresProfileCompletion, setRequiresProfileCompletion] = useState<boolean>(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [currentProject, setCurrentProject] = useState<any | null>(null);

  // Helper to retrieve fresh token from Firebase Web SDK or sandbox/custom token
  const getIdToken = useCallback(async (forceRefresh = false): Promise<string | null> => {
    if (typeof window !== 'undefined') {
      const mode = localStorage.getItem('zg_auth_mode');
      if (mode === 'sandbox') {
        return 'sandbox_token_founder';
      }
      if (mode === 'token') {
        return localStorage.getItem('zg_custom_token');
      }
    }
    if (isSandbox) {
      return 'sandbox_token_founder';
    }
    const currentUser = auth?.currentUser;
    if (!currentUser) return null;
    return await currentUser.getIdToken(forceRefresh);
  }, [isSandbox]);

  const signOut = useCallback(async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('zg_auth_mode');
        localStorage.removeItem('zg_custom_token');
      }
      if (auth) {
        await firebaseSignOut(auth);
      }
    } catch (err) {
      console.warn('Sign out error:', err);
    } finally {
      setIsSandbox(false);
      setUser(null);
      setOwner(null);
      setRequiresProfileCompletion(false);
    }
  }, []);

  // Universal executor: executes API call, and on 401 force-refreshes token once.
  // If still fails with 401, signs out and redirects.
  const executeWithAuth = useCallback(
    async <T,>(operation: (token: string) => Promise<T>): Promise<T> => {
      const token = await getIdToken(false);
      if (!token) {
        throw new ApiError(401, 'UNAUTHENTICATED', 'No active user session');
      }

      try {
        return await operation(token);
      } catch (err) {
        if (err instanceof ApiError && (err.status === 401 || err.code === 'INVALID_ID_TOKEN')) {
          // Attempt force token refresh once
          console.warn('401 detected from backend. Forcing token refresh...');
          const freshToken = await getIdToken(true);
          if (freshToken) {
            try {
              return await operation(freshToken);
            } catch (retryErr) {
              if (retryErr instanceof ApiError && (retryErr.status === 401 || retryErr.code === 'INVALID_ID_TOKEN')) {
                console.error('Session expired or invalidated by backend. Signing out.');
                await signOut();
              }
              throw retryErr;
            }
          } else {
            await signOut();
            throw err;
          }
        }
        throw err;
      }
    },
    [getIdToken, signOut]
  );

  // Synchronize owner profile from backend
  const refreshOwner = useCallback(async (): Promise<OwnerPublic | null> => {
    try {
      const p = await executeWithAuth(async (token) => api.auth.getMe(token));
      setOwner(p);
      setRequiresProfileCompletion(!p.profile_completed || !p.name);
      return p;
    } catch (err) {
      if (err instanceof ApiError && err.code === 'PROFILE_INCOMPLETE') {
        setRequiresProfileCompletion(true);
      }
      return null;
    }
  }, [executeWithAuth]);

  // Click "Continue with Google"
  const signIn = useCallback(async () => {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized yet. Please check network connection and try again.');
    }
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      
      // Hit backend POST /v1/auth/google
      const authRes = await api.auth.google(token, {});
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('zg_auth_mode', 'firebase');
      }
      setIsSandbox(false);
      setOwner(authRes.owner);
      setUser(result.user);

      if (authRes.requires_profile_completion || !authRes.owner.profile_completed || !authRes.owner.name) {
        setRequiresProfileCompletion(true);
      } else {
        setRequiresProfileCompletion(false);
        try {
          const list = await api.projects.list(token);
          const projs = list.projects || [];
          setProjects(projs);
          if (projs.length > 0) {
            setCurrentProject(projs[0]);
          }
        } catch (e) {
          console.warn('Projects auto-load on signin failed:', e);
        }
      }
    } catch (err) {
      console.error('Sign in error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 1-Click Instant Sandbox Sign-In
  const signInWithSandbox = useCallback(async (name?: string, company?: string) => {
    setLoading(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('zg_auth_mode', 'sandbox');
      }
      setIsSandbox(true);
      const authRes = await api.auth.google('sandbox_token_founder', { name, company });
      
      const mockUser = {
        uid: authRes.owner.owner_id,
        email: authRes.owner.email,
        displayName: authRes.owner.name || 'Dev Founder',
        photoURL: authRes.owner.picture,
        getIdToken: async () => 'sandbox_token_founder',
      } as unknown as User;

      setUser(mockUser);
      setOwner(authRes.owner);
      setRequiresProfileCompletion(!authRes.owner.profile_completed || !authRes.owner.name);
    } catch (err) {
      console.error('Sandbox sign in error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign In with raw Firebase ID token (directly hitting live POST /v1/auth/google)
  const signInWithToken = useCallback(async (customToken: string) => {
    if (!customToken.trim()) {
      throw new Error('Please enter a valid Firebase ID token.');
    }
    setLoading(true);
    try {
      const authRes = await api.auth.google(customToken.trim(), {});
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('zg_auth_mode', 'token');
        localStorage.setItem('zg_custom_token', customToken.trim());
      }
      setIsSandbox(false);

      const mockUser = {
        uid: authRes.owner.owner_id,
        email: authRes.owner.email,
        displayName: authRes.owner.name || authRes.owner.email,
        photoURL: authRes.owner.picture,
        getIdToken: async () => customToken.trim(),
      } as unknown as User;

      setUser(mockUser);
      setOwner(authRes.owner);
      setRequiresProfileCompletion(authRes.requires_profile_completion || !authRes.owner.profile_completed || !authRes.owner.name);
    } catch (err) {
      console.error('Custom token sign in failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update profile via PATCH /v1/auth/me
  const updateProfile = useCallback(
    async (data: { name: string; company?: string }): Promise<OwnerPublic> => {
      const updated = await executeWithAuth(async (token) => api.auth.updateMe(token, data));
      setOwner(updated);
      if (updated.profile_completed && updated.name) {
        setRequiresProfileCompletion(false);
      }
      try {
        const list = await executeWithAuth(async (token) => api.projects.list(token));
        const projs = list.projects || [];
        setProjects(projs);
        if (projs.length > 0) {
          setCurrentProject(projs[0]);
        }
      } catch (e) {
        console.warn('Projects reload after profile update failed:', e);
      }
      return updated;
    },
    [executeWithAuth]
  );

  // Restore session automatically on page load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mode = localStorage.getItem('zg_auth_mode');
      if (mode === 'sandbox') {
        api.auth
          .google('sandbox_token_founder', {})
          .then((authRes) => {
            const mockUser = {
              uid: authRes.owner.owner_id,
              email: authRes.owner.email,
              displayName: authRes.owner.name || 'Dev Founder',
              photoURL: authRes.owner.picture,
              getIdToken: async () => 'sandbox_token_founder',
            } as unknown as User;
            setIsSandbox(true);
            setUser(mockUser);
            setOwner(authRes.owner);
            setRequiresProfileCompletion(!authRes.owner.profile_completed || !authRes.owner.name);
          })
          .catch((e) => console.warn('Failed restoring sandbox:', e))
          .finally(() => setLoading(false));
        return;
      }

      if (mode === 'token') {
        const storedToken = localStorage.getItem('zg_custom_token');
        if (storedToken) {
          api.auth
            .getMe(storedToken)
            .then((ownerData) => {
              const mockUser = {
                uid: ownerData.owner_id,
                email: ownerData.email,
                displayName: ownerData.name || ownerData.email,
                photoURL: ownerData.picture,
                getIdToken: async () => storedToken,
              } as unknown as User;
              setIsSandbox(false);
              setUser(mockUser);
              setOwner(ownerData);
              setRequiresProfileCompletion(!ownerData.profile_completed || !ownerData.name);
            })
            .catch(async () => {
              await signOut();
            })
            .finally(() => setLoading(false));
          return;
        }
      }
    }

    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsSandbox(false);
        try {
          const token = await firebaseUser.getIdToken();
          // Verify with backend POST /v1/auth/google
          const authRes = await api.auth.google(token, {});
          setOwner(authRes.owner);
          if (authRes.requires_profile_completion || !authRes.owner.profile_completed || !authRes.owner.name) {
            setRequiresProfileCompletion(true);
          } else {
            setRequiresProfileCompletion(false);
            try {
              const list = await api.projects.list(token);
              const projs = list.projects || [];
              setProjects(projs);
              if (projs.length > 0) {
                setCurrentProject(projs[0]);
              }
            } catch (e) {
              console.warn('Projects auto-load on session restore failed:', e);
            }
          }
        } catch (err) {
          console.warn('Failed to verify token on page load:', err);
          if (err instanceof ApiError && err.code === 'PROFILE_INCOMPLETE') {
            setRequiresProfileCompletion(true);
          } else if (err instanceof ApiError && err.status === 401) {
            await signOut();
          }
        }
      } else {
        setUser(null);
        setOwner(null);
        setRequiresProfileCompletion(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [signOut]);

  const reloadProjects = useCallback(async () => {
    try {
      const list = await executeWithAuth(async (token) => api.projects.list(token));
      setProjects(list.projects || []);
      if (list.projects && list.projects.length > 0 && !currentProject) {
        setCurrentProject(list.projects[0]);
      }
    } catch (e) {
      console.warn('Could not reload projects:', e);
    }
  }, [executeWithAuth, currentProject]);

  return (
    <AuthContext.Provider
      value={{
        user,
        owner,
        profile: owner,
        loading,
        isSandbox,
        requiresProfileCompletion,
        projects,
        currentProject,
        setCurrentProject,
        reloadProjects,
        signIn,
        signInWithSandbox,
        signInWithToken,
        signOut,
        logout: signOut,
        getIdToken,
        updateProfile,
        refreshOwner,
        executeWithAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
