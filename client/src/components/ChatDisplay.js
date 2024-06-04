import axios from "axios"
import Chat from "./Chat"
import ChatInput from "./ChatInput"
import { useEffect, useState } from "react"
import ClickedProfileModal from "./ClickedProfileModal"
import {  FaUserCircle } from "react-icons/fa"

const ChatDisplay = ({ user, clickedUser }) => {

    const [usersMessages, setUsersMessages] = useState(null);
    const [clickedUsersMessages, setClickedUsersMessages] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const userId = user?.user_id;
    const clickedUserId = clickedUser?.user_id;

    const getUsersMessages = async () => {
        try {
            const response = await axios.get('http://localhost:4000/messages', {
                params: { userId: userId, correspondingUserId: clickedUserId }
            })
            setUsersMessages(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getClickedUsersMessages = async () => {
        try {
            const response = await axios.get('http://localhost:4000/messages', {
                params: { userId: clickedUserId, correspondingUserId: userId }
            })
            setClickedUsersMessages(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUsersMessages()
        getClickedUsersMessages()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const messages = []

    usersMessages?.forEach(message => {
        const formattedMessage = {}
        formattedMessage['name'] = user?.first_name
        formattedMessage['img'] = user?.url
        formattedMessage['message'] = message.message
        formattedMessage['timestamp'] = message.timestamp
        messages.push(formattedMessage)
    })

    clickedUsersMessages?.forEach(message => {
        const formattedMessage = {}
        formattedMessage['name'] = clickedUser?.first_name
        formattedMessage['img'] = clickedUser?.url
        formattedMessage['message'] = message.message
        formattedMessage['timestamp'] = message.timestamp
        messages.push(formattedMessage)
    })

    const descendingOrderMessages = messages?.sort((a, b) => a.timestamp.localeCompare(b.timestamp));


    const handleClick = () => {
        setShowModal(true)
    }


    return (
        <>
            <p onClick={handleClick} className="info-user-chat">See {clickedUser.first_name} profile <FaUserCircle/></p>
            {showModal && (
                <ClickedProfileModal setShowModal={setShowModal} clickedUser={clickedUser} />
            )}
            <Chat
                user={user}
                clickedUser={clickedUser}
                descendingOrderMessages={descendingOrderMessages} />
            <ChatInput
                user={user}
                clickedUser={clickedUser}
                getUserMessages={getUsersMessages}
                getClickedUsersMessages={getClickedUsersMessages} />
        </>
    )
}

export default ChatDisplay