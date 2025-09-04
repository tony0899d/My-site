import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Shield, Code, Star } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900 px-4 py-2 rounded-full mb-6">
            <Heart className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <span className="text-primary-600 dark:text-primary-400 font-medium">
              Criado com carinho por Tony
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Sobre o Projeto
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Um sistema simples e eficiente para controle de gastos pessoais, 
            desenvolvido para ser gratuito e de uso totalmente privado.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center"
          >
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg w-fit mx-auto mb-4">
              <Star className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              100% Gratuito
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Sem custos ocultos, sem assinaturas, sem pegadinhas. 
              Use quantas vezes quiser, para sempre.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center"
          >
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg w-fit mx-auto mb-4">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Privacidade Total
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Seus dados são seus. Não compartilhamos, não vendemos, 
              não analisamos para fins comerciais.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center"
          >
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg w-fit mx-auto mb-4">
              <Code className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Código Aberto
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Desenvolvido com tecnologias modernas e boas práticas 
              de desenvolvimento web.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Sobre o Desenvolvedor
          </h2>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">T</span>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Tony
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Desenvolvedor apaixonado por criar soluções simples e eficientes para problemas do dia a dia. 
              Este projeto nasceu da necessidade pessoal de ter um controle de gastos que fosse realmente 
              fácil de usar e que respeitasse a privacidade dos dados.
            </p>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Tecnologias Utilizadas
              </h4>
              <div className="flex flex-wrap justify-center gap-2">
                {['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Framer Motion', 'Recharts'].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Este projeto é totalmente gratuito e de código aberto
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link
              href="/auth/register"
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <span>Começar Agora</span>
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <span>Voltar ao Início</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}