// CONFIGURACIÓN DE CONEXIÓN
const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
const wsUrl = wsProtocol + window.location.host + '/ws/chat/' + roomName + '/';

console.log("Conectando a sala:", roomName);
const chatSocket = new WebSocket(wsUrl);

// AL RECIBIR MENSAJE (O HISTORIAL)
chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    const container = document.getElementById('messages-container');
    
    // Crear burbuja
    const msgDiv = document.createElement('div');
    
    // Decidir clase: ¿Enviado o Recibido?
    const isMe = (data.username === currentUser);
    msgDiv.className = isMe ? 'message sent' : 'message received';
    
    // Contenido HTML
    // Si es otro usuario, mostramos su nombre en pequeñito
    const senderHtml = isMe ? '' : `<div class="sender-name">${data.username}</div>`;
    
    msgDiv.innerHTML = `
        ${senderHtml}
        <div class="message-content">
            <p style="margin:0">${data.message}</p>
        </div>
        <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
    `;

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight; // Auto-scroll al final
};

// AL ENVIAR
const sendBtn = document.getElementById('send-button');
const input = document.getElementById('message-input');

function sendMessage() {
    const message = input.value.trim();
    if(message) {
        chatSocket.send(JSON.stringify({
            'message': message,
            'username': currentUser
        }));
        input.value = '';
    }
}

sendBtn.onclick = sendMessage;

input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') sendMessage();
});

chatSocket.onclose = function(e) {
    console.error('Socket cerrado inesperadamente');
};