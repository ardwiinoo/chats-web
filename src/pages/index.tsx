import { API_URL, WEBSOCKET_URL } from '@/constants'
import { AuthContext } from '@/modules/auth_provider'
import { WSContext } from '@/modules/ws_provider'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export default function Index() {
    const [rooms, setRooms] = useState<{ id: string; name: string }[]>([])
    const [roomName, setRoomName] = useState('')
    const { user } = useContext(AuthContext)
    const { setConn } = useContext(WSContext)

    const router = useRouter()

    const getRooms = async () => {
        try {
            const res = await fetch(`${API_URL}/ws/get-rooms`, {
                method: 'GET',
            })

            const data = await res.json()
            if (res.ok) {
                setRooms(data)
            }
        } catch (err) {
            console.error('Error getrooms: ', err)
        }
    }

    useEffect(() => {
        getRooms()
    }, [])

    const submitHandler = async (e: React.SyntheticEvent) => {
        e.preventDefault()

        try {
            setRoomName('')
            const res = await fetch(`${API_URL}/ws/create-room`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: uuidv4(),
                    name: roomName,
                }),
            })

            if (res.ok) {
                getRooms()
            }
        } catch (err) {
            console.error('Error home: ', err)
        }
    }

    const joinRoom = (roomId: string) => {
        const ws = new WebSocket(
            `${WEBSOCKET_URL}/ws/join-room/${roomId}?userId=${user.id}&username=${user.username}`
        )

        if (ws.OPEN) {
            setConn(ws)
            router.push('/app')
        }
    }

    return (
        <>
            <div className="my-8 px-4 md:mx-32 w-full h-full">
                <div className="flex justify-center mt-3 p-5">
                    <input
                        type="text"
                        name=""
                        id=""
                        className="border border-grey p-2 rounded-md focus:outline-none focus:border-blue-500 text-black"
                        placeholder="Room name.."
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white rounded-md p-2 md:ml-4 hover:bg-black"
                        onClick={submitHandler}
                    >
                        Create Room
                    </button>
                </div>

                {/* display rooms */}
                <div className="mt-6">
                    <div className="font-bold text-black">Available Rooms</div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
                        {rooms.map((room, index) => (
                            <div
                                key={index}
                                className="border border-blue-500 p-4 flex items-center rounded-md w-full"
                            >
                                <div className="w-full">
                                    <div className="text-sm text-black">
                                        room
                                    </div>
                                    <div className="text-blue font-bold text-lg text-blue-500">
                                        {room.name}
                                    </div>
                                </div>
                                <div className="">
                                    <button
                                        className="px-4 p-1 text-white bg-blue-500 hover:bg-black rounded-md"
                                        onClick={() => joinRoom(room.id)}
                                    >
                                        join
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
