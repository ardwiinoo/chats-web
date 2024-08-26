import { createContext, useState } from 'react'

type Conn = WebSocket | null

export const WSContext = createContext<{
    conn: Conn
    setConn: (c: Conn) => void
}>({
    conn: null,
    setConn: () => {},
})

const WSProvider = ({ children }: { children: React.ReactNode }) => {
    const [conn, setConn] = useState<Conn>(null)

    return (
        <WSContext.Provider
            value={{
                conn: conn,
                setConn: setConn,
            }}
        >
            {children}
        </WSContext.Provider>
    )
}

export default WSProvider
