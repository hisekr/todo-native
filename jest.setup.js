// Mock Supabase client globally
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock react-native-url-polyfill
jest.mock('react-native-url-polyfill/auto', () => ({}));
