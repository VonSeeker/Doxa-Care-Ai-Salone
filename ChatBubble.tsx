
import React from 'react';
import { Sender, Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isAI = message.sender === Sender.AI;

  return (
    <div className={`flex w-full mb-4 ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-sm ${
        isAI 
          ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-none' 
          : 'bg-green-600 text-white rounded-tr-none'
      }`}>
        {isAI && (
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
              <i className="fas fa-hand-holding-medical text-green-600 text-sm"></i>
            </div>
            <span className="font-bold text-xs text-green-700 uppercase tracking-wider">DoxaCare AI</span>
          </div>
        )}
        <div className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
          {message.text}
        </div>
        
        {message.groundingSources && message.groundingSources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-1">Sources & Locations:</p>
            <div className="flex flex-wrap gap-2">
              {message.groundingSources.map((chunk, idx) => {
                const title = chunk.maps?.title || chunk.web?.title || "View details";
                const uri = chunk.maps?.uri || chunk.web?.uri;
                if (!uri) return null;
                return (
                  <a 
                    key={idx}
                    href={uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-blue-600 px-2 py-1 rounded transition-colors truncate max-w-[150px]"
                  >
                    <i className={`${chunk.maps ? 'fas fa-map-marker-alt' : 'fas fa-link'} mr-1`}></i>
                    {title}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        <div className={`text-[10px] mt-2 ${isAI ? 'text-gray-400' : 'text-green-100'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
