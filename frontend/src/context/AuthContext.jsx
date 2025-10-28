import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../api/auth';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Auth actions
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const token = authAPI.getToken();
      const user = authAPI.getUser();
      
      if (token && user) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token },
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      // Clear corrupted data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      console.log('Attempting login with:', credentials.email);
      const response = await authAPI.login(credentials);
      console.log('Login successful:', response);
      const { token, id, name, email, role } = response;
      const user = { id, name, email, role };
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token },
      });
      
      return response;
    } catch (error) {
      console.error('Login error in context:', error);
      const errorMessage = error.message || 'Login failed. Please try again.';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      throw new Error(errorMessage);
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });
    
    try {
      console.log('Attempting registration with:', userData.email);
      const response = await authAPI.register(userData);
      console.log('Registration successful:', response);
      dispatch({ type: AUTH_ACTIONS.REGISTER_SUCCESS });
      return response;
    } catch (error) {
      console.error('Registration error in context:', error);
      const errorMessage = error.message || 'Registration failed. Please try again.';
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: errorMessage,
      });
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('admin');
  };

  // Check if user is student
  const isStudent = () => {
    return hasRole('student');
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    hasRole,
    isAdmin,
    isStudent,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;