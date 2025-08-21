
import React, { useState, useEffect, useRef } from 'react';
import { sendMessage } from '../services/geminiService';
import { XIcon } from './icons';
import Spinner from './Spinner';

interface ChatbotProps {
  onClose: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hi there! 👋 I'm your smart nutrition assistant. Ask me anything about your meal plan, ingredients, or general fitness tips!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessage(input);
    const modelMessage: Message = { role: 'model', text: responseText };
    setMessages(prev => [...prev, modelMessage]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center sm:justify-end z-50">
      <div className="bg-white rounded-t-lg sm:rounded-l-lg sm:rounded-t-none shadow-xl w-full max-w-md h-[80vh] flex flex-col">
        <header className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg sm:rounded-tl-lg">
          <h2 className="text-xl font-bold text-gray-800">Nutrition Assistant</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition">
            <XIcon className="w-6 h-6 text-gray-600" />
          </button>
        </header>
        
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-emerald-500 flex-shrink-0"></div>}
              <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-emerald-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex-shrink-0"></div>
              <div className="max-w-xs md:max-w-sm px-4 py-2 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                <Spinner />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="w-full px-4 py-2 pr-12 bg-white text-gray-900 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
              disabled={isLoading}
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 disabled:bg-gray-300 transition" disabled={isLoading || !input.trim()}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
