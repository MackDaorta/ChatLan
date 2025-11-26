
const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
const wsUrl = wsProtocol + window.location.host + '/ws/chat/' + roomName + '/';

console.log("Conectando a:", wsUrl);

const chatSocket = new WebSocket(wsUrl);


chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    const chatLog = document.querySelector('#chat-log');
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    
    
    if (data.username === currentUser) {
        
        messageDiv.classList.add('sent');
        messageDiv.textContent = data.message;
    } else {
       
        messageDiv.innerHTML = `<strong style="font-size:0.8em; display:block; margin-bottom:2px; color:#555;">${data.username}</strong> ${data.message}`;
    }
    // ---------------------------
    
    chatLog.appendChild(messageDiv);
    
  
    chatLog.scrollTop = chatLog.scrollHeight;
};


chatSocket.onclose = function(e) {
    console.error('El socket se cerró inesperadamente');
};


document.querySelector('#chat-message-submit').onclick = function(e) {
    const messageInputDom = document.querySelector('#chat-message-input');
    const message = messageInputDom.value;
    
    if (message) {
        chatSocket.send(JSON.stringify({
            'message': message,
            'username': currentUser 
        }));
        messageInputDom.value = '';
    }
};


document.querySelector('#chat-message-input').onkeyup = function(e) {
    if (e.key === 'Enter') {
        document.querySelector('#chat-message-submit').click();
    }
};