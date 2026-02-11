
import { TodoApi } from '../todoApi';
import { SupabaseClient } from '@supabase/supabase-js';

const createMockSupabase = () => {
  const mockResult = { data: null as any, error: null as any };
  
  const mockFluent = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockImplementation(() => Promise.resolve(mockResult)),
    then: jest.fn().mockImplementation((onFulfilled) => 
      Promise.resolve(mockResult).then(onFulfilled)
    ),
  };

  const mockFrom = jest.fn().mockReturnValue(mockFluent);
  
  const mockSupabase = {
    from: mockFrom,
    auth: {
      getUser: jest.fn(),
      signOut: jest.fn(),
    }
  } as unknown as SupabaseClient;

  return {
    mockSupabase,
    mockFrom,
    ...mockFluent,
    setMockData: (data: any) => { mockResult.data = data; mockResult.error = null; },
    setMockError: (message: string) => { mockResult.data = null; mockResult.error = { message }; },
  };
};

describe('TodoApi', () => {
  let todoApi: TodoApi;
  let mocks: ReturnType<typeof createMockSupabase>;

  beforeEach(() => {
    mocks = createMockSupabase();
    todoApi = new TodoApi(mocks.mockSupabase);
    jest.clearAllMocks();
  });

  describe('getAllTodos', () => {
    it('should fetch all todos ordered by created_at descending', async () => {
      const mockTodos = [
        { id: '1', title: 'Todo 1', completed: false, created_at: '2026-02-11T10:00:00Z', user_id: 'user1' },
      ];
      mocks.setMockData(mockTodos);

      const result = await todoApi.getAllTodos();

      expect(mocks.mockFrom).toHaveBeenCalledWith('todos');
      expect(mocks.select).toHaveBeenCalledWith('*');
      expect(mocks.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual(mockTodos);
    });

    it('should return empty array when data is null', async () => {
      mocks.setMockData(null);
      const result = await todoApi.getAllTodos();
      expect(result).toEqual([]);
    });

    it('should throw error on failure', async () => {
      mocks.setMockError('DB Error');
      await expect(todoApi.getAllTodos()).rejects.toThrow('DB Error');
    });
  });

  describe('getTodoById', () => {
    it('should fetch single todo by id', async () => {
      const mockTodo = { id: '1', title: 'Test' };
      mocks.setMockData(mockTodo);

      const result = await todoApi.getTodoById('1');

      expect(mocks.select).toHaveBeenCalledWith('*');
      expect(mocks.eq).toHaveBeenCalledWith('id', '1');
      expect(mocks.single).toHaveBeenCalled();
      expect(result).toEqual(mockTodo);
    });
  });

  describe('createTodo', () => {
    it('should create and return new todo', async () => {
      const input = { title: 'New', user_id: 'u1' };
      const created = { ...input, id: '1', completed: false };
      mocks.setMockData(created);

      const result = await todoApi.createTodo(input);

      expect(mocks.insert).toHaveBeenCalledWith({
        title: 'New',
        user_id: 'u1',
        completed: false,
      });
      expect(mocks.select).toHaveBeenCalled();
      expect(mocks.single).toHaveBeenCalled();
      expect(result).toEqual(created);
    });
  });

  describe('updateTodo', () => {
    it('should update todo fields', async () => {
      const updated = { id: '1', title: 'Updated' };
      mocks.setMockData(updated);

      const result = await todoApi.updateTodo('1', { title: 'Updated' });

      expect(mocks.update).toHaveBeenCalledWith({ title: 'Updated' });
      expect(mocks.eq).toHaveBeenCalledWith('id', '1');
      expect(result).toEqual(updated);
    });
  });

  describe('deleteTodo', () => {
    it('should delete todo by id', async () => {
      mocks.setMockData(null);
      await todoApi.deleteTodo('1');
      expect(mocks.delete).toHaveBeenCalled();
      expect(mocks.eq).toHaveBeenCalledWith('id', '1');
    });
  });

  describe('toggleTodoComplete', () => {
    it('should toggle completion using updateTodo logic', async () => {
      const toggled = { id: '1', completed: true };
      mocks.setMockData(toggled);

      const result = await todoApi.toggleTodoComplete('1', true);

      expect(mocks.update).toHaveBeenCalledWith({ completed: true });
      expect(mocks.eq).toHaveBeenCalledWith('id', '1');
      expect(result).toEqual(toggled);
    });
  });

  describe('getTodosByUserId', () => {
    it('should filter by user_id and order by date', async () => {
      const userTodos = [{ id: '1', user_id: 'u1' }];
      mocks.setMockData(userTodos);

      const result = await todoApi.getTodosByUserId('u1');

      expect(mocks.eq).toHaveBeenCalledWith('user_id', 'u1');
      expect(mocks.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual(userTodos);
    });
  });
});

