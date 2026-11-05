export interface Summary {
  byStatus: {
    todo: number;
    inProgress: number;
    completed: number;
  };
  byKind: {
    habit: number;
    reminder: number;
    task: number;
  };
  completedLast7Days: number;
  overdueReminders: number;
}
