const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof data === 'object' && data?.message ? data.message : 'Request failed';
    throw new Error(message);
  }

  return data;
}

export const getTools = () => request('/api/tools');
export const createTool = (tool) => request('/api/tools', {
  method: 'POST',
  body: JSON.stringify(tool),
});
export const toggleToolAvailability = (id) => request(`/api/tools/${id}`, {
  method: 'PATCH',
});
