import apiClient from './client';

type LoginCredentials = {
  email: string;
  password: string;
};

type RegisterData = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

type ForgotPasswordData = {
  email: string;
};

type ResetPasswordData = {
  password: string;
  resetToken: string;
};

type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};

export const authApi = {
  // Login user
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Register new user
  register: async (userData: RegisterData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await apiClient.get('/auth/logout');
    return response.data;
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordData) => {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  },

  // Reset password
  resetPassword: async (data: ResetPasswordData) => {
    const response = await apiClient.put(`/auth/reset-password/${data.resetToken}`, {
      password: data.password,
    });
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordData) => {
    const response = await apiClient.put('/auth/updatepassword', data);
    return response.data;
  },
}; 