// API Configuration and Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://m-pesa-shield-1.onrender.com/api/v1';

// Auth token management
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('scamalert_token', token);
  } else {
    localStorage.removeItem('scamalert_token');
  }
};

export const getAuthToken = () => {
  if (!authToken) {
    authToken = localStorage.getItem('scamalert_token');
  }
  return authToken;
};

// Generic fetch wrapper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> => {
  try {
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Request failed' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('API Request Error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

// Auth API
export const authAPI = {
  register: (phone: string, password: string, email?: string, name?: string) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ phone, password, email, name }),
    }),

  login: (phone: string, password: string) =>
    apiRequest<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    }),

  verifyOTP: (phone: string, otp: string) =>
    apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    }),

  getMe: () => apiRequest('/auth/me'),

  updateProfile: (data: any) =>
    apiRequest('/auth/update', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Analysis API
export const analyzeAPI = {
  analyzeSMS: (message: string, sender?: string) =>
    apiRequest<{
      quickClassification: { intent: string; confidence: number };
      fullAnalysis?: { riskScore: number; threatLevel: string; explanation: string };
      overallRisk: { score: number; level: string };
    }>('/analyze/sms', {
      method: 'POST',
      body: JSON.stringify({ message, sender }),
    }),

  checkNumber: (phoneNumber: string) =>
    apiRequest<{
      reputation: { score: number; threatLevel: string; isVerified: boolean };
      recentReports: any[];
    }>('/analyze/number', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    }),

  runScan: (messages: { content: string; sender: string }[]) =>
    apiRequest<{
      totalScanned: number;
      threatsFound: number;
      threats: any[];
      cleanMessages: number;
    }>('/analyze/scan', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    }),

  getHistory: () => apiRequest('/analyze/history'),
};

// Reports API
export const reportsAPI = {
  submit: (report: {
    phoneNumber: string;
    type: 'call' | 'sms';
    category: string;
    messageContent?: string;
  }) =>
    apiRequest('/reports', {
      method: 'POST',
      body: JSON.stringify(report),
    }),

  getReports: (filters?: { category?: string; threatLevel?: string; page?: number }) =>
    apiRequest(`/reports?${new URLSearchParams(filters as any).toString()}`),

  getTrending: () => apiRequest('/reports/trending'),

  getStats: () =>
    apiRequest<{
      totalReports: number;
      verifiedReports: number;
      totalUsers: number;
      communitySize: string;
    }>('/reports/stats'),

  vote: (reportId: string, vote: 'spam' | 'notSpam') =>
    apiRequest(`/reports/${reportId}/vote`, {
      method: 'PUT',
      body: JSON.stringify({ vote }),
    }),
};

// TrustCard API
export const trustcardAPI = {
  create: () =>
    apiRequest('/trustcard/create', { method: 'POST' }),

  getCard: () => apiRequest('/trustcard'),

  getBalance: () => apiRequest('/trustcard/balance'),

  loadFunds: (amount: number, currency: string, method: string) =>
    apiRequest('/trustcard/load', {
      method: 'POST',
      body: JSON.stringify({ amount, currency, method }),
    }),

  makePayment: (amount: number, currency: string, recipient: string) =>
    apiRequest('/trustcard/pay', {
      method: 'POST',
      body: JSON.stringify({ amount, currency, recipient }),
    }),

  getTransactions: (page?: number) =>
    apiRequest(`/trustcard/transactions?page=${page || 1}`),

  freeze: () => apiRequest('/trustcard/freeze', { method: 'POST' }),
  unfreeze: () => apiRequest('/trustcard/unfreeze', { method: 'POST' }),
};

// Blockchain API
export const blockchainAPI = {
  verify: (hash: string) => apiRequest(`/blockchain/verify/${hash}`),
  getAudit: (id: string) => apiRequest(`/blockchain/audit/${id}`),
};

export default {
  auth: authAPI,
  analyze: analyzeAPI,
  reports: reportsAPI,
  trustcard: trustcardAPI,
  blockchain: blockchainAPI,
};
