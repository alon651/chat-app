import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

export default function Chat() {
    const params = useParams();
    const chatId = params.chatId;
    console.log(chatId);
    useEffect(() => {
        axios
            .get("http://localhost:3001/chatDetails", {
                params: {
                    id: chatId,
                },
            })
            .then((response) => {
                console.log(response);
            });
    });
    return <div>chat number {chatId}</div>;
}
