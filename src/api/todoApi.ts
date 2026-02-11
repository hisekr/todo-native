import { SupabaseClient } from '@supabase/supabase-js';
import { Todo } from '../utils/todoHelpers';

export interface CreateTodoInput {
  title: string;
  user_id: string;
}

export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
}

export class TodoApi {
  constructor(private supabase: SupabaseClient) {}

  async getAllTodos(): Promise<Todo[]> {
    const { data, error } = await this.supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async getTodoById(id: string): Promise<Todo | null> {
    const { data, error } = await this.supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async createTodo(input: CreateTodoInput): Promise<Todo> {
    const { data, error } = await this.supabase
      .from('todos')
      .insert({
        title: input.title,
        user_id: input.user_id,
        completed: false,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async updateTodo(id: string, input: UpdateTodoInput): Promise<Todo> {
    const { data, error } = await this.supabase
      .from('todos')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async deleteTodo(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  async toggleTodoComplete(id: string, completed: boolean): Promise<Todo> {
    return this.updateTodo(id, { completed });
  }

  async getTodosByUserId(userId: string): Promise<Todo[]> {
    const { data, error } = await this.supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }
}
