class TeamService {
  constructor() {
    this.tableName = 'team_member';
  }

  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "email" } },
          { field: { Name: "role" } },
          { field: { Name: "password" } },
          { field: { Name: "addedAt" } },
          { field: { Name: "addedBy" } }
        ],
        orderBy: [
          {
            fieldName: "addedAt",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Remove password from returned data for security
      const safeData = (response.data || []).map(member => {
        const { password, ...safeMember } = member;
        return safeMember;
      });
      
      return safeData;
    } catch (error) {
      console.error("Error fetching team members:", error);
      throw new Error('Failed to load team members');
    }
  }

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "email" } },
          { field: { Name: "role" } },
          { field: { Name: "addedAt" } },
          { field: { Name: "addedBy" } }
        ]
      };
      
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Remove password from returned data for security
      const { password, ...safeMember } = response.data;
      return safeMember;
    } catch (error) {
      console.error("Error fetching team member:", error);
      throw new Error('Failed to load team member');
    }
  }

  async create(memberData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include updateable fields
      const params = {
        records: [{
          Name: memberData.name,
          Tags: memberData.tags || "",
          Owner: memberData.owner || null,
          email: memberData.email,
          role: memberData.role,
          password: memberData.password,
          addedAt: new Date().toISOString(),
          addedBy: memberData.addedBy || null
        }]
      };
      
      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to add team member');
        }
        
        // Remove password from returned data for security
        const { password, ...safeMember } = response.results[0].data;
        return safeMember;
      }
      
      const { password, ...safeMember } = response.data;
      return safeMember;
    } catch (error) {
      console.error("Error creating team member:", error);
      throw new Error('Failed to add team member');
    }
  }

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: updateData.name || updateData.Name,
          Tags: updateData.tags || updateData.Tags || "",
          Owner: updateData.owner || updateData.Owner || null,
          email: updateData.email,
          role: updateData.role,
          password: updateData.password,
          addedAt: updateData.addedAt,
          addedBy: updateData.addedBy
        }]
      };
      
      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update team member');
        }
        
        return response.results[0].data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error updating team member:", error);
      throw new Error('Failed to update team member');
    }
  }

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to remove team member');
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting team member:", error);
      throw new Error('Failed to remove team member');
    }
  }

  async setPassword(id, newPassword) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Id: parseInt(id),
          password: newPassword
        }]
      };
      
      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update password');
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error updating password:", error);
      throw new Error('Failed to update password');
    }
  }

  async findByEmail(email) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "email" } },
          { field: { Name: "role" } },
          { field: { Name: "password" } },
          { field: { Name: "addedAt" } },
          { field: { Name: "addedBy" } }
        ],
        where: [
          {
            FieldName: "email",
            Operator: "EqualTo",
            Values: [email]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error("Error finding team member:", error);
      throw new Error('Failed to find team member');
    }
  }
}

export default new TeamService();