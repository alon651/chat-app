const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const http = require("http");
const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

server.listen(3001, () => console.log("running on port 3001"));
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("updateMessages", (message, chatId) => {
        socket.to(chatId).emit("receive-message", message);
    });

    socket.on("join-room", (room) => {
        [...socket.rooms].map((r) => socket.leave(r));
        socket.join(room);
        console.log("rooms ", room);
    });
});

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "root123",
    database: "chatapp",
});

app.post("/addUser", (req, res) => {
    console.log("got post request to /addUser");
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "INSERT INTO users (username,password) VALUES (?,?)",
        [username, password],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("success");
            }
        }
    );
});

app.get("/countByUserName", (req, res) => {
    const username = req.query.username;
    console.log(username);
    db.query(
        "SELECT COUNT(username) AS nameCount FROM users WHERE username=?",
        [username],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/verifyLogin", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    db.query(
        "SELECT password FROM users WHERE username=?",
        [username],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (password === result[0].password) {
                    res.send("success");
                } else {
                    res.send("failure");
                }
                console.log(result[0].password);
            }
        }
    );
});
function insertChat(user1, user2, res) {
    db.query(
        "INSERT INTO chat (user1_id,user2_id) VALUES (?,?)",
        [user1, user2],
        (err2, result2) => {
            if (err2) {
                res.send("failure");
            } else {
                res.send("success");
            }
        }
    );
}
app.post("/addChat", (req, res) => {
    const user1 = req.body.user1;
    const user2 = req.body.user2;
    console.log(`chat created between ${user1} and ${user2}`);
    const sqlQuery =
        "SELECT COUNT(id) AS ChatCount FROM chat WHERE (user1_id=? AND user2_id=?) OR  (user1_id=? AND user2_id=?)";
    db.query(sqlQuery, [user1, user2, user2, user1], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            result[0].ChatCount === 0
                ? insertChat(user1, user2, res)
                : res.send("chat already exist");
        }
    });
});

app.get("/allChats", (req, res) => {
    const user = req.query.user;
    db.query(
        "SELECT u1.username as u1name,u2.username as u2name,c.id as id FROM chatapp.chat c JOIN users u1 ON \
        u1.id=c.user1_id JOIN users u2 ON u2.id=c.user2_id WHERE \
        c.user1_id=? OR \
		c.user2_id=?",
        [user, user],
        (err, result) => {
            if (err) {
                console.log(err);
                res.send("err");
            } else {
                console.log(result);
                res.send({ result });
            }
        }
    );
});
app.get("/getId", (req, res) => {
    const username = req.query.username;
    console.log(username);
    db.query(
        "SELECT id FROM users WHERE username=?",
        [username],
        (err, result) => {
            if (err) {
                console.log(err);
                res.send("error");
            } else {
                console.log("getId result");
                console.log(result[0]);
                res.send(result[0].id);
            }
        }
    );
});

// app.get("/getUname", (req, res) => {
//     const id = req.query.id;
//     db.query("SELECT username FROM users WHERE id=?", [id], (err, result) => {
//         if (err) {
//             console.log(err);
//         } else {
//             res.send(String(result[0].username));
//         }
//     });
// });
app.get("/chatDetails", (req, res) => {
    const chatId = req.query.id;
    db.query(
        "SELECT content,sender_id,receiver_id FROM message WHERE chat_id=?",
        [chatId],
        (err, result) => {
            console.log("aaa");
            console.log(result);
            res.send(result);
        }
    );
});
app.get("/usersInChat", (req, res) => {
    const chatId = req.query.chat_id;
    db.query(
        "SELECT user1_id,user2_id From chat WHERE id=?",
        [chatId],
        (err, result) => {
            console.log("users in chat");
            console.log(result);
            res.send(result[0]);
        }
    );
});
app.post("/sendMessage", (req, res) => {
    const chat = req.body.chat;
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    const content = req.body.content;
    db.query(
        "INSERT INTO message (sender_id, receiver_id, content,  chat_id) VALUES (?,?,?,?)",
        [sender, receiver, content, chat],
        (err, result) => {
            if (err) console.log(err);
            else {
                console.log("message sent");
                res.send("success");
            }
        }
    );
});
