/**
 * Unit tests for data transformation helpers
 */

import {
  TodoDTO,
  TodoViewModel,
  transformTodoToViewModel,
  transformTodosToViewModels,
  formatTodoForDisplay,
  sanitizeTodoTitle,
  groupTodosByDate,
} from '../dataTransform';
import { Todo } from '../todoHelpers';

const mockTodoDTO: TodoDTO = {
  id: '1',
  title: 'Buy groceries',
  completed: false,
  created_at: '2026-02-11T10:00:00.000Z',
  user_id: 'user1',
};

const mockTodos: Todo[] = [
  {
    id: '1',
    title: 'Buy groceries',
    completed: false,
    created_at: '2026-02-11T10:00:00.000Z',
    user_id: 'user1',
  },
  {
    id: '2',
    title: 'Walk the dog',
    completed: true,
    created_at: '2026-02-11T14:00:00.000Z',
    user_id: 'user1',
  },
  {
    id: '3',
    title: 'Finish project',
    completed: false,
    created_at: '2026-02-10T09:00:00.000Z',
    user_id: 'user1',
  },
];

describe('transformTodoToViewModel', () => {
  it('should transform TodoDTO to TodoViewModel', () => {
    const viewModel = transformTodoToViewModel(mockTodoDTO);
    
    expect(viewModel.id).toBe(mockTodoDTO.id);
    expect(viewModel.title).toBe(mockTodoDTO.title);
    expect(viewModel.isCompleted).toBe(mockTodoDTO.completed);
    expect(viewModel.userId).toBe(mockTodoDTO.user_id);
    expect(viewModel.createdDate).toBeInstanceOf(Date);
    expect(viewModel.createdDate.toISOString()).toBe(mockTodoDTO.created_at);
  });

  it('should handle completed todos', () => {
    const completedTodo = { ...mockTodoDTO, completed: true };
    const viewModel = transformTodoToViewModel(completedTodo);
    expect(viewModel.isCompleted).toBe(true);
  });
});

describe('transformTodosToViewModels', () => {
  it('should transform array of TodoDTOs to TodoViewModels', () => {
    const viewModels = transformTodosToViewModels(mockTodos);
    
    expect(viewModels).toHaveLength(3);
    expect(viewModels[0].id).toBe('1');
    expect(viewModels[1].id).toBe('2');
    expect(viewModels[2].id).toBe('3');
    expect(viewModels.every(vm => vm.createdDate instanceof Date)).toBe(true);
  });

  it('should handle empty array', () => {
    const viewModels = transformTodosToViewModels([]);
    expect(viewModels).toHaveLength(0);
  });
});

describe('formatTodoForDisplay', () => {
  it('should format incomplete todo with circle symbol', () => {
    const formatted = formatTodoForDisplay(mockTodos[0]);
    expect(formatted).toBe('○ Buy groceries');
  });

  it('should format completed todo with checkmark symbol', () => {
    const formatted = formatTodoForDisplay(mockTodos[1]);
    expect(formatted).toBe('✓ Walk the dog');
  });
});

describe('sanitizeTodoTitle', () => {
  it('should trim whitespace from title', () => {
    expect(sanitizeTodoTitle('  Buy groceries  ')).toBe('Buy groceries');
  });

  it('should replace multiple spaces with single space', () => {
    expect(sanitizeTodoTitle('Buy    groceries')).toBe('Buy groceries');
  });

  it('should handle both trimming and space replacement', () => {
    expect(sanitizeTodoTitle('  Buy    groceries  ')).toBe('Buy groceries');
  });

  it('should not modify already clean titles', () => {
    expect(sanitizeTodoTitle('Buy groceries')).toBe('Buy groceries');
  });

  it('should handle empty string', () => {
    expect(sanitizeTodoTitle('')).toBe('');
  });

  it('should handle whitespace-only string', () => {
    expect(sanitizeTodoTitle('   ')).toBe('');
  });
});

describe('groupTodosByDate', () => {
  it('should group todos by date', () => {
    const grouped = groupTodosByDate(mockTodos);
    
    expect(Object.keys(grouped)).toHaveLength(2);
    expect(grouped['2026-02-11']).toHaveLength(2);
    expect(grouped['2026-02-10']).toHaveLength(1);
  });

  it('should use ISO date format for keys', () => {
    const grouped = groupTodosByDate(mockTodos);
    const keys = Object.keys(grouped);
    
    keys.forEach(key => {
      expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  it('should handle empty array', () => {
    const grouped = groupTodosByDate([]);
    expect(Object.keys(grouped)).toHaveLength(0);
  });

  it('should preserve todo data in groups', () => {
    const grouped = groupTodosByDate(mockTodos);
    
    expect(grouped['2026-02-11'][0].title).toBe('Buy groceries');
    expect(grouped['2026-02-11'][1].title).toBe('Walk the dog');
    expect(grouped['2026-02-10'][0].title).toBe('Finish project');
  });
});
