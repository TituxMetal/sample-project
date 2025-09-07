export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 100,
    PATTERN: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    MESSAGE:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_]+$/,
    MESSAGE: 'Username can only contain letters, numbers, and underscores'
  },
  NAME: {
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z\s-]+$/,
    MESSAGE: 'Can only contain letters, spaces, and hyphens'
  },
  EMAIL: {
    MAX_LENGTH: 255,
    MESSAGE: 'Please provide a valid email address'
  }
} as const
