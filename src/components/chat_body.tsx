import { Message } from '@/pages/app'

const ChatBody = ({ data }: { data: Message[] }) => {
    return (
        <>
            {data.map((msg: Message, idx: number) => {
                if (msg.type == 'recv') {
                    return (
                        <div
                            className="flex flex-col mt-2 w-full items-start"
                            key={idx}
                        >
                            <div className="text-sm text-black">
                                {msg.username}
                            </div>
                            <div>
                                <div className="bg-blue-500 text-white px-4 py-1 rounded-md inline-block mt-1">
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div
                            className="flex flex-col mt-2 w-full items-end"
                            key={idx}
                        >
                            <div className="text-sm text-black text-right">
                                {msg.username}
                            </div>
                            <div>
                                <div className="bg-slate-400 text-black px-4 py-1 rounded-md inline-block mt-1">
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    )
                }
            })}
        </>
    )
}

export default ChatBody
