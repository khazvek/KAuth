import { useState, useEffect, useCallback } from 'react';
import { User, AuthMethod, AuthLog, BannedIP } from '../types/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authMethod, setAuthMethod] = useState<AuthMethod>('session');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLogs, setAuthLogs] = useState<AuthLog[]>([]);
  const [bannedIPs, setBannedIPs] = useState<BannedIP[]>([]);
  const [failedAttempts, setFailedAttempts] = useState<{ [key: string]: number }>({});

  // Mock IP address for demo
  const mockIP = '192.168.1.100';
  const mockUserAgent = navigator.userAgent;

  // Initialize demo data
  useEffect(() => {
    const demoUser: User = {
      id: '1',
      email: 'demo@kauth.dev',
      password: 'hashedPassword123', // In real app, this would be properly hashed
      role: 'admin',
      createdAt: new Date(),
      lastLogin: new Date()
    };

    // Load existing data from localStorage
    const savedLogs = localStorage.getItem('kauth_logs');
    const savedBannedIPs = localStorage.getItem('kauth_banned_ips');
    const savedFailedAttempts = localStorage.getItem('kauth_failed_attempts');

    if (savedLogs) {
      setAuthLogs(JSON.parse(savedLogs).map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp)
      })));
    }

    if (savedBannedIPs) {
      setBannedIPs(JSON.parse(savedBannedIPs).map((ip: any) => ({
        ...ip,
        bannedAt: new Date(ip.bannedAt),
        expiresAt: new Date(ip.expiresAt)
      })));
    }

    if (savedFailedAttempts) {
      setFailedAttempts(JSON.parse(savedFailedAttempts));
    }

    // Check if user is already authenticated
    checkAuthState();
  }, []);

  const checkAuthState = () => {
    const sessionAuth = localStorage.getItem('kauth_session');
    const jwtAuth = localStorage.getItem('kauth_jwt');
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');

    if (sessionAuth && authMethod === 'session') {
      const session = JSON.parse(sessionAuth);
      if (new Date(session.expiresAt) > new Date()) {
        setUser(session.user);
        setIsAuthenticated(true);
      }
    } else if (jwtAuth && authMethod === 'jwt') {
      try {
        const payload = JSON.parse(atob(jwtAuth.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          setUser({
            id: payload.sub,
            email: payload.email,
            role: payload.role,
            password: '',
            createdAt: new Date()
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Invalid JWT:', error);
      }
    } else if (urlToken && authMethod === 'url_token') {
      // Simulate URL token validation (insecure method for demo)
      if (urlToken === 'demo-token-123') {
        setUser({
          id: '1',
          email: 'demo@kauth.dev',
          role: 'admin',
          password: '',
          createdAt: new Date()
        });
        setIsAuthenticated(true);
      }
    }
  };

  const addLog = useCallback((log: Omit<AuthLog, 'id' | 'timestamp'>) => {
    const newLog: AuthLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...log
    };

    setAuthLogs(prev => {
      const updated = [newLog, ...prev].slice(0, 100); // Keep last 100 logs
      localStorage.setItem('kauth_logs', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isIPBanned = (ip: string): boolean => {
    const banned = bannedIPs.find(b => b.ip === ip && b.expiresAt > new Date());
    return !!banned;
  };

  const banIP = (ip: string, reason: string) => {
    const bannedIP: BannedIP = {
      ip,
      attempts: failedAttempts[ip] || 0,
      bannedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      reason
    };

    setBannedIPs(prev => {
      const updated = [...prev, bannedIP];
      localStorage.setItem('kauth_banned_ips', JSON.stringify(updated));
      return updated;
    });

    addLog({
      type: 'ip_banned',
      ipAddress: ip,
      userAgent: mockUserAgent,
      authMethod: authMethod,
      details: reason
    });
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    if (isIPBanned(mockIP)) {
      addLog({
        type: 'login_failed',
        email,
        ipAddress: mockIP,
        userAgent: mockUserAgent,
        authMethod: authMethod,
        details: 'IP banned'
      });
      return false;
    }

    // Simulate authentication (in real app, this would be server-side)
    const isValid = email === 'demo@kauth.dev' && password === 'password123';

    if (!isValid) {
      const currentAttempts = (failedAttempts[mockIP] || 0) + 1;
      setFailedAttempts(prev => {
        const updated = { ...prev, [mockIP]: currentAttempts };
        localStorage.setItem('kauth_failed_attempts', JSON.stringify(updated));
        return updated;
      });

      addLog({
        type: 'login_failed',
        email,
        ipAddress: mockIP,
        userAgent: mockUserAgent,
        authMethod: authMethod,
        details: `Failed attempt ${currentAttempts}`
      });

      // Ban IP after 3 failed attempts
      if (currentAttempts >= 3) {
        banIP(mockIP, 'Too many failed login attempts');
      }

      return false;
    }

    // Reset failed attempts on successful login
    setFailedAttempts(prev => {
      const updated = { ...prev };
      delete updated[mockIP];
      localStorage.setItem('kauth_failed_attempts', JSON.stringify(updated));
      return updated;
    });

    const demoUser: User = {
      id: '1',
      email,
      role: 'admin',
      password: '',
      createdAt: new Date(),
      lastLogin: new Date()
    };

    setUser(demoUser);
    setIsAuthenticated(true);

    // Handle different auth methods
    switch (authMethod) {
      case 'session':
        const session = {
          user: demoUser,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
        };
        localStorage.setItem('kauth_session', JSON.stringify(session));
        break;

      case 'jwt':
        const payload = {
          sub: demoUser.id,
          email: demoUser.email,
          role: demoUser.role,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour
        };
        
        // Simulate JWT (in real app, this would be server-signed)
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payloadEncoded = btoa(JSON.stringify(payload));
        const signature = btoa('mock-signature-for-demo');
        const jwt = `${header}.${payloadEncoded}.${signature}`;
        
        localStorage.setItem('kauth_jwt', jwt);
        break;

      case 'url_token':
        const token = 'demo-token-123';
        window.history.pushState({}, '', `${window.location.pathname}?token=${token}`);
        break;
    }

    addLog({
      type: 'login_success',
      userId: demoUser.id,
      email: demoUser.email,
      ipAddress: mockIP,
      userAgent: mockUserAgent,
      authMethod: authMethod
    });

    return true;
  };

  const logout = () => {
    if (user) {
      addLog({
        type: 'logout',
        userId: user.id,
        email: user.email,
        ipAddress: mockIP,
        userAgent: mockUserAgent,
        authMethod: authMethod
      });
    }

    setUser(null);
    setIsAuthenticated(false);

    // Clear auth data
    localStorage.removeItem('kauth_session');
    localStorage.removeItem('kauth_jwt');
    
    // Remove URL token
    const url = new URL(window.location.href);
    url.searchParams.delete('token');
    window.history.pushState({}, '', url.toString());
  };

  const clearLogs = () => {
    setAuthLogs([]);
    localStorage.removeItem('kauth_logs');
  };

  const unbanIP = (ip: string) => {
    setBannedIPs(prev => {
      const updated = prev.filter(b => b.ip !== ip);
      localStorage.setItem('kauth_banned_ips', JSON.stringify(updated));
      return updated;
    });
  };

  const simulateSecurityTest = (testType: string) => {
    switch (testType) {
      case 'csrf':
        addLog({
          type: 'csrf_attempt',
          ipAddress: mockIP,
          userAgent: mockUserAgent,
          authMethod: authMethod,
          details: 'CSRF attack simulation'
        });
        break;

      case 'xss':
        addLog({
          type: 'xss_attempt',
          ipAddress: mockIP,
          userAgent: mockUserAgent,
          authMethod: authMethod,
          details: 'XSS attack simulation'
        });
        break;

      case 'brute_force':
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            addLog({
              type: 'login_failed',
              email: 'attacker@evil.com',
              ipAddress: '192.168.1.999',
              userAgent: 'AttackBot/1.0',
              authMethod: authMethod,
              details: `Brute force attempt ${i + 1}`
            });
          }, i * 100);
        }
        break;
    }
  };

  return {
    user,
    isAuthenticated,
    authMethod,
    setAuthMethod,
    authLogs,
    bannedIPs,
    failedAttempts,
    login,
    logout,
    clearLogs,
    unbanIP,
    simulateSecurityTest,
    isIPBanned: () => isIPBanned(mockIP)
  };
};