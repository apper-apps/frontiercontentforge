import { fetchWithRetry } from '@/utils/fetchWithRetry';

class TeamService {
  constructor() {
    this.baseUrl = '/api/team';
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    try {
      const teamMembers = JSON.parse(localStorage.getItem('teamMembers') || '[]');
      return teamMembers.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    } catch (error) {
      throw new Error('Failed to load team members');
    }
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
      const teamMembers = JSON.parse(localStorage.getItem('teamMembers') || '[]');
      const member = teamMembers.find(member => member.Id === parseInt(id));
      
      if (!member) {
        throw new Error('Team member not found');
      }
      
      return member;
    } catch (error) {
      throw new Error('Failed to load team member');
    }
  }

  async create(memberData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    try {
      const teamMembers = JSON.parse(localStorage.getItem('teamMembers') || '[]');
      const maxId = teamMembers.length > 0 ? Math.max(...teamMembers.map(member => member.Id)) : 0;
      
      const newMember = {
        Id: maxId + 1,
        ...memberData,
        addedAt: new Date().toISOString(),
        addedBy: 'current-user-id'
      };
      
      teamMembers.push(newMember);
      localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
      
      return newMember;
    } catch (error) {
      throw new Error('Failed to add team member');
    }
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const teamMembers = JSON.parse(localStorage.getItem('teamMembers') || '[]');
      const index = teamMembers.findIndex(member => member.Id === parseInt(id));
      
      if (index === -1) {
        throw new Error('Team member not found');
      }
      
      teamMembers[index] = {
        ...teamMembers[index],
        ...updateData
      };
      
      localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
      
      return teamMembers[index];
    } catch (error) {
      throw new Error('Failed to update team member');
    }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    try {
      const teamMembers = JSON.parse(localStorage.getItem('teamMembers') || '[]');
      const filteredMembers = teamMembers.filter(member => member.Id !== parseInt(id));
      
      localStorage.setItem('teamMembers', JSON.stringify(filteredMembers));
      
      return true;
    } catch (error) {
      throw new Error('Failed to remove team member');
    }
  }
}

export default new TeamService();