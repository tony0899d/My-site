import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import Dashboard from '@/components/Dashboard'

export default function AppDashboard() {
  const { user, isGuest, loading, useAsGuest } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (router.query.guest === 'true' && !user && !isGuest) {
        useAsGuest()
      } else if (!user && !isGuest) {
        router.push('/auth/login')
      }
    }
  }, [user, isGuest, loading, router, useAsGuest])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user && !isGuest) {
    return null
  }

  return <Dashboard />
}