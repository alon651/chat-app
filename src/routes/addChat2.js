import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { userContext } from "../App";
import "../styles/newChatComponent.css";
export default function ChatAddForm() {
    const [chats, setChats] = useState([]);
    const [username, setUserName] = useState("");
    const [curUser, setCurUser] = useContext(userContext);
    let i = 0;
    const [id, setId] = useState(0);
    const newChat = () => {
        axios
            .post("http://localhost:3001/addChat", {
                user1: curUser,
                user2: username,
            })
            .then((response) => {
                if (response.data === "success") {
                    console.log("chat Created");
                    axios
                        .get("http://localhost:3001/allChats", {
                            params: { user: curUser },
                        })
                        .then((response) => {
                            // response.data.result.map((r) => console.log(`chat:${r}\n`));
                            console.log(response.data.result);
                            setChats(response.data.result);
                        });
                } else {
                    if ((response.data = "error")) {
                        console.log("user didn't found");
                    }
                }
                console.log(response.data);
            });
    };
    useEffect(() => {
        // console.log("hello");
        axios
            .get("http://localhost:3001/allChats", {
                params: { user: curUser },
            })
            .then((response) => {
                // response.data.result.map((r) => console.log(`chat:${r}\n`));
                // if(response.data)
                console.log(response.data.result);
                setChats(response.data.result);
                axios
                    .get("http://localhost:3001/getId", {
                        params: { user: curUser },
                    })
                    .then((response2) => {
                        console.log(response2.data);
                        setId(parseInt(response2.data));
                    });
            });
    }, []);
    return (
        <div className="newChatForm">
            <input
                className="newchatInput"
                type="text"
                placeholder="enter friend's username here"
                onChange={(e) => setUserName(e.target.value)}
            />
            <button
                className="newchatBtn"
                onClick={() => {
                    if (username !== curUser) newChat();
                }}
            >
                create a new chat
            </button>
            <ul className="chatsContainer">
                {chats.map((r) => (
                    <li key={(i += 1)}>
                        <Link to={`/chats/${r.id}`}>
                            <div className="chatFrame">
                                chat with{" "}
                                {r.u1name === curUser ? r.u2name : r.u1name}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
            <Outlet />
        </div>
    );
}
