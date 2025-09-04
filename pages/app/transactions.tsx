import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useExpenses } from '@/contexts/ExpenseContext'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Edit, 
  Trash2,
  Calendar
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import toast from 'react-hot-toast'

export default function TransactionsPage() {
  const { user, isGuest, loading } = useAuth()
  const { transactions, categories, addTransaction, updateTransaction, deleteTransaction, exportData } = useExpenses()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category_id: '',
    subcategory: '',
    payment_method: 'Dinheiro',
    date: new Date().toISOString().split('T')[0]
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

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || transaction.category_id === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.amount || !formData.description || !formData.category_id) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    try {
      if (editingId) {
        await updateTransaction(editingId, {
          amount: parseFloat(formData.amount),
          description: formData.description,
          category_id: formData.category_id,
          subcategory: formData.subcategory || undefined,
          payment_method: formData.payment_method,
          date: formData.date
        })
        toast.success('Transação atualizada!')
        setEditingId(null)
      } else {
        await addTransaction({
          amount: parseFloat(formData.amount),
          description: formData.description,
          category_id: formData.category_id,
          subcategory: formData.subcategory || undefined,
          payment_method: formData.payment_method,
          tags: [],
          date: formData.date
        })
        toast.success('Transação adicionada!')
        setShowAddForm(false)
      }
      
      setFormData({
        amount: '',
        description: '',
        category_id: '',
        subcategory: '',
        payment_method: 'Dinheiro',
        date: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      toast.error('Erro ao salvar transação')
    }
  }

  const handleEdit = (transaction: any) => {
    setFormData({
      amount: transaction.amount.toString(),
      description: transaction.description,
      category_id: transaction.category_id,
      subcategory: transaction.subcategory || '',
      payment_method: transaction.payment_method,
      date: transaction.date
    })
    setEditingId(transaction.id)
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        await deleteTransaction(id)
        toast.success('Transação excluída!')
      } catch (error) {
        toast.error('Erro ao excluir transação')
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
              Transações
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie todos os seus gastos
            </p>
          </div>
          
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button
              onClick={exportData}
              className="inline-flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Transação</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por descrição..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full inline-flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors">
                <Filter className="w-4 h-4" />
                <span>Mais Filtros</span>
              </button>
            </div>
          </div>
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
              {editingId ? 'Editar Transação' : 'Nova Transação'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Valor *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Categoria *
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Selecione...</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Cartão de Débito">Cartão de Débito</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="PIX">PIX</option>
                    <option value="Transferência">Transferência</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descrição *
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ex: Almoço no restaurante"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subcategoria
                  </label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    placeholder="Opcional"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  {editingId ? 'Atualizar' : 'Adicionar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingId(null)
                    setFormData({
                      amount: '',
                      description: '',
                      category_id: '',
                      subcategory: '',
                      payment_method: 'Dinheiro',
                      date: new Date().toISOString().split('T')[0]
                    })
                  }}
                  className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Transactions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Pagamento
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center">
                        <Calendar className="w-12 h-12 mb-4 opacity-50" />
                        <p className="text-lg mb-2">Nenhuma transação encontrada</p>
                        <p className="text-sm">Adicione sua primeira transação para começar</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction, index) => {
                    const category = categories.find(c => c.id === transaction.category_id)
                    return (
                      <motion.tr
                        key={transaction.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            {transaction.subcategory && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {transaction.subcategory}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category?.color }}
                            />
                            <span className="text-gray-900 dark:text-white">
                              {category?.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {transaction.payment_method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-gray-900 dark:text-white">
                          {transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(transaction)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(transaction.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  )
}