const Chat = ({ descendingOrderMessages }) => {


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
                        <span className="date-stamp">{new Date(message.timestamp).toLocaleString("GB-English", { dateStyle: "medium", timeStyle: "short" })}</span>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Chat