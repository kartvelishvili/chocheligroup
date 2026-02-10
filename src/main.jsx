import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { supabase } from '@/lib/customSupabaseClient';

// ─── Cache Version Check ───
// Compares server cache_version with local. If different, clears all caches and reloads.
(async () => {
  try {
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'cache_version')
      .single();

    if (data?.value) {
      const serverVersion = data.value;
      const localVersion = localStorage.getItem('_cache_version');

      if (localVersion && localVersion !== serverVersion) {
        console.log(`[Cache] Version changed: ${localVersion} → ${serverVersion}. Clearing caches...`);

        // Clear all caches
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map(k => caches.delete(k)));
        }

        // Unregister service workers
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map(r => r.unregister()));
        }

        // Update local version
        localStorage.setItem('_cache_version', serverVersion);

        // Hard reload to get fresh assets
        window.location.reload(true);
        return;
      }

      // First visit or same version — just store it
      localStorage.setItem('_cache_version', serverVersion);
    }
  } catch (e) {
    // site_settings table might not exist yet — ignore silently
    console.debug('[Cache] Version check skipped:', e.message);
  }
})();

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);