import axios from "axios";
import { useContext, useState } from "react";
import "../styles/login.css";
import { userContext } from "../App.js";
import { Link, redirect, useNavigate } from "react-router-dom";
import socket from "../socket";
export default function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loginErr, setLoginErr] = useState(false);
    const [curId, setCurId] = useContext(userContext);
    const navigate = useNavigate();
    // console.log(curUser);
    const logIn = () => {
        axios
            .get("http://localhost:3001/verifyLogin", {
                params: { username: userName, password: password },
            })
            .then((response) => {
                console.log(response.data);
                if (response.data !== "failure") {
                    console.log("success");
                    setCurId(response.data);
                    setLoginErr(false);
                    socket.auth = { curId };
                    socket.connect();
                    navigate("/chats");
                } else {
                    console.log("wrong password please try again");
                    setLoginErr(true);
                }
            });
        socket.on("connect", () => {
            console.log(socket.id);
        });
    };
    const logInBtn = () => {
        axios
            .get("http://localhost:3001/countByUserName", {
                params: { username: userName },
            })
            .then((response) => {
                if (response.data[0].nameCount === 1) {
                    logIn();
                } else {
                    console.log("username doesn't exist");
                    setLoginErr(true);
                }
            });
    };
    return (
        <div className="registerScreen">
            <div className="registerForm">
                <h1>log in</h1>
                <h2 className={`errorMsg ${loginErr ? "displayed" : ""}`}>
                    invalid username or password
                </h2>
                <label>user name:</label>
                <input
                    type="text"
                    onChange={(e) => setUserName(e.target.value)}
                />
                <label>password</label>
                <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={logInBtn}>sign in</button>
            </div>
        </div>
    );
}
