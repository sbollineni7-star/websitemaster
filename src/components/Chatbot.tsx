import { useState, useRef, useEffect } from 'react'
import '../styles/Chatbot.css'

interface Message {
  id: string
  text: string
  sender: 'bot' | 'user'
  timestamp: Date
}

interface LeadData {
  name: string
  phone: string
  location: string
  budget: string
  plotSize: string
  purpose: 'Investment' | 'Own Use' | ''
  visitDate: string
  visitTime: string
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [conversationStage, setConversationStage] = useState(0)
  const [leadData, setLeadData] = useState<LeadData>({
    name: '',
    phone: '',
    location: '',
    budget: '',
    plotSize: '',
    purpose: '',
    visitDate: '',
    visitTime: '',
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize chatbot with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        text: 'Hi! 👋 Welcome to Sri Bollineni Infra. I\'m here to help you find the perfect property. What\'s your name?',
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
      setConversationStage(0)
    }
  }, [isOpen, messages.length])

  const addMessage = (text: string, sender: 'bot' | 'user') => {
    const newMessage: Message = {
      id: Math.random().toString(),
      text,
      sender,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    addMessage(inputValue, 'user')
    const userInput = inputValue.toLowerCase().trim()
    setInputValue('')

    // Conversation flow based on stages
    setTimeout(() => {
      handleChatbotResponse(userInput)
    }, 500)
  }

  const handleChatbotResponse = (userInput: string) => {
    let botResponse = ''
    let nextStage = conversationStage + 1

    switch (conversationStage) {
      case 0: // Capture name
        setLeadData({ ...leadData, name: userInput })
        botResponse = `Nice to meet you, ${userInput}! 😊\n\nWhich location are you interested in?\n\n📍 **Available Locations:**\n1. Guntur Growth Corridor\n2. Premium Residential Area\n3. City Center\n4. Others`
        nextStage = 1
        break

      case 1: // Capture location
        setLeadData({ ...leadData, location: userInput })
        botResponse = `Great! Interested in ${userInput}. 👍\n\nAre you looking for investment or own use?\n\n1. **Investment** (Rental income, long-term value)\n2. **Own Use** (Personal residence)`
        nextStage = 2
        break

      case 2: // Capture purpose
        const purpose = userInput.includes('investment') ? 'Investment' : 'Own Use'
        setLeadData({ ...leadData, purpose })
        botResponse = `Perfect! Looking for ${purpose}. 📈\n\nWhat's your budget range?\n\n💰 **Common Budget Ranges:**\n1. Below 10 Lakhs\n2. 10-25 Lakhs\n3. 25-50 Lakhs\n4. Above 50 Lakhs\n5. Custom amount`
        nextStage = 3
        break

      case 3: // Capture budget
        setLeadData({ ...leadData, budget: userInput })
        botResponse = `Understood, Budget: ${userInput}. ✓\n\nWhat plot size are you looking for?\n\n📐 **Common Sizes:**\n1. 500-1000 Sq.Ft\n2. 1000-1500 Sq.Ft\n3. 1500-2000 Sq.Ft\n4. Above 2000 Sq.Ft\n5. Not sure`
        nextStage = 4
        break

      case 4: // Capture plot size
        setLeadData({ ...leadData, plotSize: userInput })
        botResponse = `Plot Size: ${userInput}. ✓\n\nWhat's your phone number? Our team will contact you with the latest availability and pricing.`
        nextStage = 5
        break

      case 5: // Capture phone
        const phoneRegex = /^\d{10}$/
        if (phoneRegex.test(userInput.replace(/\D/g, ''))) {
          const cleanPhone = userInput.replace(/\D/g, '').slice(-10)
          setLeadData({ ...leadData, phone: cleanPhone })
          botResponse = `Thanks! 📞 Phone: ${cleanPhone}\n\nWould you like to schedule a site visit?\n\n📅 Enter your preferred date (e.g., Tomorrow, 15 June, Next week)`
          nextStage = 6
        } else {
          botResponse = `Please enter a valid 10-digit phone number.`
          nextStage = 5
        }
        break

      case 6: // Capture visit date
        setLeadData({ ...leadData, visitDate: userInput })
        botResponse = `Great! Preferred date: ${userInput}. 📅\n\nWhat time works best for you?\n\n⏰ **Available Times:**\n1. 9:00 AM - 11:00 AM\n2. 11:00 AM - 1:00 PM\n3. 2:00 PM - 4:00 PM\n4. 4:00 PM - 6:00 PM`
        nextStage = 7
        break

      case 7: // Capture visit time
        setLeadData({ ...leadData, visitTime: userInput })
        // Save lead data
        saveLead({ ...leadData, visitTime: userInput })
        botResponse = `Perfect! ✅\n\n📋 **Your Information:**\n• Name: ${leadData.name}\n• Phone: ${leadData.phone}\n• Location: ${leadData.location}\n• Budget: ${leadData.budget}\n• Plot Size: ${leadData.plotSize}\n• Purpose: ${leadData.purpose}\n• Visit Date: ${leadData.visitDate}\n• Visit Time: ${userInput}\n\n🎉 Thank you for your interest in Sri Bollineni Infra!\n\nOur sales team will contact you shortly with the latest availability, pricing, and site visit details.\n\n📞 **Quick Contact:**\nWhatsApp: +91-7995088752\nEmail: sribollineniinfradeveloper@gmail.com\n\n**Any other questions?**`
        nextStage = 8
        break

      case 8: // End conversation
        if (userInput.includes('no') || userInput.includes('bye') || userInput.includes('thanks')) {
          botResponse = `Thank you! Have a great day! 👋\n\nFeel free to reach out anytime. We look forward to helping you find your dream property!`
        } else {
          botResponse = `Sure! What would you like to know?`
          nextStage = 8
        }
        break

      default:
        botResponse = `Is there anything else I can help you with?`
    }

    setConversationStage(nextStage)
    addMessage(botResponse, 'bot')
  }

  const saveLead = (data: LeadData) => {
    // Save to localStorage
    const existingLeads = JSON.parse(localStorage.getItem('chatbotLeads') || '[]')
    const newLead = {
      ...data,
      timestamp: new Date().toISOString(),
    }
    existingLeads.push(newLead)
    localStorage.setItem('chatbotLeads', JSON.stringify(existingLeads))

    // Optional: Send to backend via API
    sendLeadToBackend(newLead)
  }

  const sendLeadToBackend = async (data: LeadData) => {
    try {
      // Send lead to your backend/API
      console.log('Lead data:', data)
      // Example API call (uncomment when backend is ready):
      // await fetch('/api/leads', { method: 'POST', body: JSON.stringify(data) })
    } catch (error) {
      console.error('Error sending lead:', error)
    }
  }

  const handleReset = () => {
    setMessages([])
    setConversationStage(0)
    setLeadData({
      name: '',
      phone: '',
      location: '',
      budget: '',
      plotSize: '',
      purpose: '',
      visitDate: '',
      visitTime: '',
    })
  }

  if (!isOpen) {
    return (
      <button className="chatbot-toggle" onClick={() => setIsOpen(true)} title="Open Chat">
        💬 Chat
      </button>
    )
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>Sri Bollineni Infra</h3>
        <div className="chatbot-header-actions">
          <button className="chatbot-reset-btn" onClick={handleReset} title="Reset">
            🔄
          </button>
          <button className="chatbot-close-btn" onClick={() => setIsOpen(false)} title="Close">
            ✕
          </button>
        </div>
      </div>

      <div className="chatbot-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">{message.text}</div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input-area">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
          className="chatbot-input"
        />
        <button onClick={handleSendMessage} className="chatbot-send-btn">
          Send
        </button>
      </div>
    </div>
  )
}
