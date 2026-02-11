export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateTodoTitle = (title: string): { valid: boolean; error?: string } => {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: 'Title cannot be empty' };
  }
  
  if (title.trim().length < 3) {
    return { valid: false, error: 'Title must be at least 3 characters' };
  }
  
  if (title.length > 200) {
    return { valid: false, error: 'Title cannot exceed 200 characters' };
  }
  
  return { valid: true };
};

export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (!password || password.length === 0) {
    return { valid: false, error: 'Password cannot be empty' };
  }
  
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }
  
  return { valid: true };
};
