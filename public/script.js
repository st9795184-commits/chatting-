let socket;
let currentUsername = '';

function joinChat() {
    const username = document.getElementById('usernameInput').value.trim();
    
    if (username === '') {
        alert('Please enter a username!');
        return;
    }
    
    currentUsername = username;
    
    socket = io();
    
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('chatArea').style.display = 'flex';
    
    socket.on('previous-messages', (messages) => {
        const messagesArea = document.getElementById('messagesArea');
        messagesArea.innerHTML = '';
        
        if (messages.length === 0) {
            messagesArea.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">No messages yet. Start the conversation!</div>';
        } else {
            messages.forEach(msg => {
                displayMessage(msg);
            });
        }
    });
    
    socket.on('receive-message', (data) => {
        displayMessage(data);
    });
    
    const statusDiv = document.getElementById('onlineStatus');
    statusDiv.innerHTML = '🟢 Connected as ' + username;
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (message === '') return;
    
    socket.emit('send-message', {
        username: currentUsername,
        message: message
    });
    
    messageInput.value = '';
}

function displayMessage(data) {
    const messagesArea = document.getElementById('messagesArea');
    
    if (messagesArea.children.length === 1 && messagesArea.children[0].innerText.includes('No messages')) {
        messagesArea.innerHTML = '';
    }
    
    const isOwnMessage = (data.username === currentUsername);
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    if (isOwnMessage) {
        messageDiv.classList.add('own-message');
    }
    
    messageDiv.innerHTML = `
        <div class="message-username">${escapeHtml(data.username)}</div>
        <div class="message-text">${escapeHtml(data.message)}</div>
        <div class="message-time">${data.time}</div>
    `;
    
    messagesArea.appendChild(messageDiv);
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && document.getElementById('chatArea').style.display === 'flex') {
        sendMessage();
    }
});

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}