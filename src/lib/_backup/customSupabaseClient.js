import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://deqympqjroyzuxcmzotf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlcXltcHFqcm95enV4Y216b3RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNzY5MDEsImV4cCI6MjA4NDY1MjkwMX0.vTuZoA6rT8E_IrjbxVrCGUs9DlhrgkjMSZg0T_QQ4L0';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
