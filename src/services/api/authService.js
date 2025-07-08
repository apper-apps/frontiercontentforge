class AuthService {
  constructor() {
    this.storageKey = 'contentforge_auth';
  }

  async login(email, password) {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Demo credentials
    if (email === 'admin@example.com' && password === 'password') {
      const userData = {
        Id: 1,
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        loginAt: new Date().toISOString()
      };

      localStorage.setItem(this.storageKey, JSON.stringify(userData));
      return userData;
    }

    throw new Error('Invalid email or password');
  }

  async logout() {
    await new Promise(resolve => setTimeout(resolve, 200));
    localStorage.removeItem(this.storageKey);
  }

  async getCurrentUser() {
    try {
      const userData = localStorage.getItem(this.storageKey);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  isAuthenticated() {
    return !!localStorage.getItem(this.storageKey);
  }
}

export default new AuthService();