import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEMO_ACCOUNT, TABS, initialEvents } from '../data/mockData';
import { supabase } from '../services/supabase';

const SESSION_KEY = 'trailconnect_session_v2';
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [sessionLoading, setSessionLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [authMode, setAuthMode] = useState('login');
  const [signupRole, setSignupRole] = useState('Joiner');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState({});
  const [loginStatus, setLoginStatus] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [activeTab, setActiveTab] = useState(TABS.HOME);
  const [events, setEvents] = useState(initialEvents);
  const [joinedEventIds, setJoinedEventIds] = useState([]);
  const [sharedEventIds, setSharedEventIds] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newTrailName, setNewTrailName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDifficulty, setNewDifficulty] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [userName, setUserName] = useState('TrailConnect User');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('Organizer');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editEmail, setEditEmail] = useState(userEmail);

  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const rawSession = await AsyncStorage.getItem(SESSION_KEY);
        if (!rawSession) return;
        const saved = JSON.parse(rawSession);
        if (!saved?.isLoggedIn) return;
        setUserName(saved.userName || 'TrailConnect User');
        setUserEmail(saved.userEmail || '');
        setUserRole(saved.userRole || 'Joiner');
        setEditName(saved.userName || 'TrailConnect User');
        setEditEmail(saved.userEmail || '');
        setIsLoggedIn(true);
        setShowLanding(false);
      } catch (error) {
        // session parse failure falls back to login
      } finally {
        setSessionLoading(false);
      }
    };
    hydrateSession();
  }, []);

  const persistSession = async (payload) => {
    await AsyncStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        isLoggedIn: true,
        ...payload,
      })
    );
  };

  const validateLogin = () => {
    const nextErrors = {};
    if (!loginEmail.trim()) {
      nextErrors.email = 'Email is required.';
    }
    if (!loginPassword.trim()) {
      nextErrors.password = 'Password is required.';
    } else if (loginPassword.trim().length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }
    setLoginErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async () => {
    setLoginStatus('');
    if (!validateLogin()) return;
    setIsLoggingIn(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      const normalizedEmail = loginEmail.trim();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: loginPassword,
      });
      if (!error && data?.user) {
        const name = data.user.user_metadata?.full_name || 'TrailConnect User';
        const role = data.user.user_metadata?.role || 'Joiner';
        const email = data.user.email || normalizedEmail;
        setUserName(name);
        setUserEmail(email);
        setUserRole(role);
        setEditName(name);
        setEditEmail(email);
        setIsLoggedIn(true);
        setShowLanding(false);
        setActiveTab(TABS.HOME);
        setLoginPassword('');
        await persistSession({ userName: name, userEmail: email, userRole: role, token: 'supabase-session' });
        return;
      }

      const isDemo =
        normalizedEmail.toLowerCase() === DEMO_ACCOUNT.email.toLowerCase() && loginPassword === DEMO_ACCOUNT.password;
      if (isDemo) {
        setUserName(DEMO_ACCOUNT.name);
        setUserEmail(DEMO_ACCOUNT.email);
        setUserRole(DEMO_ACCOUNT.role);
        setEditName(DEMO_ACCOUNT.name);
        setEditEmail(DEMO_ACCOUNT.email);
        setIsLoggedIn(true);
        setShowLanding(false);
        setActiveTab(TABS.HOME);
        setLoginPassword('');
        await persistSession({
          userName: DEMO_ACCOUNT.name,
          userEmail: DEMO_ACCOUNT.email,
          userRole: DEMO_ACCOUNT.role,
          token: 'demo-session',
        });
        return;
      }

      setLoginStatus(error?.message || 'Login failed. Please check your credentials.');
    } catch (error) {
      setLoginStatus('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignup = async () => {
    setLoginStatus('');
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setLoginStatus('Please complete name, email, and password to create an account.');
      return;
    }
    setIsLoggingIn(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail.trim(),
        password: signupPassword,
        options: {
          data: {
            full_name: signupName.trim(),
            role: signupRole,
          },
        },
      });
      if (error) {
        setLoginStatus(error.message || 'Sign up failed.');
        return;
      }
      const user = data?.user;
      const session = data?.session;
      if (user && session) {
        const name = user.user_metadata?.full_name || signupName.trim() || 'TrailConnect User';
        const role = user.user_metadata?.role || signupRole || 'Joiner';
        const email = user.email || signupEmail.trim();
        setUserName(name);
        setUserEmail(email);
        setUserRole(role);
        setEditName(name);
        setEditEmail(email);
        setIsLoggedIn(true);
        setShowLanding(false);
        setActiveTab(TABS.HOME);
        await persistSession({ userName: name, userEmail: email, userRole: role, token: 'supabase-session' });
        return;
      }
      setLoginStatus('Account created. Please check email confirmation then login.');
      setAuthMode('login');
      setShowLanding(false);
      setLoginEmail(signupEmail.trim());
      setLoginPassword('');
    } catch (error) {
      setLoginStatus('Sign up failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      // ignore supabase signout failures for local logout
    }
    await AsyncStorage.removeItem(SESSION_KEY);
    setIsLoggedIn(false);
    setShowLanding(true);
    setAuthMode('login');
    setActiveTab(TABS.HOME);
    setLoginEmail('');
    setLoginPassword('');
    setLoginErrors({});
    setLoginStatus('');
    setJoinedEventIds([]);
    setSharedEventIds([]);
  };

  const handleJoinEvent = (eventId) => {
    if (!joinedEventIds.includes(eventId)) {
      setJoinedEventIds((prev) => [...prev, eventId]);
    }
  };

  const handleShareEvent = (eventId) => {
    if (!sharedEventIds.includes(eventId)) {
      setSharedEventIds((prev) => [...prev, eventId]);
    }
  };

  const handleCreateEvent = () => {
    if (userRole !== 'Organizer') return;
    if (!newTitle.trim() || !newTrailName.trim() || !newDate.trim()) return;
    const newEvent = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      trailName: newTrailName.trim(),
      location: 'Custom Location',
      elevationMasl: null,
      difficulty: newDifficulty.trim() || 'Moderate',
      hikeType: 'Major Hike',
      daysRequired: '1-2 days',
      trailClass: 'Community-created event',
      description: newDescription.trim() || 'Community-created hiking event.',
    };
    setEvents((prev) => [newEvent, ...prev]);
    setNewTitle('');
    setNewTrailName('');
    setNewDate('');
    setNewDifficulty('');
    setNewDescription('');
    setActiveTab(TABS.HOME);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim() || !editEmail.trim()) return;
    const trimmedName = editName.trim();
    const trimmedEmail = editEmail.trim();
    setUserName(trimmedName);
    setUserEmail(trimmedEmail);
    setIsEditingProfile(false);
    if (isLoggedIn) {
      await persistSession({ userName: trimmedName, userEmail: trimmedEmail, userRole, token: 'local-session' });
    }
  };

  const value = useMemo(
    () => ({
      sessionLoading,
      isLoggedIn,
      showLanding,
      authMode,
      signupRole,
      loginEmail,
      loginPassword,
      loginErrors,
      loginStatus,
      isLoggingIn,
      signupName,
      signupEmail,
      signupPassword,
      activeTab,
      events,
      joinedEventIds,
      sharedEventIds,
      newTitle,
      newTrailName,
      newDate,
      newDifficulty,
      newDescription,
      userName,
      userEmail,
      userRole,
      isEditingProfile,
      editName,
      editEmail,
      setShowLanding,
      setAuthMode,
      setSignupRole,
      setLoginEmail,
      setLoginPassword,
      setLoginStatus,
      setSignupName,
      setSignupEmail,
      setSignupPassword,
      setActiveTab,
      setNewTitle,
      setNewTrailName,
      setNewDate,
      setNewDifficulty,
      setNewDescription,
      setIsEditingProfile,
      setEditName,
      setEditEmail,
      handleLogin,
      handleSignup,
      handleLogout,
      handleJoinEvent,
      handleShareEvent,
      handleCreateEvent,
      handleSaveProfile,
    }),
    [
      sessionLoading,
      isLoggedIn,
      showLanding,
      authMode,
      signupRole,
      loginEmail,
      loginPassword,
      loginErrors,
      loginStatus,
      isLoggingIn,
      signupName,
      signupEmail,
      signupPassword,
      activeTab,
      events,
      joinedEventIds,
      sharedEventIds,
      newTitle,
      newTrailName,
      newDate,
      newDifficulty,
      newDescription,
      userName,
      userEmail,
      userRole,
      isEditingProfile,
      editName,
      editEmail,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
