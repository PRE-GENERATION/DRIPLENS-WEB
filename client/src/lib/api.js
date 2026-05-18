const BASE_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || '');

class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const request = async (path, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // Don't set Content-Type for FormData — browser sets it with the boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const res = await fetch(`${BASE_URL}/api/v1${path}`, {
    ...options,
    headers,
  });

  // Token expired — clear storage and reload to auth
  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Only redirect if NOT on the auth page already and NOT a login request
    if (!window.location.pathname.includes('/auth') && !path.includes('/auth/login')) {
      window.location.href = '/auth';
      return;
    }
  }

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(
      data.error?.message || 'Something went wrong',
      res.status,
      data.error?.code
    );
  }

  return data;
};

// Convenience methods
export const api = {
  get:    (path)         => request(path, { method: 'GET' }),
  post:   (path, body)   => request(path, { method: 'POST',  body: body instanceof FormData ? body : JSON.stringify(body) }),
  patch:  (path, body)   => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path)         => request(path, { method: 'DELETE' }),
};

export { ApiError };
