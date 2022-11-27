import "../styles/register.css";
import { useContext, useState } from "react";
import axios from "axios";
import { userContext } from "../App.js";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [curUser, setCurUser] = useContext(userContext);
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const submitBtn = () => {
        axios
            .get("http://localhost:3001/countByUserName", {
                params: { username: userName },
            })
            .then((response) => {
                if (response.data[0].nameCount === 0) {
                    submitInfo();
                } else {
                    console.log("error");
                }
            });
    };
    const submitInfo = () => {
        console.log(`user name:${userName} password: ${password}`);
        axios
            .post("http://localhost:3001/addUser", {
                username: userName,
                password: password,
            })
            // .then(console.log(`user - ${userName} was registered`));
            .then(() => {
                setCurUser(userName);
                navigate("/chats");
            });
    };
    return (
        <div className="registerScreen">
            <div className="registerForm">
                <h1>Register</h1>
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
                <button onClick={submitBtn}>sign up</button>
            </div>
        </div>
    );
}
