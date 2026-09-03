import { defineStore } from 'pinia';
import { api } from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => {
    let savedUser = null;
    let savedToken = null;
    try {
      const u = localStorage.getItem('alharsh_user');
      if (u) savedUser = JSON.parse(u);
      savedToken = localStorage.getItem('alharsh_token');
    } catch (_) {}

    // Default to Master Admin if no user is stored yet so existing users can work immediately
    if (!savedUser) {
      savedUser = {
        userId: 'admin_alharsh',
        name: 'Al-Harsh Master Admin',
        email: 'admin@alharsh.com',
        businessName: 'Al-Harsh System Inventory',
        role: 'admin',
        subscription: {
          plan: 'enterprise',
          billingCycle: 'yearly',
          brandLimit: 999,
          status: 'active'
        }
      };
      savedToken = 'tok_admin_alharsh_default';
      try {
        localStorage.setItem('alharsh_user', JSON.stringify(savedUser));
        localStorage.setItem('alharsh_token', savedToken);
      } catch (_) {}
    }

    return {
      user: savedUser,
      token: savedToken,
      isLoading: false,
      authError: null
    };
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
    userId: (state) => state.user?.userId || state.user?._id || 'admin_alharsh',
    currentPlan: (state) => state.user?.subscription?.plan || 'starter',
    brandLimit: (state) => state.user?.subscription?.brandLimit ?? 1,
    isUnlimited: (state) => (state.user?.subscription?.brandLimit ?? 1) >= 900 || state.user?.role === 'admin',
    billingCycle: (state) => state.user?.subscription?.billingCycle || 'monthly',
    canAddBrand: (state) => (currentCount) => {
      const limit = state.user?.subscription?.brandLimit ?? 1;
      return currentCount < limit;
    }
  },

  actions: {
    async login(email, password) {
      this.isLoading = true;
      this.authError = null;
      try {
        const data = await api.login(email, password);
        this.user = data.user;
        this.token = data.token;
        localStorage.setItem('alharsh_user', JSON.stringify(data.user));
        localStorage.setItem('alharsh_token', data.token);
        return data.user;
      } catch (err) {
        this.authError = err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async register(formData) {
      this.isLoading = true;
      this.authError = null;
      try {
        const data = await api.register(formData);
        this.user = data.user;
        this.token = data.token;
        localStorage.setItem('alharsh_user', JSON.stringify(data.user));
        localStorage.setItem('alharsh_token', data.token);
        return data.user;
      } catch (err) {
        this.authError = err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async upgradePlan(plan, billingCycle = 'monthly', customBrandLimit = null) {
      this.isLoading = true;
      try {
        const res = await api.updateSubscription({
          userId: this.userId,
          plan,
          billingCycle,
          customBrandLimit
        });
        if (res.user) {
          this.user = res.user;
          localStorage.setItem('alharsh_user', JSON.stringify(res.user));
        }
        return this.user;
      } catch (err) {
        this.authError = err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('alharsh_user');
      localStorage.removeItem('alharsh_token');
    }
  }
});
