// import axios from "axios"


const Chat = ({ user, descendingOrderMessages }) => {


    // const deleteMessage = async (userId, messageId) => {
    //     if (user.user_id === userId) {
    //         console.log('ok para borrar')
    //         try {
    //             const response = await axios.delete(`http://localhost:4000/messages?id=` + messageId)
    //             console.log(response.data)
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     } else {
    //         console.log('no se puede eliminar')
    //     }
    // }

    return (
        <>
            <div className="chat-display">
                {descendingOrderMessages.map((message, _index) => (
                    <div className="chat-wrapper" key={_index}>
                        <div className="chat-display-container" >
                            <div>
                                <div className="chat-img-container">
                                    <img src={message.img} alt={message.name + ' profile'} />
                                </div>
                            </div>
                            <div className="chat-message-text">
                                <p className="chat-name-sender">{message.name}</p>
                                <p>{message.message}</p>
                            </div>
                        </div>
                        <div>
                            <span className="date-stamp">{new Date(message.timestamp).toLocaleString("GB-English", { dateStyle: "medium", timeStyle: "short" })}</span>
                            {/* <button onClick={() => deleteMessage(message.from_userId, message._id)}>Delete</button> */}
                        </div>

                    </div>
                ))}
            </div>
        </>
    )
}

export default Chat