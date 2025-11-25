import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message  # Importamos nuestro modelo

class ChatConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        self.room_name = 'sala_general'
        self.room_group_name = 'chat_%s' % self.room_name

        # 1. Unirse al grupo
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # 2. CARGAR HISTORIAL (Solo para el usuario que entra)
        # Obtenemos los últimos 20 mensajes de la BD
        last_messages = await self.get_last_messages()
        
        # Se los enviamos uno por uno
        for msg in last_messages:
            await self.send(text_data=json.dumps({
                'message': msg
            }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # 3. GUARDAR EN BASE DE DATOS
        await self.save_message(message)

        # 4. Enviar mensaje a todos (Broadcast)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))

    # --- FUNCIONES AUXILIARES PARA LA BASE DE DATOS ---
    
    @database_sync_to_async
    def save_message(self, message_text):
        # Crea el objeto Message en la tabla
        return Message.objects.create(content=message_text)

    @database_sync_to_async
    def get_last_messages(self):
        # Obtenemos los últimos 20. 
        # Nota: 'order_by' negativo y luego reversa para obtener los ultimos correctamente
        messages = Message.objects.order_by('-timestamp')[:20]
        # Invertimos la lista para que salgan en orden cronológico (viejo -> nuevo)
        return [msg.content for msg in reversed(messages)]