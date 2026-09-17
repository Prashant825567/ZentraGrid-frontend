'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onIdTokenChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase/config';
import { authApi, projectsApi, keysApi } from '@/lib/api';
import { OwnerProfile, Project } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  profile: OwnerProfile | null;
  idToken: string | null;
  loading: boolean;
  requiresProfileCompletion: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { name: string; company?: string }) => Promise<void>;
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (proj: Project | null) => void;
  activeApiKey: string | null;
  setActiveApiKey: (key: string | null) => void;
  refreshProjects: () => Promise<void>;
  reloadProjects: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [requiresProfileCompletion, setRequiresProfileCompletion] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [activeApiKey, setActiveApiKey] = useState<string | null>(null);
  const router = useRouter();

  const loadProfileAndProjects = useCallback(async (token: string) => {
    try {
      const p = await authApi.getMe(token);
      setProfile(p);
      if (!p.name) {
        setRequiresProfileCompletion(true);
      }

      const projs = await projectsApi.list(token);
      setProjects(projs);
      if (projs.length > 0) {
        setCurrentProject((prev) => prev || projs[0]);
        // Also fetch active API key for developer endpoints
        try {
          const keys = await keysApi.list(token, projs[0].id);
          const validKey = keys.find(k => !k.revoked);
          if (validKey) {
            setActiveApiKey(validKey.key_hint);
          }
        } catch (e) {
          console.warn('Could not load active key', e);
        }
      }
    } catch (err: any) {
      console.warn('Error loading profile/projects:', err);
      if (err?.status === 403 && err?.code === 'PROFILE_INCOMPLETE') {
        setRequiresProfileCompletion(true);
      }
    }
  }, []);

  const refreshProjects = useCallback(async () => {
    if (!idToken) return;
    try {
      const projs = await projectsApi.list(idToken);
      setProjects(projs);
      if (projs.length > 0 && !currentProject) {
        setCurrentProject(projs[0]);
      }
    } catch (e) {
      console.warn('Refresh projects failed', e);
    }
  }, [idToken, currentProject]);

  useEffect(() => {
    if (!auth) {
      queueMicrotask(() => setLoading(false));
      return;
    }

    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          setIdToken(token);
          await loadProfileAndProjects(token);
        } catch (e) {
          console.warn('Error getting token:', e);
        }
      } else {
        setIdToken(null);
        setProfile(null);
        setRequiresProfileCompletion(false);
        setProjects([]);
        setCurrentProject(null);
        setActiveApiKey(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [loadProfileAndProjects]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const res = await signInWithPopup(auth, googleProvider);
      const token = await res.user.getIdToken();
      setIdToken(token);

      // Call backend POST /v1/auth/google
      const authRes = await authApi.googleLogin(token);
      setProfile(authRes.owner);

      if (authRes.requires_profile_completion || !authRes.owner?.name) {
        setRequiresProfileCompletion(true);
      } else {
        await loadProfileAndProjects(token);
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setIdToken(null);
      setProfile(null);
      router.push('/');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const updateProfile = async (data: { name: string; company?: string }) => {
    if (!idToken) throw new Error('Not authenticated');
    const updated = await authApi.updateMe(idToken, data);
    setProfile(updated);
    setRequiresProfileCompletion(false);
    await loadProfileAndProjects(idToken);
    router.push('/dashboard');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        idToken,
        loading,
        requiresProfileCompletion,
        signInWithGoogle,
        logout,
        updateProfile,
        projects,
        currentProject,
        setCurrentProject,
        activeApiKey,
        setActiveApiKey,
        refreshProjects,
        reloadProjects: refreshProjects
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
