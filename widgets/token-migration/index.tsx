'use client'

import { useEffect } from 'react'
import { migrateAdminTokens } from '@/shared/utils/migrateTokens'

export function TokenMigration() {
  useEffect(() => {
    migrateAdminTokens()
  }, [])

  return null
}
