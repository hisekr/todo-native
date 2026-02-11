/**
 * Unit tests for todo helper functions
 */

import {
  Todo,
  getCompletedCount,
  getPendingCount,
  sortTodosByDate,
  filterTodosByStatus,
  searchTodos,
  getCompletionPercentage,
} from '../todoHelpers';

const mockTodos: Todo[] = [
  {
    id: '1',
    title: 'Buy groceries',
    completed: false,
    created_at: '2026-02-10T10:00:00Z',
    user_id: 'user1',
  },
  {
    id: '2',
    title: 'Walk the dog',
    completed: true,
    created_at: '2026-02-11T09:00:00Z',
    user_id: 'user1',
  },
  {
    id: '3',
    title: 'Finish project',
    completed: false,
    created_at: '2026-02-09T15:00:00Z',
    user_id: 'user1',
  },
  {
    id: '4',
    title: 'Call mom',
    completed: true,
    created_at: '2026-02-11T14:00:00Z',
    user_id: 'user1',
  },
];

describe('getCompletedCount', () => {
  it('should return the count of completed todos', () => {
    expect(getCompletedCount(mockTodos)).toBe(2);
  });

  it('should return 0 for empty array', () => {
    expect(getCompletedCount([])).toBe(0);
  });

  it('should return 0 when no todos are completed', () => {
    const incompleteTodos = mockTodos.map(t => ({ ...t, completed: false }));
    expect(getCompletedCount(incompleteTodos)).toBe(0);
  });

  it('should return total count when all todos are completed', () => {
    const completedTodos = mockTodos.map(t => ({ ...t, completed: true }));
    expect(getCompletedCount(completedTodos)).toBe(4);
  });
});

describe('getPendingCount', () => {
  it('should return the count of pending todos', () => {
    expect(getPendingCount(mockTodos)).toBe(2);
  });

  it('should return 0 for empty array', () => {
    expect(getPendingCount([])).toBe(0);
  });

  it('should return total count when no todos are completed', () => {
    const incompleteTodos = mockTodos.map(t => ({ ...t, completed: false }));
    expect(getPendingCount(incompleteTodos)).toBe(4);
  });
});

describe('sortTodosByDate', () => {
  it('should sort todos by date descending by default', () => {
    const sorted = sortTodosByDate(mockTodos);
    expect(sorted[0].id).toBe('4'); 
    expect(sorted[1].id).toBe('2'); 
    expect(sorted[2].id).toBe('1'); 
    expect(sorted[3].id).toBe('3'); 
  });

  it('should sort todos by date ascending when specified', () => {
    const sorted = sortTodosByDate(mockTodos, true);
    expect(sorted[0].id).toBe('3'); 
    expect(sorted[1].id).toBe('1'); 
    expect(sorted[2].id).toBe('2'); 
    expect(sorted[3].id).toBe('4'); 
  });

  it('should not mutate the original array', () => {
    const original = [...mockTodos];
    sortTodosByDate(mockTodos);
    expect(mockTodos).toEqual(original);
  });
});

describe('filterTodosByStatus', () => {
  it('should filter completed todos', () => {
    const completed = filterTodosByStatus(mockTodos, true);
    expect(completed).toHaveLength(2);
    expect(completed.every(t => t.completed)).toBe(true);
  });

  it('should filter pending todos', () => {
    const pending = filterTodosByStatus(mockTodos, false);
    expect(pending).toHaveLength(2);
    expect(pending.every(t => !t.completed)).toBe(true);
  });

  it('should return empty array when no matches', () => {
    const allCompleted = mockTodos.map(t => ({ ...t, completed: true }));
    const pending = filterTodosByStatus(allCompleted, false);
    expect(pending).toHaveLength(0);
  });
});

describe('searchTodos', () => {
  it('should find todos matching the query', () => {
    const results = searchTodos(mockTodos, 'dog');
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Walk the dog');
  });

  it('should be case-insensitive', () => {
    const results = searchTodos(mockTodos, 'GROCERIES');
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Buy groceries');
  });

  it('should return all todos for empty query', () => {
    expect(searchTodos(mockTodos, '')).toEqual(mockTodos);
    expect(searchTodos(mockTodos, '   ')).toEqual(mockTodos);
  });

  it('should return empty array when no matches', () => {
    const results = searchTodos(mockTodos, 'nonexistent');
    expect(results).toHaveLength(0);
  });

  it('should find partial matches', () => {
    const results = searchTodos(mockTodos, 'pro');
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Finish project');
  });
});

describe('getCompletionPercentage', () => {
  it('should calculate completion percentage correctly', () => {
    expect(getCompletionPercentage(mockTodos)).toBe(50);
  });

  it('should return 0 for empty array', () => {
    expect(getCompletionPercentage([])).toBe(0);
  });

  it('should return 0 when no todos are completed', () => {
    const incompleteTodos = mockTodos.map(t => ({ ...t, completed: false }));
    expect(getCompletionPercentage(incompleteTodos)).toBe(0);
  });

  it('should return 100 when all todos are completed', () => {
    const completedTodos = mockTodos.map(t => ({ ...t, completed: true }));
    expect(getCompletionPercentage(completedTodos)).toBe(100);
  });

  it('should round to nearest integer', () => {
    const threeTodos = mockTodos.slice(0, 3);
    const oneCompleted = threeTodos.map((t, i) => ({ ...t, completed: i === 0 }));
    expect(getCompletionPercentage(oneCompleted)).toBe(33); 
  });
});
