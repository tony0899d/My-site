import type { AppProps } from 'next/app'
import { AuthProvider } from '@/contexts/AuthContext'
import { ExpenseProvider } from '@/contexts/ExpenseContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Layout from '@/components/Layout'
import { Toaster } from 'react-hot-toast'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ExpenseProvider>
          <Layout>
            <Component {...pageProps} />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                  border: '1px solid var(--toast-border)'
                }
              }}
            />
          </Layout>
        </ExpenseProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}