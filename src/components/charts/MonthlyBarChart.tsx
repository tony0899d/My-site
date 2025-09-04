import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useExpenses } from '@/contexts/ExpenseContext'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { motion } from 'framer-motion'

export default function MonthlyBarChart() {
  const { transactions } = useExpenses()

  const months = Array.from({ length: 6 }, (_, i) => subMonths(new Date(), 5 - i))

  const monthlyData = months.map(month => {
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate >= startOfMonth(month) && transactionDate <= endOfMonth(month)
    })

    const total = monthTransactions.reduce((sum, t) => sum + t.amount, 0)

    return {
      month: format(month, 'MMM', { locale: ptBR }),
      total,
      fullMonth: format(month, "MMMM 'de' yyyy", { locale: ptBR })
    }
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{data.payload.fullMonth}</p>
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
        Comparação Mensal
      </h3>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="h-80"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="month" 
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis 
              className="text-gray-600 dark:text-gray-400"
              tickFormatter={(value) => 
                value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="total" 
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}