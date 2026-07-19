import React, { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend, FiUser, FiCpu } from 'react-icons/fi';

const QUICK_PROMPTS = [
  { label: 'About BazaarHub', query: 'what is bazaarhub' },
  { label: 'What is sold here?', query: 'what products are available on this platform' },
  { label: 'How to Sell', query: 'how to sell products' },
  { label: 'How to Buy', query: 'how to buy items' }
];

const ChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! Welcome to BazaarHub—India's trusted multi-category marketplace. Here you can safely list, sell, or buy Electronics, Clothing, Food, Books, Furniture, and Sports items.\n\nHow can I help you understand or use our website today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const processQuery = (userQuery) => {
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = '';

      if (
        userQuery.includes('kind') ||
        userQuery.includes('type') ||
        userQuery.includes('available') ||
        userQuery.includes('category') ||
        userQuery.includes('categories') ||
        userQuery.includes('what do you') ||
        userQuery.includes('what are you') ||
        userQuery.includes('what is sold') ||
        userQuery.includes('what products') ||
        userQuery.includes('which products') ||
        userQuery.includes('list of')
      ) {
        botResponse = 'BazaarHub is a multi-category marketplace. Sellers list products in: Electronics, Clothing, Food, Books, Furniture, Sports, and other categories! You can browse all approved items by clicking "Products" in the header menu.';
      } else if (userQuery.includes('sell') || userQuery.includes('seller') || userQuery.includes('bech')) {
        botResponse = 'To start selling, register as a Seller. Then click the "Start Selling" button in the hero header to list your product!';
      } else if (userQuery.includes('bazaarhub') || userQuery.includes('what is') || userQuery.includes('about')) {
        botResponse = 'BazaarHub is a trusted online marketplace. It connects local sellers and buyers, allowing sellers to list items across multiple categories and buyers to contact them directly to purchase safely and transparently.';
      } else if (userQuery.includes('buy') || userQuery.includes('purchase') || userQuery.includes('kharid') || userQuery.includes('order')) {
        botResponse = 'To buy a product, simply click on it, select "Buy Now", and use the contact details provided to finalize the purchase directly with the seller.';
      } else if (userQuery.includes('admin') || userQuery.includes('approve') || userQuery.includes('reject') || userQuery.includes('status')) {
        botResponse = 'All new or updated products are sent to the admin dashboard for approval. Once reviewed and approved by our team, they go live instantly!';
      } else if (userQuery.includes('price') || userQuery.includes('pay') || userQuery.includes('money') || userQuery.includes('rupee')) {
        botResponse = 'Prices are listed directly on product cards. Payments are settled privately between buyers and sellers. We do not charge listing fees!';
      } else if (userQuery.includes('contact') || userQuery.includes('phone') || userQuery.includes('email') || userQuery.includes('number')) {
        botResponse = 'You can find seller details by clicking "Contact Seller" on any product card or detail page. You must be logged in to view details.';
      } else if (userQuery.includes('login') || userQuery.includes('signup') || userQuery.includes('register') || userQuery.includes('account')) {
        botResponse = 'Use the "Login" or "Sign Up" buttons in the navigation bar to create or manage your account role (Buyer or Seller).';
      } else if (userQuery.includes('hello') || userQuery.includes('hi') || userQuery.includes('hey') || userQuery.includes('assistant')) {
        botResponse = 'Hello! I am your BazaarHub Support Assistant. Feel free to ask me questions about registration, listing products, or buying items!';
      } else {
        botResponse = 'Thank you for reaching out! We are here to help. You can ask me about: "how to sell products", "how to buy", "admin approval", or "how to contact sellers".';
      }

      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    processQuery(input.toLowerCase());
    setInput('');
  };

  const handleQuickPrompt = (query) => {
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: QUICK_PROMPTS.find(p => p.query === query)?.label || query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMessage]);
    processQuery(query.toLowerCase());
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer animate-bounce"
          style={{ animationDuration: '3s' }}
        >
          <FiMessageSquare className="text-2xl" />
        </button>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 h-[500px] flex flex-col overflow-hidden border border-gray-100 animate-slide-up transition-all duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white font-bold relative">
                <FiCpu className="text-lg" />
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full absolute bottom-0 right-0 border-2 border-sky-500"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm leading-none">BazaarHub Agent</h3>
                <span className="text-[10px] text-sky-100 leading-none">Online • Responds Instantly</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition"
            >
              <FiX className="text-lg" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold ${
                    msg.sender === 'user'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-sky-500 text-white'
                  }`}
                >
                  {msg.sender === 'user' ? <FiUser /> : <FiCpu />}
                </div>

                {/* Bubble */}
                <div>
                  <div
                    className={`p-3 rounded-2xl text-sm shadow-sm whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-sky-500 text-white rounded-tr-none'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block px-1">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 max-w-[80%] mr-auto items-center">
                <div className="w-7 h-7 bg-sky-500 text-white rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold">
                  <FiCpu />
                </div>
                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}

            <div ref={messageEndRef} />
          </div>

          {/* Quick Reply Chips */}
          <div className="px-3 py-2 bg-white flex gap-1.5 overflow-x-auto border-t border-gray-100/50 select-none no-scrollbar">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt.label}
                type="button"
                onClick={() => handleQuickPrompt(prompt.query)}
                className="text-[11px] bg-sky-50 hover:bg-sky-100 border border-sky-100 text-sky-700 px-3 py-1 rounded-full transition whitespace-nowrap cursor-pointer shadow-sm font-medium flex-shrink-0"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-sky-500 hover:bg-sky-600 disabled:bg-sky-200 text-white p-2.5 rounded-xl transition shadow-md flex items-center justify-center cursor-pointer"
            >
              <FiSend className="text-sm" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatSupport;
