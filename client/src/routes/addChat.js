import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { userContext } from "../App";
import "../styles/newChatComponent.css";
export default function ChatAddForm() {
    const navigate = useNavigate();

    const [chats, setChats] = useState([]);
    const [username, setUserName] = useState("");
    const [curUser, setCurUser] = useContext(userContext);
    const [selectedId, setSelectedId] = useState(-1);
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
                    // console.log("chat Created");
                    axios
                        .get("http://localhost:3001/allChats", {
                            params: { user: curUser },
                        })
                        .then((response) => {
                            // response.data.result.map((r) => console.log(`chat:${r}\n`));
                            // console.log(response.data.result);
                            setChats(response.data.result);
                        });
                } else {
                    if ((response.data = "error")) {
                        console.log("user couldn't be found");
                    }
                }
                // console.log(response.data);
            });
    };
    useEffect(() => {
        // console.log("hello");
        if (curUser === "none") navigate("/");
        else
            axios
                .get("http://localhost:3001/allChats", {
                    params: { user: curUser },
                })
                .then((response) => {
                    // response.data.result.map((r) => console.log(`chat:${r}\n`));
                    // if(response.data)
                    // console.log(response.data.result);
                    setChats(response.data.result);
                    axios
                        .get("http://localhost:3001/getId", {
                            params: { user: curUser },
                        })
                        .then((response2) => {
                            // console.log(response2.data);
                            setId(parseInt(response2.data));
                        });
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
                            chat with{" "}
                            {r.u1name === curUser ? r.u2name : r.u1name}
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
                                if (username !== curUser) newChat();
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
