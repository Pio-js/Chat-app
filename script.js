const socket = io('http://localhost:3000');
const usersBox = document.getElementById('users-container');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

const username = prompt('What is your name?');
socket.emit('new-user', username);

socket.on('existing-user', data => {
    if (data === 'true') {
        const rename = prompt(`The username ${username} is already in use.\nPlease choose another username!`);
        socket.emit('new-user', rename);
    } else {
        appendMessage(`Welcome ${data}`);
    }
})

socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`);
});

socket.on('user-connected', name => {
    appendMessage(`${name} connected`);
});

socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`);
});

socket.on('users', users => {
    usersBox.innerHTML = '';
    Object.values(users).forEach(username => 
        usersBox.insertAdjacentHTML('beforeend', `<div>${username}</div>`)
    );
});

messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value;
    appendMessage(`You: ${message}`);
    socket.emit('send-chat-message', message);
    messageInput.value = '';
});

function appendMessage(message) {
    //adding time when the message is created
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes();
    const timeDiv = `<div id='time-container'>${time}</div>`;
    //creating a new div to put the message in the message container
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.insertAdjacentHTML('beforeend', timeDiv)
    messageContainer.append(messageElement);
}