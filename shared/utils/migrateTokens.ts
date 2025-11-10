

export function migrateAdminTokens() {
  if (typeof window === 'undefined') return

  const oldAccessToken = localStorage.getItem('access_token')
  const oldRefreshToken = localStorage.getItem('refresh_token')

  if (oldAccessToken || oldRefreshToken) {
    console.log('[Admin] Migrating old tokens to new keys...')
    
    if (oldAccessToken) {
      localStorage.setItem('admin_access_token', oldAccessToken)
      document.cookie = `admin_access_token=${oldAccessToken}; path=/; max-age=${60 * 1}`
    }
    
    if (oldRefreshToken) {
      localStorage.setItem('admin_refresh_token', oldRefreshToken)
      document.cookie = `admin_refresh_token=${oldRefreshToken}; path=/; max-age=${60 * 60 * 24 * 7}`
    }
    
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    document.cookie = 'access_token=; path=/; max-age=0'
    document.cookie = 'refresh_token=; path=/; max-age=0'
    
    console.log('[Admin] Token migration completed')
  }
}
