'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onIdTokenChanged 
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase/config';
import { authApi, projectsApi, keysApi } from '@/lib/api';
import { OwnerProfile, Project } from '@/lib/types';
import { useRouter } from 'next/navigation';

export interface AppUser {
  email: string;
  displayName?: string;
  uid?: string;
  photoURL?: string;
}

const AUTH_TOKEN_KEY = 'zentragrid_auth_token';
const DEMO_AUTH_KEY = 'zentragrid_demo_auth';
const DEMO_TOKEN = 'zentra_demo_dev_architect_token_99';

interface AuthContextType {
  user: User | AppUser | null;
  profile: OwnerProfile | null;
  idToken: string | null;
  loading: boolean;
  requiresProfileCompletion: boolean;
  isFirebaseConfigured: boolean;
  loginWithToken: (token: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithDemo: () => Promise<void>;
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
  const [user, setUser] = useState<User | AppUser | null>(null);
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
      // 1. GET /v1/auth/me
      const p = await authApi.getMe(token);
      setProfile(p);
      if (!p.name) {
        setRequiresProfileCompletion(true);
      }

      // 2. GET /v1/projects
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
      throw err;
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

  // Direct login using Bearer Token (Firebase ID Token) against backend POST /v1/auth/google
  const loginWithToken = useCallback(async (token: string) => {
    const trimmedToken = token.trim();
    if (!trimmedToken) throw new Error('Authentication token is required');

    setLoading(true);
    try {
      // Hits backend POST /v1/auth/google with Authorization: Bearer <token>
      const authRes = await authApi.googleLogin(trimmedToken);
      
      localStorage.setItem(AUTH_TOKEN_KEY, trimmedToken);
      localStorage.removeItem(DEMO_AUTH_KEY);

      setIdToken(trimmedToken);
      setProfile(authRes.owner);
      setUser({
        email: authRes.owner.email,
        displayName: authRes.owner.name || 'ZentraGrid Architect'
      });

      if (authRes.requires_profile_completion || !authRes.owner?.name) {
        setRequiresProfileCompletion(true);
      } else {
        await loadProfileAndProjects(trimmedToken);
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Backend authentication error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadProfileAndProjects, router]);

  // Demo Sandbox Access for local evaluation
  const signInWithDemo = useCallback(async () => {
    setLoading(true);
    try {
      localStorage.setItem(DEMO_AUTH_KEY, 'true');
      localStorage.removeItem(AUTH_TOKEN_KEY);

      const demoOwner: OwnerProfile = {
        id: 'usr_owner_demo_architect',
        email: 'alex.chen@zentragrid.dev',
        name: 'Alex Chen',
        company: 'Zentra Grid Labs',
        created_at: new Date().toISOString()
      };

      setUser({
        email: demoOwner.email,
        displayName: demoOwner.name
      });
      setIdToken(DEMO_TOKEN);
      setProfile(demoOwner);
      setRequiresProfileCompletion(false);

      try {
        await loadProfileAndProjects(DEMO_TOKEN);
      } catch (e) {
        console.warn('Using local fallback for demo projects', e);
      }

      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [loadProfileAndProjects, router]);

  // Continue with Google
  const signInWithGoogle = async () => {
    // If Firebase Client is configured with real credentials, perform Google Popup
    if (auth && isFirebaseConfigured) {
      try {
        setLoading(true);
        const res = await signInWithPopup(auth, googleProvider);
        const token = await res.user.getIdToken();
        await loginWithToken(token);
      } catch (err: any) {
        console.error('Google Sign In Error:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      // If client Firebase variables are omitted (backend has all server config)
      // Provide instant developer sandbox fallback
      await signInWithDemo();
    }
  };

  // Restore session on mount
  useEffect(() => {
    let isCancelled = false;

    const restoreSession = async () => {
      // 1. Check for real backend token
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
      if (storedToken) {
        try {
          setIdToken(storedToken);
          const p = await authApi.getMe(storedToken);
          if (!isCancelled) {
            setProfile(p);
            setUser({ email: p.email, displayName: p.name });
            if (!p.name) setRequiresProfileCompletion(true);
            await loadProfileAndProjects(storedToken);
          }
        } catch (e) {
          console.warn('Session token expired or invalid, clearing:', e);
          if (!isCancelled) {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            setIdToken(null);
            setProfile(null);
            setUser(null);
          }
        } finally {
          if (!isCancelled) setLoading(false);
        }
        return;
      }

      // 2. Check for demo session
      const isDemo = typeof window !== 'undefined' ? localStorage.getItem(DEMO_AUTH_KEY) === 'true' : false;
      if (isDemo) {
        const demoOwner: OwnerProfile = {
          id: 'usr_owner_demo_architect',
          email: 'alex.chen@zentragrid.dev',
          name: 'Alex Chen',
          company: 'Zentra Grid Labs',
          created_at: new Date().toISOString()
        };
        setUser({ email: demoOwner.email, displayName: demoOwner.name });
        setIdToken(DEMO_TOKEN);
        setProfile(demoOwner);
        loadProfileAndProjects(DEMO_TOKEN)
          .catch((e) => console.warn('Demo session projects load notice', e))
          .finally(() => {
            if (!isCancelled) setLoading(false);
          });
        return;
      }

      // 3. Optional: Firebase listener if auth client is initialized
      if (auth && isFirebaseConfigured) {
        const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
          if (isCancelled) return;
          if (firebaseUser) {
            setUser(firebaseUser);
            try {
              const token = await firebaseUser.getIdToken();
              setIdToken(token);
              await loadProfileAndProjects(token);
            } catch (e) {
              console.warn('Error getting token:', e);
            }
          }
          setLoading(false);
        });
        return () => unsubscribe();
      }

      if (!isCancelled) {
        setLoading(false);
      }
    };

    restoreSession();

    return () => {
      isCancelled = true;
    };
  }, [loadProfileAndProjects]);

  const logout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(DEMO_AUTH_KEY);
      }
      if (auth) {
        await firebaseSignOut(auth).catch(() => {});
      }
      setUser(null);
      setIdToken(null);
      setProfile(null);
      setRequiresProfileCompletion(false);
      setProjects([]);
      setCurrentProject(null);
      setActiveApiKey(null);
      router.push('/');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  // PATCH /v1/auth/me: Naam + company bharna (first signup)
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
        isFirebaseConfigured,
        loginWithToken,
        signInWithGoogle,
        signInWithDemo,
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
