import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message
from django.contrib.auth.models import User

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        
        last_messages = await self.get_last_messages()
        for msg in last_messages:
            await self.send(text_data=json.dumps(msg))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        username = text_data_json['username'] 

    
        await self.save_message(username, message, self.room_name)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username 
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'username': event['username']
        }))

    @database_sync_to_async
    def save_message(self, username, message, room):
        user = User.objects.get(username=username)
        return Message.objects.create(author=user, content=message, room_name=room)

    @database_sync_to_async
    def get_last_messages(self):
        messages = Message.objects.filter(room_name=self.room_name).order_by('-timestamp')[:20]
        return [{'message': msg.content, 'username': msg.author.username} for msg in reversed(messages)]