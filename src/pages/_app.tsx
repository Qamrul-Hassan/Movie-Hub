import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { store } from '@/store'
import '@/app/globals.css'
import Navbar from '@/components/Navbar'

export default function PagesApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-grow px-3 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
          <Component {...pageProps} />
        </div>
        <footer className="border-t border-gray-200 bg-background p-6 text-center text-gray-500 dark:border-gray-700">
          &copy; {new Date().getFullYear()} Movie App. All rights reserved.
        </footer>
      </div>
    </Provider>
  )
}
