import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { userContext } from "../App";
import "../styles/newChatComponent.css";
export default function ChatAddForm() {
    const navigate = useNavigate();

    const [chats, setChats] = useState([]);
    const [username, setUserName] = useState("");
    const [curId, setCurId] = useContext(userContext);
    const [selectedId, setSelectedId] = useState(-1);
    let i = 0;
    const newChat = () => {
        axios
            .get("http://localhost:3001/getId", {
                params: { username: username },
            })
            .then((r) => {
                const id2 = r.data;
                axios
                    .post("http://localhost:3001/addChat", {
                        user1: curId,
                        user2: id2,
                    })
                    .then((response) => {
                        if (response.data === "success") {
                            // console.log("chat Created");
                            axios
                                .get("http://localhost:3001/allChats", {
                                    params: { user: curId },
                                })
                                .then((response2) => {
                                    // response.data.result.map((r) => console.log(`chat:${r}\n`));
                                    // console.log(response.data.result);
                                    setChats(response2.data.result);
                                });
                        } else {
                            if ((response.data = "error")) {
                                console.log("user couldn't be found");
                            }
                        }
                        // console.log(response.data);
                    });
            });
    };
    useEffect(() => {
        // console.log("hello");
        if (curId === 0) navigate("/");
        else
            axios
                .get("http://localhost:3001/allChats", {
                    params: { user: curId },
                })
                .then((response) => {
                    // response.data.result.map((r) => console.log(`chat:${r}\n`));
                    // if(response.data)
                    // console.log(response.data.result);
                    setChats(response.data.result);
                });
    }, []);
    return (
        <div className="container">
            <div className="contentContainer">
                <div className="chatListContainer">
                    {chats.map((r) => (
                        <div
                            key={r.id}
                            className={
                                selectedId === r.id
                                    ? "singleChatContainer selected"
                                    : "singleChatContainer"
                            }
                            onClick={() => {
                                navigate(`${r.id}`);
                                setSelectedId(r.id);
                            }}
                        >
                            chat with {r.u1name === curId ? r.u2name : r.u1name}
                        </div>
                    ))}
                    <div className="newchatForm">
                        <input
                            className="chatAddInput"
                            onChange={(e) => {
                                setUserName(e.target.value);
                            }}
                            placeholder="start a new chat "
                        ></input>
                        <div
                            className="newChatBtn"
                            onClick={() => {
                                if (username !== curId) newChat();
                            }}
                        >
                            +
                        </div>
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    );
}
