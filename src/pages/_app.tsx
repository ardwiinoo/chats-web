import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import AuthContextProvider from '@/modules/auth_provider'
import WSProvider from '@/modules/ws_provider'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <AuthContextProvider>
                <WSProvider>
                    <div className="flex flex-col md:flex-row h-full min-h-screen font-sans bg-white">
                        <Component {...pageProps} />
                    </div>
                </WSProvider>
            </AuthContextProvider>
        </>
    )
}
