const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tripmaxweb-50046480052.development.catalystappsail.in/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('tourister_token');
  
  const headers = { ...options.headers };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('tourister_token');
        localStorage.removeItem('tourister_user');
      }
      const defaultMsg = response.status === 403 
        ? 'Access forbidden. Please log in with appropriate permissions.' 
        : `Request failed with status ${response.status}`;
      const error = new Error(data.message || defaultMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (!err.status && err.name === 'TypeError') {
      err.message = 'Unable to connect to Tourister server. Please check your network connection.';
    }
    throw err;
  }
}

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/upload', { method: 'POST', body: formData });
  },
};
