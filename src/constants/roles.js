export const ROLES = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    HRAD_ADMIN: 'HRAD_ADMIN',   // Recruitment & Posters
    CIA_ADMIN: 'CIA_ADMIN',     // News & Publications
    CLAIMS_ADMIN: 'CLAIMS_ADMIN' // NEW: Claims & Mortuaries
  };
  
  export const PERMISSIONS = {
    SUPER_ADMIN: ['dashboard_access', 'poster_tool', 'claims', 'news', 'hr_dashboard', 'user_management'],
    HRAD_ADMIN: ['dashboard_access', 'poster_tool', 'hr_dashboard'],
    CIA_ADMIN: ['dashboard_access', 'news'],
    CLAIMS_ADMIN: ['dashboard_access', 'claims'],
  };