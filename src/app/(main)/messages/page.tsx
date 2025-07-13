'use client'
import { useState } from 'react'
import { Send, Mic, MoreVertical, Search } from 'lucide-react'

interface Message {
  id: number
  text: string
  sender: 'me' | 'other'
  timestamp: string
  isRead: boolean
}

interface Chat {
  id: number
  name: string
  avatar: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
  messages: Message[]
}

const mockChats: Chat[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    lastMessage: "Hey! How's your day going?",
    lastMessageTime: "2m ago",
    unreadCount: 2,
    isOnline: true,
    messages: [
      { id: 1, text: "Hey! How's your day going?", sender: 'other', timestamp: '2:30 PM', isRead: true },
      { id: 2, text: "It's going great! Just finished a workout", sender: 'me', timestamp: '2:32 PM', isRead: true },
      { id: 3, text: "That sounds amazing! What did you do?", sender: 'other', timestamp: '2:33 PM', isRead: false },
      { id: 4, text: "Just some cardio and weights", sender: 'other', timestamp: '2:35 PM', isRead: false }
    ]
  },
  {
    id: 2,
    name: "Emma Wilson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    lastMessage: "Want to grab coffee sometime?",
    lastMessageTime: "1h ago",
    unreadCount: 0,
    isOnline: false,
    messages: [
      { id: 1, text: "Hi Emma! Loved your profile", sender: 'me', timestamp: '1:00 PM', isRead: true },
      { id: 2, text: "Thanks! Yours too 😊", sender: 'other', timestamp: '1:05 PM', isRead: true },
      { id: 3, text: "Want to grab coffee sometime?", sender: 'other', timestamp: '1:10 PM', isRead: true }
    ]
  },
  {
    id: 3,
    name: "Jessica Chen",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    lastMessage: "That sounds perfect!",
    lastMessageTime: "3h ago",
    unreadCount: 0,
    isOnline: true,
    messages: [
      { id: 1, text: "Hey Jessica! Are you free this weekend?", sender: 'me', timestamp: '11:00 AM', isRead: true },
      { id: 2, text: "Yes! I'd love to meet up", sender: 'other', timestamp: '11:15 AM', isRead: true },
      { id: 3, text: "That sounds perfect!", sender: 'other', timestamp: '11:20 AM', isRead: true }
    ]
  }
]

export default function MessagesPage() {
  const [chats, setChats] = useState<Chat[]>(mockChats)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return

    const message: Message = {
      id: Date.now(),
      text: newMessage,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    }

    const updatedChat = {
      ...selectedChat,
      messages: [...selectedChat.messages, message],
      lastMessage: newMessage,
      lastMessageTime: 'now'
    }

    setChats(chats.map(chat => chat.id === selectedChat.id ? updatedChat : chat))
    setSelectedChat(updatedChat)
    setNewMessage('')
  }

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto pt-16 h-screen">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg h-full flex overflow-hidden">
          {/* Chat List */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Messages</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedChat?.id === chat.id ? 'bg-pink-50 dark:bg-pink-900/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/48x48/f3f4f6/9ca3af?text=Profile'
                        }}
                      />
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        chat.isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800 dark:text-white truncate">{chat.name}</h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{chat.lastMessageTime}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className="bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedChat.avatar}
                      alt={selectedChat.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/40x40/f3f4f6/9ca3af?text=Profile'
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">{selectedChat.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedChat.isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedChat.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.sender === 'me'
                            ? 'bg-pink-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'me' ? 'text-pink-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <Mic className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                      <Send className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Select a conversation</h2>
                  <p className="text-gray-600 dark:text-gray-300">Choose a chat to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 