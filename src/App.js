import "./App.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import socket from "./socket";

export const userContext = React.createContext("none");
function App() {
    useEffect(() => {
        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
    }, []);
    const [curUser, setCurUser] = useState("none");
    const value = [curUser, setCurUser];
    const navigate = useNavigate();
    // const curUser = useContext(userContext);
    let userMsg;
    const logout = () => {
        setCurUser("none");
        navigate("/");
    };
    if (curUser === "none") {
        userMsg = (
            <div className="userBtn">
                <Link to="/register" className="userInfo">
                    register
                </Link>
                <Link to="/login" className="userInfo">
                    login
                </Link>
            </div>
        );
    } else {
        userMsg = (
            <div className="userBtn">
                hello {curUser}
                <div onClick={logout}>logout</div>
            </div>
        );
    }
    return (
        <userContext.Provider value={value}>
            <div className="App">
                <header className="headerBar">
                    <Link to="/" className="logo">
                        logo
                    </Link>
                    {userMsg}
                </header>
                <Outlet />
            </div>
        </userContext.Provider>
    );
}

export default App;
