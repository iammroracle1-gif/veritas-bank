import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'

type Message = {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

const predefinedResponses: Record<string, string> = {
  'hello': 'Hello! Welcome to Veritas Bank. How can I assist you today?',
  'hi': 'Hi there! I\'m your Veritas Bank support assistant. What can I help you with?',
  'help': 'I can help you with:\n• Account inquiries\n• Transaction information\n• Transfer assistance\n• Support tickets\n• General banking questions\n\nWhat would you like to know?',
  'balance': 'To check your balance, go to your Dashboard. You can also view detailed transaction history in the Transactions page.',
  'transfer': 'To transfer money:\n1. Go to the Transfer page\n2. Enter recipient details\n3. Enter amount\n4. Review and confirm\n\nNeed help with a specific transfer?',
  'deposit': 'To deposit funds:\n1. Visit the Deposit page\n2. Choose your payment method\n3. Enter amount and reference\n4. Submit for processing\n\nFunds are usually credited immediately!',
  'support': 'For support:\n• Visit our Support page to create a ticket\n• Email: support@veritasbank.com\n• Phone: +1 (234) 567-890\n• Live chat available Mon-Fri 9AM-5PM',
  'transaction': 'View all your transactions on the Transactions page. You can search, filter by type (credit/debit), and download statements.',
  'account': 'Your account information is available on your Profile page. You can update personal details and manage security settings there.',
  'savings': 'Create savings goals to track your financial targets! Visit the Savings page to set up goals with deadlines and target amounts.',
  'fees': 'Veritas Bank offers:\n• $0 monthly fees\n• $0 transfer fees\n• $0 deposit fees\n• Competitive interest rates\n\nCheck our website for complete fee schedule.',
  'hours': 'Our support hours:\n• Phone: Mon-Fri 9AM-5PM EST\n• Email: 24/7 (response within 24hrs)\n• Live Chat: Mon-Fri 9AM-5PM EST\n• Online Banking: 24/7',
  'security': 'Your security is our priority:\n• End-to-end encryption\n• Two-factor authentication available\n• Regular security audits\n• Fraud monitoring\n• FDIC insured up to $250,000',
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to Veritas Bank support. I can help you with account questions, transfers, deposits, and more. How can I assist you today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuthStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim()

    // Check for exact matches
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (lowerMessage.includes(key)) {
        return response
      }
    }

    // Check for common greetings
    if (lowerMessage.match(/^(hey|sup|good morning|good afternoon|good evening)/)) {
      return `Hello ${user?.firstName || 'there'}! How can I help you with your banking today?`
    }

    // Check for thank you
    if (lowerMessage.match(/thank|thanks|thx/)) {
      return 'You\'re welcome! Is there anything else I can help you with?'
    }

    // Check for goodbye
    if (lowerMessage.match(/bye|goodbye|see you|later/)) {
      return 'Goodbye! Have a great day! Feel free to chat with me anytime you need help.'
    }

    // Default response
    return `I understand you're asking about "${userMessage}". While I'm still learning, I can help with:\n\n• Account information\n• Transfers & deposits\n• Transactions history\n• Support tickets\n• Banking hours & fees\n\nTry asking "help" to see all I can do, or type your question differently!`
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputValue),
        sender: 'ai',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 800 + Math.random() * 400)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickActions = [
    { label: 'Check Balance', query: 'How do I check my balance?' },
    { label: 'Transfer Money', query: 'How do I transfer money?' },
    { label: 'Deposit Funds', query: 'How do I deposit funds?' },
    { label: 'Get Support', query: 'How do I get support?' },
  ]

  return (
    <>
      {/* Floating Chat Button - Animated Icon to Text */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 flex items-center gap-0 hover:gap-3 overflow-hidden group"
          style={{
            width: '56px',
            height: '56px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.width = '170px'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.width = '56px'
          }}
        >
          {/* Icon Container - Always Visible */}
          <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
            <div className="relative">
              <svg 
                className="w-6 h-6 text-white transition-transform group-hover:scale-110" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                />
              </svg>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-600 group-hover:border-blue-700 animate-pulse" />
            </div>
          </div>
          
          {/* Text - Appears on Hover */}
          <span className="whitespace-nowrap font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pr-4">
            Chat with us
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 w-[calc(100vw-3rem)] max-w-md h-[600px] bg-white rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <svg 
                    className="w-6 h-6 text-primary-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                    />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <h3 className="font-bold">Veritas Support</h3>
                <p className="text-xs opacity-90">We're online now</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => {
                      setInputValue(action.query)
                      handleSendMessage()
                    }}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-primary-500 hover:text-primary-600 transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-primary-500 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-end space-x-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                style={{ maxHeight: '100px' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="p-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </>
  )
}
