        // 1. DETERMINAR LA URL DEL SOCKET
        // Usamos window.location.host para que funcione dinámicamente ya sea en localhost o en la IP de la LAN
        const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const wsUrl = wsProtocol + window.location.host + '/ws/chat/';
        
        console.log("Conectando a:", wsUrl);

        // 2. HANDSHAKE: Iniciar la conexión TCP persistente
        const chatSocket = new WebSocket(wsUrl);

        // 3. RECIBIR DATOS (Evento 'onmessage')
        // El servidor nos empuja datos sin que nosotros preguntemos
        chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            const chatLog = document.querySelector('#chat-log');
            chatLog.innerHTML += '<div class="message">' + data.message + '</div>';
            chatLog.scrollTop = chatLog.scrollHeight; // Auto-scroll hacia abajo
        };

        // Manejo de errores/cierre
        chatSocket.onclose = function(e) {
            console.error('El socket se cerró inesperadamente');
        };

        // 4. ENVIAR DATOS (Push)
        document.querySelector('#chat-message-submit').onclick = function(e) {
            const messageInputDom = document.querySelector('#chat-message-input');
            const message = messageInputDom.value;
            
            // Enviamos el mensaje al servidor a través del túnel WebSocket
            chatSocket.send(JSON.stringify({
                'message': message
            }));
            
            messageInputDom.value = '';
        };
