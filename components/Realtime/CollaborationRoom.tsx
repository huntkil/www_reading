'use client';

/* eslint-disable */
import { useState, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Send } from 'lucide-react';

// Assuming these types are defined elsewhere and imported
interface User {
  id: string;
  name: string;
}

interface Message {
  id: string;
  text: string;
  sender: User;
}

export function CollaborationRoom() {
  const [participants, setParticipants] = useState<User[]>([
    { id: '1', name: 'Alex' },
    { id: '2', name: 'Maria' },
  ]);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { id: 'a', text: 'Hey everyone!', sender: participants[0] },
    { id: 'b', text: 'Ready to start?', sender: participants[1] },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = useCallback(() => {
    if (newMessage.trim()) {
      // Logic to send message would go here
  
      setNewMessage('');
    }
  }, [newMessage]);

  return (
    <div className="flex h-full">
      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-semibold">Collaboration Room</h1>
              <p className="text-sm text-gray-500">
                {participants.length}명 참가 중
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Audio/Video toggle buttons removed */}
            
            {/* Settings button removed */}
            
            {/* Leave room button removed */}
          </div>
        </div>

        {/* 비디오/화면 공유 영역 */}
        <div className="flex-1 bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-lg">화면 공유가 시작되면 여기에 표시됩니다</p>
          </div>
        </div>

        {/* 참가자 목록 */}
        <div className="bg-white border-t p-4">
          <h3 className="font-semibold mb-3 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            참가자 ({participants.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://via.placeholder.com/50?text=${participant.name.charAt(0)}`} />
                    <AvatarFallback>
                      {participant.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{participant.name}</p>
                  {/* Role badge removed */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 채팅 사이드바 */}
      <div className="w-80 bg-white border-l flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold flex items-center">
            <Send className="h-4 w-4 mr-2" />
            채팅
          </h3>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://via.placeholder.com/50?text=${msg.sender.name.charAt(0)}`} />
                  <AvatarFallback>
                    {msg.sender.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{msg.sender.name}</span>
                    <span className="text-xs text-gray-500">
                      {/* Timestamp removed */}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="메시지를 입력하세요..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="sm">
              전송
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 