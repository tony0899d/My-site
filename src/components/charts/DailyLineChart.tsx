import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useExpenses } from '@/contexts/ExpenseContext'
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { motion } from 'framer-motion'

export default function DailyLineChart() {
  const { transactions } = useExpenses()

  const currentMonth = new Date()
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  })

  const dailyData = daysInMonth.map(day => {
    const dayStr = day.toISOString().split('T')[0]
    const dayTransactions = transactions.filter(t => t.date === dayStr)
    const total = dayTransactions.reduce((sum, t) => sum + t.amount, 0)

    return {
      day: format(day, 'd'),
      total,
      fullDate: format(day, "d 'de' MMMM", { locale: ptBR })
    }
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{data.payload.fullDate}</p>
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
        Evolução Diária do Mês
      </h3>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="h-80"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="day" 
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis 
              className="text-gray-600 dark:text-gray-400"
              tickFormatter={(value) => 
                value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}