export interface User {
  id: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthSession {
  id: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  active: boolean;
}

export interface AuthLog {
  id: string;
  timestamp: Date;
  type: 'login_success' | 'login_failed' | 'logout' | 'token_created' | 'token_expired' | 'ip_banned' | 'csrf_attempt' | 'xss_attempt';
  userId?: string;
  email?: string;
  ipAddress: string;
  userAgent: string;
  authMethod: 'session' | 'jwt' | 'url_token';
  details?: string;
}

export interface BannedIP {
  ip: string;
  attempts: number;
  bannedAt: Date;
  expiresAt: Date;
  reason: string;
}

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export type AuthMethod = 'session' | 'jwt' | 'url_token';
export type SecurityTest = 'brute_force' | 'csrf' | 'xss' | 'token_theft' | 'session_hijacking';