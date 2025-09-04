import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useExpenses } from '@/contexts/ExpenseContext'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Tag, Plus, Edit, Trash2, Palette } from 'lucide-react'
import toast from 'react-hot-toast'

const colorOptions = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#6b7280'
]

export default function CategoriesPage() {
  const { user, isGuest, loading } = useAuth()
  const { categories, addCategory, updateCategory, deleteCategory } = useExpenses()
  const router = useRouter()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    color: colorOptions[0]
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name) {
      toast.error('Digite o nome da categoria')
      return
    }

    try {
      if (editingId) {
        await updateCategory(editingId, formData)
        toast.success('Categoria atualizada!')
        setEditingId(null)
      } else {
        await addCategory(formData)
        toast.success('Categoria criada!')
      }
      
      setShowAddForm(false)
      setFormData({ name: '', color: colorOptions[0] })
    } catch (error) {
      toast.error('Erro ao salvar categoria')
    }
  }

  const handleEdit = (category: any) => {
    setFormData({
      name: category.name,
      color: category.color
    })
    setEditingId(category.id)
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await deleteCategory(id)
        toast.success('Categoria excluída!')
      } catch (error) {
        toast.error('Erro ao excluir categoria')
      }
    }
  }

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
              Categorias
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Organize seus gastos por categorias personalizadas
            </p>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Categoria</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingId ? 'Editar Categoria' : 'Nova Categoria'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome da Categoria
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Alimentação"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cor
                  </label>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-8 h-8 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: formData.color }}
                    />
                    <select
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {colorOptions.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  {editingId ? 'Atualizar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingId(null)
                    setFormData({ name: '', color: colorOptions[0] })
                  }}
                  className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-6 h-6 rounded-lg"
                    style={{ backgroundColor: category.color }}
                  />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Palette className="w-4 h-4" />
                <span>{category.color}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}