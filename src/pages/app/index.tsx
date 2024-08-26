import { useContext, useEffect, useRef, useState } from 'react'
import ChatBody from './../../components/chat_body'
import { WSContext } from '@/modules/ws_provider'
import { useRouter } from 'next/router'
import { API_URL } from '@/constants'
import autosize from 'autosize'
import { AuthContext } from '@/modules/auth_provider'

export type Message = {
    content: string
    client_id: string
    username: string
    room_id: string
    type: 'recv' | 'self'
}

const Index = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [users, setUsers] = useState<{ username: string }[]>([])
    const textarea = useRef<HTMLTextAreaElement>(null)
    const { conn } = useContext(WSContext)
    const { user } = useContext(AuthContext)

    const router = useRouter()

    useEffect(() => {
        if (conn === null) {
            router.push('/')
            return
        }

        const roomId = conn.url.split('/')[5] // get roomId

        async function getUsers() {
            try {
                const res = await fetch(`${API_URL}/ws/get-clients/${roomId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })

                const data = await res.json()
                if (res.ok) {
                    setUsers(data)
                }
            } catch (err) {
                console.error('Error app get users: ', err)
            }
        }

        getUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (textarea.current) {
            autosize(textarea.current)
        }

        if (conn === null) {
            router.push('/')
            return
        }

        conn.onmessage = (msg) => {
            const m: Message = JSON.parse(msg.data)

            if (m.content == 'A new user has join the room') {
                setUsers([...users, { username: m.username }])
            }

            if (m.content == 'user left the chat') {
                const deleteUser = users.filter(
                    (user) => user.username != m.username
                )
                setUsers([...deleteUser])
                setMessages([...messages, m])
                return
            }

            user?.username == m.username ? (m.type = 'self') : (m.type = 'recv')
            setMessages([...messages, m])
        }

        conn.onclose = () => {}
        conn.onerror = () => {}
        conn.onopen = () => {}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [textarea, messages, conn, users])

    const submitHandler = () => {
        if (!textarea.current?.value) return
        if (conn === null) {
            router.push('/')
            return
        }

        conn.send(textarea.current.value)
        textarea.current.value = ''
    }

    return (
        <>
            <div className="flex flex-col w-full">
                <div className="p-4 md:mx-6 mb-14">
                    <ChatBody data={messages} />
                </div>
                <div className="fixed bottom-0 mt-4 w-full">
                    <div className="flex md:flex-row px-4 py-2 bg-grey md:mx-4 rounded-md">
                        <div className="flex w-full mr-4 rounded-md border border-blue-500">
                            <textarea
                                ref={textarea}
                                name="textarea"
                                id="textarea"
                                placeholder="Type message..."
                                className="w-full h-10 p-2 rounded-md focus:outline-none text-black"
                                style={{ resize: 'none' }}
                            ></textarea>
                        </div>
                        <div className="flex items-center">
                            <button
                                className="p-2 rounded-md bg-blue-500 text-white"
                                onClick={submitHandler}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Index
