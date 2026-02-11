/**
 * Data transformation helpers
 */

import { Todo } from './todoHelpers';

export interface TodoDTO {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  user_id: string;
}

export interface TodoViewModel {
  id: string;
  title: string;
  isCompleted: boolean;
  createdDate: Date;
  userId: string;
}

export const transformTodoToViewModel = (todo: TodoDTO): TodoViewModel => {
  return {
    id: todo.id,
    title: todo.title,
    isCompleted: todo.completed,
    createdDate: new Date(todo.created_at),
    userId: todo.user_id,
  };
};

export const transformTodosToViewModels = (todos: TodoDTO[]): TodoViewModel[] => {
  return todos.map(transformTodoToViewModel);
};

export const formatTodoForDisplay = (todo: Todo): string => {
  const status = todo.completed ? '✓' : '○';
  return `${status} ${todo.title}`;
};

export const sanitizeTodoTitle = (title: string): string => {
  return title.trim().replace(/\s+/g, ' ');
};

export const groupTodosByDate = (todos: Todo[]): Record<string, Todo[]> => {
  return todos.reduce((groups, todo) => {
    const date = new Date(todo.created_at).toISOString().split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(todo);
    return groups;
  }, {} as Record<string, Todo[]>);
};
