
import { useEffect, useState } from 'react'
import ChatContainer from '../components/ChatContainer'
import { useCookies } from 'react-cookie'
import axios from 'axios'

const Dashboard = () => {
    const [cookies] = useCookies(['user'])
    const [user, setUser] = useState(null)
    const userId = cookies.UserId

    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:4000/user', {
                params: { userId }
            })
            setUser(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    
    useEffect(() => {
        getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    return (
        <>
            {user &&
                <div>
                    <div className="chat-container" >
                        <ChatContainer user={user} />
                    </div>
                </div>
            }
        </>
    )
}
export default Dashboard