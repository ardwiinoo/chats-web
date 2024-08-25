import { useContext, useState, useEffect } from 'react'
import { API_URL } from '@/constants'
import { useRouter } from 'next/router'
import { AuthContext, UserInfo } from '@/modules/auth_provider'

export default function Index() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { authenticated } = useContext(AuthContext)

    const router = useRouter()

    useEffect(() => {
        if (authenticated) {
            router.push('/')
            return
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authenticated])

    const submitHandler = async (e: React.SyntheticEvent) => {
        e.preventDefault()

        try {
            const res = await fetch(`${API_URL}/api/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()
            if (res.ok) {
                const user: UserInfo = {
                    username: data.username,
                    id: data.id,
                }

                // not safe, change it later
                localStorage.setItem('user_info', JSON.stringify(user))

                return router.push('/')
            }
        } catch (err) {
            console.error('Error login: ', err)
        }
    }

    return (
        <div className="flex items-center justify-center min-w-full min-h-screen bg-white">
            <form action="" className="flex flex-col md:w-1/5">
                <div className="text-3xl font-bold text-center">
                    <h1 className="text-blue-500">
                        Chats <span className="text-black">Web</span>
                    </h1>
                </div>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email..."
                    className="p-3 mt-8 rounded-md border-2 border-grey focus:outline-none focus:border-blue-500 text-black"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password..."
                    className="p-3 mt-4 rounded-md border-2 border-grey focus:outline-none focus:border-blue-500 text-black"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="p-3 mt-6 rounded-md bg-blue-500 font-bold text-white hover:bg-black"
                    onClick={submitHandler}
                >
                    Login
                </button>
            </form>
        </div>
    )
}
