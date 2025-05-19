// pages/_app.tsx
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { DataProvider } from '@/context/DataContext'
import { WebSocketProvider } from '@/context/WebSocketContext'
import { Toaster } from '@/components/ui/toaster'
import AuthLayout from '@/components/layouts/AuthLayout'
import Navbar from '@/components/navbar'
import List from '@/components/list'
import Foot from '@/components/foot'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isAuthPage = router.pathname === '/login/signin' || router.pathname === '/login/signup'

  return (
    <DataProvider>
      <WebSocketProvider>
        <AuthLayout>
          {isAuthPage ? (
            <>
              <Component {...pageProps} />
              <Toaster />
            </>
          ) : (
            <div className="min-h-screen bg-gradient-to-br from-[#101624] via-[#111827] to-[#181f2a]">
              <Navbar />
              <div className="flex">
                <List />
                <main className="flex-1 min-h-screen flex flex-col items-center">
                  <Component {...pageProps} />
                </main>
              </div>
              <Foot />
              <Toaster />
            </div>
          )}
        </AuthLayout>
      </WebSocketProvider>
    </DataProvider>
  )
}