import { Goal } from '@/store/goals-store';

// API types matching backend models from the schema
export interface CreateGoalDto {
  title: string;
  target: number;
  deadline?: Date | null;
}

export interface UpdateGoalDto {
  title?: string;
  target?: number;
  saved?: number;
  deadline?: Date | null;
}

export interface GoalResponse {
  id: string;
  title: string;
  target: number;
  saved: number;
  deadline: string | null;
  userId: string;
}

// Helper function to convert API response to local model
export const mapGoalResponseToModel = (goalResponse: GoalResponse): Goal => ({
  id: goalResponse.id,
  title: goalResponse.title,
  target: goalResponse.target,
  saved: goalResponse.saved,
  targetDate: goalResponse.deadline ? new Date(goalResponse.deadline) : undefined,
  category: 'savings', // Default category since backend doesn't have this yet
  status: goalResponse.saved >= goalResponse.target ? 'completed' : 'ongoing',
  createdAt: new Date(), // Backend doesn't provide this yet
  updatedAt: new Date(), // Backend doesn't provide this yet
  colorHex: '#4f46e5', // Default color since backend doesn't have this yet
});

// Helper function to convert local model to API request
export const mapModelToCreateGoalDto = (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): CreateGoalDto => ({
  title: goal.title,
  target: goal.target,
  deadline: goal.targetDate || null,
});

export const mapModelToUpdateGoalDto = (goal: Partial<Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>>): UpdateGoalDto => {
  const dto: UpdateGoalDto = {};
  
  if (goal.title !== undefined) dto.title = goal.title;
  if (goal.target !== undefined) dto.target = goal.target;
  if (goal.saved !== undefined) dto.saved = goal.saved;
  if (goal.targetDate !== undefined) dto.deadline = goal.targetDate;
  
  return dto;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper function to get the auth token
const getAuthToken = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token') || '';
  }
  return '';
};

// API client for goals
export const goalsApi = {
  // Get all goals
  async getGoals(): Promise<Goal[]> {
    const response = await fetch(`${API_URL}/goals`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch goals: ${response.statusText}`);
    }

    const data: GoalResponse[] = await response.json();
    return data.map(mapGoalResponseToModel);
  },

  // Get a single goal by ID
  async getGoalById(id: string): Promise<Goal> {
    const response = await fetch(`${API_URL}/goals/${id}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch goal: ${response.statusText}`);
    }

    const data: GoalResponse = await response.json();
    return mapGoalResponseToModel(data);
  },

  // Create a new goal
  async createGoal(goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal> {
    const createDto = mapModelToCreateGoalDto(goalData);
    
    const response = await fetch(`${API_URL}/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(createDto),
    });

    if (!response.ok) {
      throw new Error(`Failed to create goal: ${response.statusText}`);
    }

    const data: GoalResponse = await response.json();
    return mapGoalResponseToModel(data);
  },

  // Update an existing goal
  async updateGoal(id: string, goalData: Partial<Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Goal> {
    const updateDto = mapModelToUpdateGoalDto(goalData);
    
    const response = await fetch(`${API_URL}/goals/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(updateDto),
    });

    if (!response.ok) {
      throw new Error(`Failed to update goal: ${response.statusText}`);
    }

    const data: GoalResponse = await response.json();
    return mapGoalResponseToModel(data);
  },

  // Delete a goal
  async deleteGoal(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/goals/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete goal: ${response.statusText}`);
    }
  },
}; 