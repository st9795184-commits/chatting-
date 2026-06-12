const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static('public'));

// Serve index.html at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let messages = [];

io.on('connection', (socket) => {
    console.log('✅ New user connected');
    socket.emit('previous-messages', messages);
    
    socket.on('send-message', (data) => {
        const messageData = {
            username: data.username,
            message: data.message,
            time: new Date().toLocaleTimeString()
        };
        messages.push(messageData);
        io.emit('receive-message', messageData);
    });
    
    socket.on('disconnect', () => {
        console.log('❌ User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✅ Chat server running on port ${PORT}`);
});
