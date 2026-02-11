/**
 * Todo utility functions
 */

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  user_id: string;
}

export const getCompletedCount = (todos: Todo[]): number => {
  return todos.filter(todo => todo.completed).length;
};

export const getPendingCount = (todos: Todo[]): number => {
  return todos.filter(todo => !todo.completed).length;
};

export const sortTodosByDate = (todos: Todo[], ascending: boolean = false): Todo[] => {
  return [...todos].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const filterTodosByStatus = (todos: Todo[], completed: boolean): Todo[] => {
  return todos.filter(todo => todo.completed === completed);
};

export const searchTodos = (todos: Todo[], query: string): Todo[] => {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return todos;
  
  return todos.filter(todo => 
    todo.title.toLowerCase().includes(lowerQuery)
  );
};

export const getCompletionPercentage = (todos: Todo[]): number => {
  if (todos.length === 0) return 0;
  const completed = getCompletedCount(todos);
  return Math.round((completed / todos.length) * 100);
};
