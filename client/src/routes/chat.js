import { useParams } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import { userContext } from "../App";
import axios from "axios";
import socket from "../socket";
import { v4 as uuidv4 } from "uuid";

export default function Chat() {
    const params = useParams();
    const chatId = params.chatId;
    const [curId, setCurId] = useContext(userContext);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [user2_id, setUser2_id] = useState(11);
    const [tmpMessages, settmpMessages] = useState([]);
    const tmpMessagesRef = useRef([]);
    tmpMessagesRef.current = tmpMessages;
    // console.log(chatId);
    useEffect(() => {
        settmpMessages([]);

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
                        socket.emit("join-room", chatId);
                        console.log("joined room");
                        console.log("changed id");
                    });
            });
    }, [chatId]);
    useEffect(() => {
        socket.on("receive-message", (msg) => {
            receiveMessage(msg);
        });
    }, []);
    const sendMsg = () => {
        axios
            .post("http://localhost:3001/sendMessage", {
                chat: chatId,
                sender: curId,
                receiver: user2_id,
                content: message,
            })
            .then((response) => {
                if (response.data !== "err") {
                    console.log("message sent");
                    setMessage("");
                    const sendedMessage = {
                        chat: chatId,
                        sender_id: curId,
                        receiver_id: user2_id,
                        content: message,
                    };
                    socket.emit("updateMessages", sendedMessage, chatId);
                }
            });
    };
    const receiveMessage = (msg) => {
        settmpMessages([...tmpMessagesRef.current, msg]);
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
