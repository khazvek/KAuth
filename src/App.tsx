import React from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';

function App() {
  const {
    user,
    isAuthenticated,
    authMethod,
    setAuthMethod,
    authLogs,
    bannedIPs,
    login,
    logout,
    clearLogs,
    unbanIP,
    simulateSecurityTest,
    isIPBanned
  } = useAuth();

  if (!isAuthenticated) {
    return (
      <LoginForm
        onLogin={login}
        authMethod={authMethod}
        onAuthMethodChange={setAuthMethod}
        isIPBanned={isIPBanned()}
      />
    );
  }

  return (
    <Dashboard
      user={user!}
      authMethod={authMethod}
      onLogout={logout}
      onSimulateSecurityTest={simulateSecurityTest}
      authLogs={authLogs}
      bannedIPs={bannedIPs}
      onClearLogs={clearLogs}
      onUnbanIP={unbanIP}
    />
  );
}

export default App;