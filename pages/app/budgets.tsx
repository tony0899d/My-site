import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useExpenses } from '@/contexts/ExpenseContext'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Target, Plus, AlertTriangle, TrendingUp } from 'lucide-react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import toast from 'react-hot-toast'

export default function BudgetsPage() {
  const { user, isGuest, loading } = useAuth()
  const { transactions, categories, budgets, setBudget } = useExpenses()
  const router = useRouter()
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [budgetAmount, setBudgetAmount] = useState('')

  React.useEffect(() => {
    if (!loading && !user && !isGuest) {
      router.push('/auth/login')
    }
  }, [user, isGuest, loading, router])

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

  const currentMonth = format(new Date(), 'yyyy-MM')
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date)
    return transactionDate >= startOfMonth(new Date()) && transactionDate <= endOfMonth(new Date())
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCategory || !budgetAmount) {
      toast.error('Preencha todos os campos')
      return
    }

    try {
      await setBudget(selectedCategory, parseFloat(budgetAmount), currentMonth)
      toast.success('Orçamento definido!')
      setShowAddForm(false)
      setSelectedCategory('')
      setBudgetAmount('')
    } catch (error) {
      toast.error('Erro ao definir orçamento')
    }
  }

  const categoryBudgets = categories.map(category => {
    const budget = budgets.find(b => b.category_id === category.id && b.month === currentMonth)
    const spent = currentMonthTransactions
      .filter(t => t.category_id === category.id)
      .reduce((sum, t) => sum + t.amount, 0)
    
    const percentage = budget ? (spent / budget.amount) * 100 : 0
    const isOverBudget = budget && spent > budget.amount

    return {
      category,
      budget: budget?.amount || 0,
      spent,
      percentage,
      isOverBudget,
      remaining: budget ? budget.amount - spent : 0
    }
  }).filter(item => item.budget > 0 || item.spent > 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Orçamentos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4" />
            <span>Definir Orçamento</span>
          </button>
        </div>

        {/* Add Budget Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Definir Orçamento Mensal
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Categoria
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Selecione uma categoria...</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Valor do Orçamento
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    placeholder="0,00"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Definir Orçamento
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setSelectedCategory('')
                    setBudgetAmount('')
                  }}
                  className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Budget Cards */}
        {categoryBudgets.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum orçamento definido
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Defina orçamentos mensais para suas categorias e acompanhe seus gastos
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Definir Primeiro Orçamento</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryBudgets.map((item, index) => (
              <motion.div
                key={item.category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border ${
                  item.isOverBudget 
                    ? 'border-red-200 dark:border-red-800' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.category.color }}
                    />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {item.category.name}
                    </h3>
                  </div>
                  {item.isOverBudget && (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Gasto</span>
                    <span className={`font-medium ${
                      item.isOverBudget 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {item.spent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Orçamento</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.budget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        item.isOverBudget 
                          ? 'bg-red-500' 
                          : item.percentage > 80 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className={`${
                      item.isOverBudget 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {item.percentage.toFixed(1)}% usado
                    </span>
                    <span className={`${
                      item.remaining < 0 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {item.remaining < 0 ? 'Excedeu em ' : 'Restam '}
                      {Math.abs(item.remaining).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>

                {item.isOverBudget && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-red-700 dark:text-red-400">
                        Orçamento ultrapassado!
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}