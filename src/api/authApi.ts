import { SupabaseClient, User, Session } from '@supabase/supabase-js';

export interface SignUpInput {
  email: string;
  password: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface AuthResult {
  user: User | null;
  session: Session | null;
}

export class AuthApi {
  constructor(private supabase: SupabaseClient) {}

  async signUp(input: SignUpInput): Promise<AuthResult> {
    const { data, error } = await this.supabase.auth.signUp({
      email: input.email,
      password: input.password,
    });

    if (error) throw new Error(error.message);
    
    return {
      user: data.user,
      session: data.session,
    };
  }

  async signIn(input: SignInInput): Promise<AuthResult> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) throw new Error(error.message);
    
    return {
      user: data.user,
      session: data.session,
    };
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) throw new Error(error.message);
    return data.user;
  }

  async getCurrentSession(): Promise<Session | null> {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) throw new Error(error.message);
    return data.session;
  }

  async resetPassword(email: string): Promise<void> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message);
  }

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw new Error(error.message);
  }
}
