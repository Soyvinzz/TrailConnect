import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { DEMO_ACCOUNT } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import { styles } from '../styles/appStyles';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';

export default function AuthScreen() {
  const {
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
    setShowLanding,
    setAuthMode,
    setSignupRole,
    setLoginEmail,
    setLoginPassword,
    setLoginStatus,
    setSignupName,
    setSignupEmail,
    setSignupPassword,
    handleLogin,
    handleSignup,
  } = useAppContext();

  if (showLanding) {
    return (
      <View style={styles.appContainer}>
        <View style={styles.loginContainer}>
          <Text style={styles.appTitle}>TrailConnect</Text>
          <Text style={styles.landingSubtitle}>
            Your gateway to curated hiking events, trusted organizers, and scenic trails.
          </Text>
          <Text style={styles.landingBody}>
            Discover new routes, join community hikes, or organize your own adventure. Stay safe, prepared, and
            connected with fellow hikers on every trail.
          </Text>
          <CustomButton label="Continue to Login" onPress={() => setShowLanding(false)} />
        </View>
      </View>
    );
  }

  if (authMode === 'signup') {
    return (
      <View style={styles.appContainer}>
        <View style={styles.loginContainer}>
          <Text style={styles.appTitle}>TrailConnect</Text>
          <Text style={styles.appSubtitle}>Sign up as {signupRole}</Text>

          <View style={styles.loginForm}>
            <CustomInput label="Full Name" placeholder="Your full name" value={signupName} onChangeText={setSignupName} />
            <CustomInput
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={signupEmail}
              onChangeText={setSignupEmail}
            />
            <CustomInput
              label="Password"
              placeholder="Create a password"
              secureTextEntry
              value={signupPassword}
              onChangeText={setSignupPassword}
            />

            {!!loginStatus && <Text style={styles.statusText}>{loginStatus}</Text>}

            <CustomButton label={isLoggingIn ? 'Creating...' : 'Create Account'} onPress={handleSignup} disabled={isLoggingIn} />

            <CustomButton
              label="Back to Login"
              variant="secondary"
              onPress={() => {
                setAuthMode('login');
                setSignupName('');
                setSignupEmail('');
                setSignupPassword('');
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.appContainer}>
      <View style={styles.loginContainer}>
        <Text style={styles.appTitle}>TrailConnect</Text>
        <Text style={styles.appSubtitle}>Discover trails. Join hiking events. Connect with nature.</Text>
        <View style={styles.loginForm}>
          <CustomInput
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={loginEmail}
            onChangeText={(value) => {
              setLoginEmail(value);
              setLoginStatus('');
            }}
            error={loginErrors.email}
          />
          <CustomInput
            label="Password"
            placeholder="Your password"
            secureTextEntry
            value={loginPassword}
            onChangeText={(value) => {
              setLoginPassword(value);
              setLoginStatus('');
            }}
            error={loginErrors.password}
          />

          <View style={styles.demoInlineBox}>
            <Text style={styles.demoTitle}>Demo account (fallback)</Text>
            <Text style={styles.demoText}>Email: {DEMO_ACCOUNT.email}</Text>
            <Text style={styles.demoText}>Password: {DEMO_ACCOUNT.password}</Text>
            <CustomButton
              label="Use Demo Account"
              onPress={() => {
                setLoginEmail(DEMO_ACCOUNT.email);
                setLoginPassword(DEMO_ACCOUNT.password);
                setLoginStatus('');
              }}
              extraStyle={styles.demoFillButton}
            />
          </View>

          {!!loginStatus && <Text style={styles.statusText}>{loginStatus}</Text>}

          <CustomButton label={isLoggingIn ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={isLoggingIn} />
          {isLoggingIn && <ActivityIndicator size="small" color="#22c55e" style={{ marginTop: 10 }} />}

          <Text style={styles.orText}>Or sign up as</Text>
          <View style={styles.signupButtonsRow}>
            <CustomButton
              label="Joiner"
              onPress={() => {
                setAuthMode('signup');
                setSignupRole('Joiner');
              }}
              extraStyle={styles.signupButton}
            />
            <CustomButton
              label="Organizer"
              onPress={() => {
                setAuthMode('signup');
                setSignupRole('Organizer');
              }}
              extraStyle={styles.signupButton}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
