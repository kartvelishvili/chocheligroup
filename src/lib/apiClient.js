/**
 * API Client for iHost.ge backend
 * Drop-in replacement for Supabase client
 */

const API_BASE = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || 'https://api.chocheligroup.com/api')
  : '/api';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }
  const res = await fetch(url, config);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API error: ${res.status}`);
  }
  return res.json();
}

// ══════════════════════════════════════
// Companies API
// ══════════════════════════════════════
export const companiesApi = {
  getAll: () => request('/companies'),
  getById: (id) => request(`/companies/${id}`),
  create: (data) => request('/companies', { method: 'POST', body: data }),
  update: (id, data) => request(`/companies/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/companies/${id}`, { method: 'DELETE' }),
  updateOrder: (companyId, newPosition) =>
    request(`/companies/${companyId}`, { method: 'PUT', body: { order_position: newPosition } }),
};

// ══════════════════════════════════════
// Sub-brands API
// ══════════════════════════════════════
export const subBrandsApi = {
  getByCompany: (companyId) => request(`/sub-brands?company_id=${companyId}`),
  create: (data) => request('/sub-brands', { method: 'POST', body: data }),
  update: (id, data) => request(`/sub-brands/${id}`, { method: 'PUT', body: data }),
  deleteMany: (ids) => request('/sub-brands', { method: 'DELETE', body: { ids } }),
  bulkUpsert: (companyId, subBrands) =>
    request('/sub-brands/bulk', { method: 'POST', body: { company_id: companyId, sub_brands: subBrands } }),
};

// ══════════════════════════════════════
// Brands API
// ══════════════════════════════════════
export const brandsApi = {
  getAll: () => request('/brands'),
  getById: (id) => request(`/brands/${id}`),
  create: (data) => request('/brands', { method: 'POST', body: data }),
  update: (id, data) => request(`/brands/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/brands/${id}`, { method: 'DELETE' }),
};

// ══════════════════════════════════════
// News API
// ══════════════════════════════════════
export const newsApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/news${qs ? '?' + qs : ''}`);
  },
  getPublished: (limit) => request(`/news?published=true${limit ? '&limit=' + limit : ''}`),
  getBySlug: (slug) => request(`/news/by-slug/${slug}`),
  getRelated: (id, categoryId) => request(`/news/${id}/related?category_id=${categoryId}`),
  create: (data) => request('/news', { method: 'POST', body: data }),
  update: (id, data) => request(`/news/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/news/${id}`, { method: 'DELETE' }),
};

// ══════════════════════════════════════
// News Categories API
// ══════════════════════════════════════
export const newsCategoriesApi = {
  getAll: () => request('/news-categories'),
  getActive: () => request('/news-categories?active=true'),
  create: (data) => request('/news-categories', { method: 'POST', body: data }),
  update: (id, data) => request(`/news-categories/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/news-categories/${id}`, { method: 'DELETE' }),
  bulkUpdateOrder: (items) => request('/news-categories/bulk', { method: 'PUT', body: { items } }),
};

// ══════════════════════════════════════
// Menu Items API
// ══════════════════════════════════════
export const menuItemsApi = {
  getAll: () => request('/menu-items'),
  getActive: () => request('/menu-items?active=true'),
  create: (data) => request('/menu-items', { method: 'POST', body: data }),
  update: (id, data) => request(`/menu-items/${id}`, { method: 'PUT', body: data }),
  bulkUpsert: (items) => request('/menu-items/bulk', { method: 'PUT', body: { items } }),
  delete: (id) => request(`/menu-items/${id}`, { method: 'DELETE' }),
};

// ══════════════════════════════════════
// Site Content API
// ══════════════════════════════════════
export const siteContentApi = {
  getAll: () => request('/site-content'),
  getBySection: (sectionKey) => request(`/site-content/${sectionKey}`),
  update: (sectionKey, content) =>
    request(`/site-content/${sectionKey}`, { method: 'PUT', body: { content } }),
};

// ══════════════════════════════════════
// Site Design API
// ══════════════════════════════════════
export const siteDesignApi = {
  getAll: () => request('/site-design'),
  update: (id, data) => request(`/site-design/${id}`, { method: 'PUT', body: data }),
  activate: (sectionKey, presetNumber) =>
    request('/site-design/activate', { method: 'PUT', body: { section_key: sectionKey, preset_number: presetNumber } }),
};

// ══════════════════════════════════════
// Site Settings API
// ══════════════════════════════════════
export const siteSettingsApi = {
  getAll: () => request('/site-settings'),
  get: (key) => request(`/site-settings/${key}`),
  update: (key, value) => request(`/site-settings/${key}`, { method: 'PUT', body: { value } }),
  upsert: (key, value) => request('/site-settings', { method: 'POST', body: { key, value } }),
};

// ══════════════════════════════════════
// Custom Pages API
// ══════════════════════════════════════
export const customPagesApi = {
  getAll: () => request('/custom-pages'),
  getBySlug: (slug) => request(`/custom-pages/by-slug/${slug}`),
  create: (data) => request('/custom-pages', { method: 'POST', body: data }),
  update: (id, data) => request(`/custom-pages/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/custom-pages/${id}`, { method: 'DELETE' }),
};

// ══════════════════════════════════════
// Who We Are API
// ══════════════════════════════════════
export const whoWeAreApi = {
  get: () => request('/who-we-are'),
  update: (data) => request('/who-we-are', { method: 'PUT', body: data }),
};

// ══════════════════════════════════════
// File Upload API
// ══════════════════════════════════════
export const uploadApi = {
  upload: async (bucket, file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const base64 = reader.result.split(',')[1];
        try {
          const result = await request(`/upload/${bucket}`, {
            method: 'POST',
            body: { file: base64, filename: file.name, contentType: file.type },
          });
          resolve(result);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
  delete: (bucket, key) => request(`/upload/${bucket}/${encodeURIComponent(key)}`, { method: 'DELETE' }),
  deleteByPath: (fullKey) => request('/upload/delete', { method: 'POST', body: { key: fullKey } }),
  getPublicUrl: (path) => `https://s3.ihost.ge/site-chocheligroup-com/${path}`,
};

// ══════════════════════════════════════
// Admin Stats API
// ══════════════════════════════════════
export const adminApi = {
  getStats: () => request('/admin/stats'),
  login: (email, password) => request('/admin/login', { method: 'POST', body: { email, password } }),
};

// ══════════════════════════════════════
// Contact Messages API
// ══════════════════════════════════════
export const contactMessagesApi = {
  getAll: () => request('/contact-messages'),
  create: (data) => request('/contact-messages', { method: 'POST', body: data }),
  markRead: (id) => request(`/contact-messages/${id}/read`, { method: 'PUT' }),
  delete: (id) => request(`/contact-messages/${id}`, { method: 'DELETE' }),
};

// ══════════════════════════════════════
// Panel Admins API
// ══════════════════════════════════════
export const panelAdminsApi = {
  getAll: () => request('/panel-admins'),
  create: (data) => request('/panel-admins', { method: 'POST', body: data }),
  update: (id, data) => request(`/panel-admins/${id}`, { method: 'PUT', body: data }),
  delete: (id) => request(`/panel-admins/${id}`, { method: 'DELETE' }),
};
