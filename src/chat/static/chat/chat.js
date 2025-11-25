
        const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const wsUrl = wsProtocol + window.location.host + '/ws/chat/';
        
        console.log("Conectando a:", wsUrl);


        const chatSocket = new WebSocket(wsUrl);

    
        chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            const chatLog = document.querySelector('#chat-log');
            chatLog.innerHTML += '<div class="message">' + data.message + '</div>';
            chatLog.scrollTop = chatLog.scrollHeight; 
        };

        
        chatSocket.onclose = function(e) {
            console.error('El socket se cerró inesperadamente');
        };

        
        document.querySelector('#chat-message-submit').onclick = function(e) {
            const messageInputDom = document.querySelector('#chat-message-input');
            const message = messageInputDom.value;
            
            
            chatSocket.send(JSON.stringify({
                'message': message
            }));
            
            messageInputDom.value = '';
        };
