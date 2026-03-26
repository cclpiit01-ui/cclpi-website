import { supabase } from './supabase';

/**
 * We use a helper function to generate the public URL.
 * This ensures that if your Supabase URL changes in .env, 
 * all your PDF links update automatically.
 */
export const getDocUrl = (folder: string, fileName: string) => {
  const { data } = supabase.storage
    .from('publication') // This is your Bucket Name
    .getPublicUrl(`${folder}/${fileName}`);
  
  return data.publicUrl;
};

// Define your folder names here to avoid typos in your components
export const DOC_FOLDERS = {
  REPORTS: 'annual-reports',
  STATEMENTS: 'annual-statements',
  INCORPORATION: 'incorporation',
  CERTIFICATES: 'certificates',
  GOVERNANCE: 'corporate-governance',
  MINUTES: 'minutes',
};