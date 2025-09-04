import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  Shield, 
  Smartphone, 
  Download,
  ArrowRight,
  Star
} from 'lucide-react'

export default function Home() {
  const { user, isGuest } = useAuth()

  const features = [
    {
      icon: TrendingUp,
      title: 'Controle Total',
      description: 'Acompanhe seus gastos em tempo real com gráficos interativos'
    },
    {
      icon: PieChart,
      title: 'Gráficos Visuais',
      description: 'Visualize seus gastos por categoria com gráficos bonitos e animados'
    },
    {
      icon: BarChart3,
      title: 'Relatórios Mensais',
      description: 'Compare seus gastos mês a mês e identifique tendências'
    },
    {
      icon: Shield,
      title: 'Dados Seguros',
      description: 'Seus dados ficam protegidos e são de uso totalmente privado'
    },
    {
      icon: Smartphone,
      title: 'Acesso Rápido',
      description: 'Adicione gastos rapidamente com o botão "Gastei hoje"'
    },
    {
      icon: Download,
      title: 'Export/Import',
      description: 'Exporte seus dados ou importe planilhas existentes'
    }
  ]

  if (user || isGuest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Bem-vindo de volta!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Continue controlando seus gastos
            </p>
            <Link
              href="/app"
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <span>Ir para Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
              <TrendingUp className="w-12 h-12 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Controle de Gastos
            <span className="block text-primary-600 dark:text-primary-400">Simples e Eficiente</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Gerencie suas finanças pessoais com gráficos visuais, relatórios detalhados 
            e um sistema intuitivo para acompanhar todos os seus gastos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href="/auth/register"
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-lg"
            >
              <span>Criar Conta Grátis</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link
              href="/auth/login"
              className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium py-3 px-8 rounded-lg transition-colors border border-gray-300 dark:border-gray-600"
            >
              <span>Fazer Login</span>
            </Link>
          </div>

          <div className="inline-flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>Criado por Tony - Gratuito e de uso privado</span>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg w-fit mb-4">
                  <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Comece agora mesmo
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Experimente sem compromisso como visitante ou crie sua conta gratuita
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/app"
              onClick={(e) => {
                e.preventDefault()
                // This would trigger guest mode
                window.location.href = '/app?guest=true'
              }}
              className="inline-flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <span>Usar como Visitante</span>
            </Link>
            
            <Link
              href="/auth/register"
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <span>Criar Conta</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}