import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useExpenses } from '@/contexts/ExpenseContext'
import { startOfMonth, endOfMonth } from 'date-fns'
import { motion } from 'framer-motion'

export default function CategoryPieChart() {
  const { transactions, categories } = useExpenses()

  const currentMonth = new Date()
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date)
    return transactionDate >= startOfMonth(currentMonth) && transactionDate <= endOfMonth(currentMonth)
  })

  const categoryTotals = categories.map(category => {
    const total = currentMonthTransactions
      .filter(t => t.category_id === category.id)
      .reduce((sum, t) => sum + t.amount, 0)
    
    return {
      name: category.name,
      value: total,
      color: category.color
    }
  }).filter(item => item.value > 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Gastos por Categoria
      </h3>
      
      {categoryTotals.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryTotals}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
              >
                {categoryTotals.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      ) : (
        <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <p className="text-lg mb-2">Nenhum gasto registrado</p>
            <p className="text-sm">Adicione seus primeiros gastos para ver os gráficos</p>
          </div>
        </div>
      )}
    </div>
  )
}