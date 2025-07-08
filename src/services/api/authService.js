class AuthService {
  constructor() {
    this.storageKey = 'contentforge_auth';
  }

async findTeamMemberByEmail(email) {
    try {
      const teamMembers = JSON.parse(localStorage.getItem('teamMembers') || '[]');
      return teamMembers.find(member => member.email === email) || null;
    } catch (error) {
      throw new Error('Failed to access team members');
    }
  }

  async login(email, password) {
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const teamMember = await this.findTeamMemberByEmail(email);
      
      if (!teamMember || teamMember.password !== password) {
        throw new Error('Invalid email or password');
      }

      const userData = {
        Id: teamMember.Id,
        email: teamMember.email,
        name: teamMember.name,
        role: teamMember.role,
        loginAt: new Date().toISOString()
      };

      localStorage.setItem(this.storageKey, JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
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