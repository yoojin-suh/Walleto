// API client for backend communication

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiError {
  detail: string | Array<{ loc: string[]; msg: string; type: string }>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('walleto_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as ApiError;

      // Handle different error formats
      let errorMessage = 'Something went wrong';

      if (typeof error.detail === 'string') {
        errorMessage = error.detail;
      } else if (Array.isArray(error.detail)) {
        // FastAPI validation errors
        errorMessage = error.detail.map(err => err.msg).join(', ');
      }

      throw new Error(errorMessage);
    }

    return data as T;
  }

  async signUp(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) {
    return this.request<{ access_token: string; token_type: string }>(
      '/api/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      }
    );
  }

  async signIn(credentials: { email: string; password: string }) {
    return this.request<{ access_token: string; token_type: string }>(
      '/api/auth/signin',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );
  }

  async getCurrentUser() {
    return this.request<{
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      username: string | null;
      nickname: string | null;
      profile_picture: string | null;
      birthdate: string | null;
      secondary_email: string | null;
      phone_number: string | null;
      street: string | null;
      city: string | null;
      state: string | null;
      zip_code: string | null;
      country: string | null;
      onboarding_completed: boolean;
      is_active: boolean;
      created_at: string;
    }>('/api/auth/me');
  }

  async updateProfile(data: {
    username?: string;
    nickname?: string;
    profile_picture?: string;
    birthdate?: string;
    secondary_email?: string;
    phone_number?: string;
    street?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
    onboarding_completed?: boolean;
  }) {
    return this.request<{
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      username: string | null;
      nickname: string | null;
      profile_picture: string | null;
      birthdate: string | null;
      secondary_email: string | null;
      phone_number: string | null;
      street: string | null;
      city: string | null;
      state: string | null;
      zip_code: string | null;
      country: string | null;
      onboarding_completed: boolean;
      is_active: boolean;
      created_at: string;
    }>('/api/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // OTP-based authentication methods

  async requestSignupOTP(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) {
    return this.request<{ message: string }>('/api/auth/signup/request-otp', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifySignupOTP(email: string, otp_code: string, userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) {
    return this.request<{ access_token: string; token_type: string }>(
      '/api/auth/signup/verify',
      {
        method: 'POST',
        body: JSON.stringify({ ...userData, email, otp_code }),
      }
    );
  }

  async requestSigninOTP(credentials: { email: string; password: string; device_token?: string }) {
    return this.request<{ message?: string; access_token?: string; token_type?: string; skip_otp: boolean }>(
      '/api/auth/signin/request-otp',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );
  }

  async verifySigninOTP(email: string, otp_code: string, remember_device: boolean = false) {
    return this.request<{ access_token: string; token_type: string; device_token?: string }>(
      '/api/auth/signin/verify',
      {
        method: 'POST',
        body: JSON.stringify({ email, otp_code, remember_device }),
      }
    );
  }

  async resendOTP(email: string, purpose: 'signup' | 'signin' | 'password_reset') {
    return this.request<{ message: string; expires_in_seconds: number }>(
      '/api/otp/resend',
      {
        method: 'POST',
        body: JSON.stringify({ email, purpose }),
      }
    );
  }

  async requestPasswordReset(email: string) {
    return this.request<{ message: string }>(
      '/api/auth/forgot-password/request-otp',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      }
    );
  }

  async resetPassword(email: string, otp_code: string, new_password: string) {
    return this.request<{ message: string }>(
      '/api/auth/forgot-password/reset',
      {
        method: 'POST',
        body: JSON.stringify({ email, otp_code, new_password }),
      }
    );
  }

  async changePassword(current_password: string, new_password: string) {
    return this.request<{ message: string }>(
      '/api/auth/change-password',
      {
        method: 'POST',
        body: JSON.stringify({ current_password, new_password }),
      }
    );
  }

  // ============================================
  // DASHBOARD METHODS
  // ============================================

  async getDashboard() {
    return this.request<any>('/api/financial/dashboard');
  }

  // ============================================
  // CATEGORY METHODS
  // ============================================

  async getCategories() {
    return this.request<any[]>('/api/financial/categories');
  }

  async createCategory(data: { name: string; type: string }) {
    return this.request<any>('/api/financial/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: { name?: string; type?: string }) {
    return this.request<any>(`/api/financial/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string) {
    return this.request<any>(`/api/financial/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================================
  // BUDGET METHODS
  // ============================================

  async getBudgets(month?: number, year?: number) {
    const params = new URLSearchParams();
    if (month) params.append('month', month.toString());
    if (year) params.append('year', year.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<any[]>(`/api/financial/budgets${query}`);
  }

  async createBudget(data: {
    category_id: string;
    amount: number;
    month: number;
    year: number;
    alert_threshold?: number;
  }) {
    return this.request<any>('/api/financial/budgets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBudget(id: string, data: { amount?: number; alert_threshold?: number }) {
    return this.request<any>(`/api/financial/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBudget(id: string) {
    return this.request<any>(`/api/financial/budgets/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================================
  // ACCOUNT METHODS
  // ============================================

  async getAccounts() {
    return this.request<any[]>('/api/financial/accounts');
  }

  async createAccount(data: { name: string; type: string; balance?: number; currency?: string }) {
    return this.request<any>('/api/financial/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAccount(id: string, data: any) {
    return this.request<any>(`/api/financial/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAccount(id: string) {
    return this.request<any>(`/api/financial/accounts/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================================
  // TRANSACTION METHODS
  // ============================================

  async getTransactions(params?: {
    skip?: number;
    limit?: number;
    type?: string;
    category_id?: string;
    account_id?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.skip) searchParams.append('skip', params.skip.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.type) searchParams.append('type', params.type);
    if (params?.category_id) searchParams.append('category_id', params.category_id);
    if (params?.account_id) searchParams.append('account_id', params.account_id);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request<any[]>(`/api/financial/transactions${query}`);
  }

  async createTransaction(data: {
    type: string;
    amount: number;
    description: string;
    category_id?: string;
    account_id?: string;
    notes?: string;
    transaction_date?: string;
  }) {
    return this.request<any>('/api/financial/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTransaction(id: string, data: any) {
    return this.request<any>(`/api/financial/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTransaction(id: string) {
    return this.request<any>(`/api/financial/transactions/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient(API_URL);
