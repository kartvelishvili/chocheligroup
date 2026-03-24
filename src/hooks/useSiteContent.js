import { useState, useEffect, useCallback } from 'react';
import { siteContentApi } from '@/lib/apiClient';

// In-memory cache shared across all hook instances
const contentCache = {};
const pendingRequests = {};

export const useSiteContent = (sectionKey) => {
  const [content, setContent] = useState(contentCache[sectionKey]?.content || null);
  const [loading, setLoading] = useState(!contentCache[sectionKey]);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async (forceRefresh = false) => {
    // Return cached if available and no force refresh
    if (!forceRefresh && contentCache[sectionKey]) {
      setContent(contentCache[sectionKey].content);
      setLoading(false);
      return contentCache[sectionKey].content;
    }

    // Deduplicate concurrent requests for the same key
    if (pendingRequests[sectionKey]) {
      const result = await pendingRequests[sectionKey];
      setContent(result);
      setLoading(false);
      return result;
    }

    setLoading(true);
    setError(null);

    const request = (async () => {
      try {
        const data = await siteContentApi.getBySection(sectionKey);

        const result = data?.content || null;
        contentCache[sectionKey] = { content: result, timestamp: Date.now() };
        setContent(result);
        return result;
      } catch (err) {
        console.warn(`Failed to load site_content for "${sectionKey}":`, err.message);
        setError(err);
        return null;
      } finally {
        setLoading(false);
        delete pendingRequests[sectionKey];
      }
    })();

    pendingRequests[sectionKey] = request;
    return request;
  }, [sectionKey]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { content, loading, error, refetch: () => fetchContent(true) };
};

// Fetch multiple sections at once (for admin)
export const fetchAllSiteContent = async () => {
  const data = await siteContentApi.getAll();
  return data || [];
};

// Update a section's content
export const updateSiteContent = async (sectionKey, newContent) => {
  const data = await siteContentApi.update(sectionKey, newContent);
  
  // Invalidate cache
  delete contentCache[sectionKey];
  
  return data;
};

// Clear the entire cache (useful after admin saves)
export const clearContentCache = () => {
  Object.keys(contentCache).forEach(key => delete contentCache[key]);
};
