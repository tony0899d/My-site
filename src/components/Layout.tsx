import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Moon, Sun, LogOut, User, Home, CreditCard, Target, Tag } from 'lucide-react'
import { motion } from 'framer-motion'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, isGuest, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const navigation = [
    { name: 'Dashboard', href: '/app', icon: Home },
    { name: 'Transações', href: '/app/transactions', icon: CreditCard },
    { name: 'Orçamentos', href: '/app/budgets', icon: Target },
    { name: 'Categorias', href: '/app/categories', icon: Tag },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                💰 Controle de Gastos
              </Link>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Criado por Tony - Gratuito e uso privado
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              {(user || isGuest) && (
                <>
                  <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
                    <User className="w-4 h-4" />
                    <span>{isGuest ? 'Visitante' : user?.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 rounded-lg bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-400 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      {(user || isGuest) && router.pathname.startsWith('/app') && (
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = router.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>© 2025 Controle de Gastos - Criado por Tony</p>
              <p>Gratuito e de uso privado</p>
            </div>
            <Link
              href="/about"
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              Sobre o projeto
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}