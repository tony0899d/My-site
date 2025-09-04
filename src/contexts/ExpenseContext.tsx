import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

export interface Category {
  id: string
  name: string
  color: string
}

export interface Transaction {
  id: string
  amount: number
  description: string
  category_id: string
  subcategory?: string
  payment_method: string
  tags: string[]
  date: string
  created_at: string
}

export interface Budget {
  id: string
  category_id: string
  amount: number
  month: string
}

interface ExpenseContextType {
  transactions: Transaction[]
  categories: Category[]
  budgets: Budget[]
  loading: boolean
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at'>) => Promise<void>
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  setBudget: (categoryId: string, amount: number, month: string) => Promise<void>
  exportData: () => void
  importData: (file: File) => Promise<void>
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const { user, isGuest } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)

  // Default categories
  const defaultCategories: Category[] = [
    { id: '1', name: 'Alimentação', color: '#ef4444' },
    { id: '2', name: 'Transporte', color: '#3b82f6' },
    { id: '3', name: 'Lazer', color: '#8b5cf6' },
    { id: '4', name: 'Saúde', color: '#10b981' },
    { id: '5', name: 'Educação', color: '#f59e0b' },
    { id: '6', name: 'Casa', color: '#6b7280' },
    { id: '7', name: 'Outros', color: '#ec4899' }
  ]

  useEffect(() => {
    if (isGuest) {
      // Load guest data from localStorage
      const guestTransactions = localStorage.getItem('guestTransactions')
      const guestCategories = localStorage.getItem('guestCategories')
      const guestBudgets = localStorage.getItem('guestBudgets')

      setTransactions(guestTransactions ? JSON.parse(guestTransactions) : [])
      setCategories(guestCategories ? JSON.parse(guestCategories) : defaultCategories)
      setBudgets(guestBudgets ? JSON.parse(guestBudgets) : [])
      setLoading(false)
    } else if (user) {
      // Load user data from Supabase
      loadUserData()
    } else {
      setLoading(false)
    }
  }, [user, isGuest])

  const loadUserData = async () => {
    // This would load from Supabase in a real implementation
    // For now, using localStorage as fallback
    setTransactions([])
    setCategories(defaultCategories)
    setBudgets([])
    setLoading(false)
  }

  const saveGuestData = (newTransactions?: Transaction[], newCategories?: Category[], newBudgets?: Budget[]) => {
    if (isGuest) {
      if (newTransactions) localStorage.setItem('guestTransactions', JSON.stringify(newTransactions))
      if (newCategories) localStorage.setItem('guestCategories', JSON.stringify(newCategories))
      if (newBudgets) localStorage.setItem('guestBudgets', JSON.stringify(newBudgets))
    }
  }

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    }

    const newTransactions = [...transactions, newTransaction]
    setTransactions(newTransactions)
    saveGuestData(newTransactions)
  }

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    const newTransactions = transactions.map(t => 
      t.id === id ? { ...t, ...updates } : t
    )
    setTransactions(newTransactions)
    saveGuestData(newTransactions)
  }

  const deleteTransaction = async (id: string) => {
    const newTransactions = transactions.filter(t => t.id !== id)
    setTransactions(newTransactions)
    saveGuestData(newTransactions)
  }

  const addCategory = async (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString()
    }
    const newCategories = [...categories, newCategory]
    setCategories(newCategories)
    saveGuestData(undefined, newCategories)
  }

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const newCategories = categories.map(c => 
      c.id === id ? { ...c, ...updates } : c
    )
    setCategories(newCategories)
    saveGuestData(undefined, newCategories)
  }

  const deleteCategory = async (id: string) => {
    const newCategories = categories.filter(c => c.id !== id)
    setCategories(newCategories)
    saveGuestData(undefined, newCategories)
  }

  const setBudget = async (categoryId: string, amount: number, month: string) => {
    const existingBudget = budgets.find(b => b.category_id === categoryId && b.month === month)
    
    if (existingBudget) {
      const newBudgets = budgets.map(b => 
        b.id === existingBudget.id ? { ...b, amount } : b
      )
      setBudgets(newBudgets)
      saveGuestData(undefined, undefined, newBudgets)
    } else {
      const newBudget: Budget = {
        id: Date.now().toString(),
        category_id: categoryId,
        amount,
        month
      }
      const newBudgets = [...budgets, newBudget]
      setBudgets(newBudgets)
      saveGuestData(undefined, undefined, newBudgets)
    }
  }

  const exportData = () => {
    const data = {
      transactions,
      categories,
      budgets,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gastos-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = async (file: File) => {
    const text = await file.text()
    const data = JSON.parse(text)
    
    if (data.transactions) setTransactions(data.transactions)
    if (data.categories) setCategories(data.categories)
    if (data.budgets) setBudgets(data.budgets)
    
    saveGuestData(data.transactions, data.categories, data.budgets)
  }

  return (
    <ExpenseContext.Provider value={{
      transactions,
      categories,
      budgets,
      loading,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addCategory,
      updateCategory,
      deleteCategory,
      setBudget,
      exportData,
      importData
    }}>
      {children}
    </ExpenseContext.Provider>
  )
}

export function useExpenses() {
  const context = useContext(ExpenseContext)
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider')
  }
  return context
}