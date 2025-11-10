export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  UPLOADS_URL: import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000/uploads',
} as const;
