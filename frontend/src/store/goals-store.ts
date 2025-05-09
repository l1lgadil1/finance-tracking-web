import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  goalsApi
} from '@/entities/goal/api';

export type GoalStatus = 'ongoing' | 'completed' | 'paused';
export type GoalCategory = 'savings' | 'debt' | 'investment' | 'purchase' | 'emergency' | 'other';

// Frontend model with additional UI properties
export interface Goal {
  id: string;
  title: string;
  description?: string;
  target: number; // Target amount, mapped from 'target' in backend
  saved: number; // Saved amount, mapped from 'saved' in backend
  targetDate?: Date; // Deadline from backend
  createdAt: Date;
  updatedAt: Date;
  // UI-specific properties not in backend
  category: GoalCategory;
  status: GoalStatus;
  colorHex?: string;
}

interface GoalsState {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  // Actions
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateGoal: (id: string, updatedGoal: Partial<Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  fetchGoals: () => Promise<void>;
}

export const useGoalsStore = create<GoalsState>()(
  devtools(
    (set) => ({
      goals: [],
      isLoading: false,
      error: null,

      addGoal: async (goalData) => {
        set({ isLoading: true, error: null });
        try {
          const newGoal = await goalsApi.createGoal(goalData);
          set((state) => ({
            goals: [...state.goals, newGoal],
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to create goal' 
          });
          throw error;
        }
      },

      updateGoal: async (id, updatedGoal) => {
        set({ isLoading: true, error: null });
        try {
          const updated = await goalsApi.updateGoal(id, updatedGoal);
          set((state) => ({
            goals: state.goals.map((goal) => goal.id === id ? updated : goal),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to update goal' 
          });
          throw error;
        }
      },

      deleteGoal: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await goalsApi.deleteGoal(id);
          set((state) => ({
            goals: state.goals.filter((goal) => goal.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to delete goal' 
          });
          throw error;
        }
      },

      fetchGoals: async () => {
        set({ isLoading: true, error: null });
        try {
          const goals = await goalsApi.getGoals();
          set({ goals, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch goals' 
          });
          throw error;
        }
      },
    })
  )
); 