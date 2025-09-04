import React from 'react'
import { useExpenses } from '@/contexts/ExpenseContext'
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { TrendingUp, TrendingDown, Calendar, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import QuickAddToday from './QuickAddToday'
import CategoryPieChart from './charts/CategoryPieChart'
import MonthlyBarChart from './charts/MonthlyBarChart'
import DailyLineChart from './charts/DailyLineChart'

export default function Dashboard() {
  const { transactions, categories } = useExpenses()

  const currentMonth = new Date()
  const previousMonth = subMonths(currentMonth, 1)

  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date)
    return transactionDate >= startOfMonth(currentMonth) && transactionDate <= endOfMonth(currentMonth)
  })

  const previousMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date)
    return transactionDate >= startOfMonth(previousMonth) && transactionDate <= endOfMonth(previousMonth)
  })

  const currentMonthTotal = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0)
  const previousMonthTotal = previousMonthTransactions.reduce((sum, t) => sum + t.amount, 0)
  const monthlyChange = previousMonthTotal > 0 ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100 : 0

  const todayTransactions = currentMonthTransactions.filter(t => t.date === new Date().toISOString().split('T')[0])
  const todayTotal = todayTransactions.reduce((sum, t) => sum + t.amount, 0)

  const averageDailySpending = currentMonthTransactions.length > 0 
    ? currentMonthTotal / new Date().getDate() 
    : 0

  const biggestPurchase = currentMonthTransactions.reduce((max, t) => 
    t.amount > max.amount ? t : max, 
    { amount: 0, description: 'Nenhuma' }
  )

  const daysWithoutSpending = Array.from({ length: new Date().getDate() }, (_, i) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1)
    const dateStr = date.toISOString().split('T')[0]
    return !currentMonthTransactions.some(t => t.date === dateStr)
  }).filter(Boolean).length

  const stats = [
    {
      title: 'Total do Mês',
      value: currentMonthTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      change: monthlyChange,
      icon: TrendingUp,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Gasto Hoje',
      value: todayTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      subtitle: `${todayTransactions.length} transações`,
      icon: Calendar,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Média Diária',
      value: averageDailySpending.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      subtitle: `${daysWithoutSpending} dias sem gastar`,
      icon: TrendingDown,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Maior Compra',
      value: biggestPurchase.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      subtitle: biggestPurchase.description,
      icon: ShoppingCart,
      color: 'text-orange-600 dark:text-orange-400'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard de Gastos
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      {/* Quick Add */}
      <QuickAddToday />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                {stat.change !== undefined && (
                  <div className={`flex items-center text-sm ${
                    stat.change >= 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                  }`}>
                    {stat.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                    {Math.abs(stat.change).toFixed(1)}%
                  </div>
                )}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                {stat.subtitle && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {stat.subtitle}
                  </p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CategoryPieChart />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <MonthlyBarChart />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <DailyLineChart />
      </motion.div>
    </div>
  )
}