const io = require("socket.io")(3000, 
    { 
    cors: {    
        origin: "*",    
        methods: ["GET", "POST"]  
    }});

const users = {};

io.on('connection', socket => {
    socket.on('new-user', username => {
        if (Object.values(users).indexOf(username) > -1) {
            console.log('username already in use');
            socket.emit('existing-user', 'true');
        } else {
            users[socket.id] = username;
            socket.broadcast.emit('user-connected', username);
            io.emit('users', users);
            socket.emit('existing-user', username);
        }
    });
    socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
    });
    socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
    io.emit('users', users);
    });
});