import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { userContext } from "../App";
import axios from "axios";
import socket from "../socket";
import { v4 as uuidv4 } from "uuid";

export default function Chat() {
    const params = useParams();
    const chatId = params.chatId;
    const [curUser, setCurUser] = useContext(userContext);
    const [curId, setCurId] = useState();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [user2_id, setUser2_id] = useState(11);
    const [tmpMessages, settmpMessages] = useState([]);
    // console.log(chatId);
    useEffect(() => {
        console.log(curUser);
        axios
            .get("http://localhost:3001/getId", {
                params: { username: curUser },
            })
            .then((r) => {
                console.log(r);
                setCurId(r.data.id);
                console.log("id: ", curId);
                axios
                    .get("http://localhost:3001/chatDetails", {
                        params: {
                            id: chatId,
                        },
                    })
                    .then((response) => {
                        // console.log(response.data);
                        setMessages(response.data);
                        axios
                            .get("http://localhost:3001/usersInChat", {
                                params: { chat_id: chatId },
                            })
                            .then((response2) => {
                                response2.data.user1_id === curId
                                    ? setUser2_id(response2.data.user2_id)
                                    : setUser2_id(response2.data.user1_id);
                                // settmpMessages([]);
                            });
                    });
            });
        socket.on("receive-message", (msg) => {
            receiveMessage(msg);
        });
        socket.emit("join-room", chatId);
        console.log("joined room");
    }, [chatId]);
    const sendMsg = () => {
        axios
            .post("http://localhost:3001/sendMessage", {
                chat: chatId,
                sender: curId,
                receiver: user2_id,
                content: message,
            })
            .then((response) => {
                if (response.data === "err") console.log("message sent");
                setMessage("");
            });
        const sendedMessage = {
            chat: chatId,
            sender_id: curId,
            receiver_id: user2_id,
            content: message,
        };
        console.log("before", tmpMessages);
        settmpMessages([...tmpMessages, sendedMessage]);

        socket.emit("updateMessages", sendedMessage, chatId);
    };
    const receiveMessage = (msg) => {
        console.log(curId, msg.sender_id);
        if (curId !== msg.sender_id) {
            settmpMessages([...tmpMessages, msg]);
            console.log("comparison was false");
        } else {
            console.log("comparison was true");
        }
    };

    return (
        <div className="chatContainer">
            <div className="messagesContainer">
                {messages.map((r) => (
                    <div
                        key={uuidv4()}
                        className={
                            r.sender_id === curId
                                ? "message sent"
                                : "message received"
                        }
                    >
                        {r.content}
                    </div>
                ))}
                {tmpMessages.map((r) => (
                    <div
                        key={uuidv4()}
                        className={
                            r.sender_id === curId
                                ? "message sent"
                                : "message received"
                        }
                    >
                        {r.content}
                    </div>
                ))}
            </div>
            <div className="newMessageForm">
                <input
                    className="messageInput"
                    type="text"
                    placeholder="type your message here"
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                />
                <input
                    className="messageBtn"
                    type="button"
                    value="send!"
                    onClick={sendMsg}
                />
            </div>
        </div>
    );
}
