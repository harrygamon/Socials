'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Send, Mic, Paperclip, MoreVertical } from 'lucide-react'

const mockConversations = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      isOnline: true,
    },
    lastMessage: 'Hey! How was your weekend?',
    lastMessageTime: '2 min ago',
    unreadCount: 2,
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Mike Chen',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isOnline: false,
    },
    lastMessage: 'That sounds amazing! Let\'s plan something soon.',
    lastMessageTime: '1 hour ago',
    unreadCount: 0,
  },
  {
    id: '3',
    user: {
      id: '3',
      name: 'Emma Wilson',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      isOnline: true,
    },
    lastMessage: 'Thanks for the coffee recommendation!',
    lastMessageTime: '3 hours ago',
    unreadCount: 1,
  },
]

const mockMessages = [
  {
    id: '1',
    senderId: '1',
    content: 'Hey! How was your weekend?',
    timestamp: '2:30 PM',
    isOwn: false,
  },
  {
    id: '2',
    senderId: 'current',
    content: 'It was great! I went hiking and tried that new coffee shop you mentioned.',
    timestamp: '2:32 PM',
    isOwn: true,
  },
  {
    id: '3',
    senderId: '1',
    content: 'That sounds amazing! Which trail did you take?',
    timestamp: '2:33 PM',
    isOwn: false,
  },
  {
    id: '4',
    senderId: 'current',
    content: 'I went to Eagle Creek Trail. The views were incredible! You should definitely check it out.',
    timestamp: '2:35 PM',
    isOwn: true,
  },
  {
    id: '5',
    senderId: '1',
    content: 'I\'ll add it to my list! Maybe we could go together sometime?',
    timestamp: '2:36 PM',
    isOwn: false,
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0])
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSendMessage = () => {
    if (!message.trim()) return
    
    // TODO: Implement message sending
    console.log('Sending message:', message)
    setMessage('')
  }

  const filteredConversations = mockConversations.filter(conversation =>
    conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 border-r border-secondary-200 dark:border-secondary-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            Messages
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-4 border-b border-secondary-100 dark:border-secondary-700 cursor-pointer hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors ${
                selectedConversation.id === conversation.id
                  ? 'bg-primary-50 dark:bg-primary-900/20'
                  : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={conversation.user.image} alt={conversation.user.name} />
                    <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {conversation.user.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-secondary-800 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-secondary-900 dark:text-white truncate">
                      {conversation.user.name}
                    </h3>
                    <span className="text-xs text-secondary-500 dark:text-secondary-400">
                      {conversation.lastMessageTime}
                    </span>
                  </div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-secondary-200 dark:border-secondary-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={selectedConversation.user.image} alt={selectedConversation.user.name} />
              <AvatarFallback>{selectedConversation.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-secondary-900 dark:text-white">
                {selectedConversation.user.name}
              </h3>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                {selectedConversation.user.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mockMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.isOwn
                    ? 'bg-primary-500 text-white'
                    : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-900 dark:text-white'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${
                  msg.isOwn ? 'text-primary-100' : 'text-secondary-500 dark:text-secondary-400'
                }`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button variant="ghost" size="sm">
              <Mic className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 