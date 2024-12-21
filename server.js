const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors());

const server = http.createServer(app);


app.get('/health', (req, res) => {
    res.json({ status: 'success', message: 'Socket server is running' });
});


const io = new Server(server, {
    cors: {
        origin:[ "http://localhost:3000","https://travelapp-itpa.onrender.com"],
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

io.on('connection', (socket) => {

    //trevaeltips chat
    socket.on("join_room", (room, senderId) => {
        socket.join(room);
        console.log(`User ${socket.id} with ID ${senderId} joined room ${room}`);
    });


    socket.on("send_message", (data) => {
        console.log(data.chosenCountry, data.message);
        io.to(data.chosenCountry).emit("receive_message", data.message);
    });

    socket.on("send_reply", (data) => {
        console.log(data.chosenCountry, data.reply);
        io.to(data.chosenCountry).emit("receive_reply", data.reply);
    });

    socket.on("delete_message", (data) => {
        console.log(data.chosenCountry, data);
        io.to(data.chosenCountry).emit("receive_deleted_message", data);
    });

    socket.on("delete_reply", (data) => {
        console.log(data.chosenCountry, data);
        io.to(data.chosenCountry).emit("receive_deleted_reply", data);
    });


    // tours chat
    socket.on("join_tour_room", (tour_room, senderId) => {
        socket.join(tour_room);
        console.log(`User ${socket.id} with ID ${senderId} joined tour_room ${tour_room}`);
    });


    socket.on("send_message_tour", (data) => {
        console.log('data.tour_room:',data.tour_room, 'message:',data.message);
        io.to(data.tour_room).emit("receive_message_tour", data);
    });


     socket.on("send_reply_tour", (data) => {
        console.log('data',data);
        io.to(data.tour_room).emit("receive_reply_tour", {...data.tourreply, receiver_id:data.receiver_id});
    });


        socket.on("delete_message_tour", (data) => {
        console.log(data);
        io.to(data.tour_room).emit("receive_deleted_message_tour", data);
    });

    socket.on("delete_reply_tour", (data) => {
        console.log(data);
        io.to(data.tour_room).emit("receive_deleted_reply_tour", data);
    });


    socket.on('disconnect', () => {
        console.log(`User disconnected ${socket.id}`);
    });
});

server.listen(3001, () => {
    console.log('listening on port 3001');
});
