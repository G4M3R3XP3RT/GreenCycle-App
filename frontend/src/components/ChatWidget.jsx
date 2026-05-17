import React, { useState, useRef, useEffect } from 'react';
import { aiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

//Ai chatbot widget overlay
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Bonjour ! Je suis l'assistant GreenCycle. Comment puis-je vous aider ?" }
  ]); //simulate ai bot first message
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom(); //always spam scroll to bottom when new msg to be fluid
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      //call to local ai on p 11434
      const response = await aiService.chat(userMessage);
      const aiResponse = typeof response.data === 'string' ? response.data : response.data.reponse || response.data.response || response.data.message || "Je n'ai pas pu générer de réponse.";
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      //set messages by ai or user to display left or right in chatbox
    } catch (err) {
      console.error(err);
      let errorMsg = "Désolé, une erreur s'est produite lors de la communication avec l'assistant.";
      if (err.response && err.response.status === 500) {
        errorMsg = "Erreur serveur (500). L'IA n'est peut-être pas démarrée en arrière-plan.";
      }
      setMessages(prev => [...prev, { sender: 'ai', text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  //only display chatbot if user is connected, otherwise no chatbot
  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-primary"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="glass-panel animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '6rem',
            right: '2rem',
            width: '350px',
            height: '500px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div style={{ padding: '1rem', background: 'var(--gradient-primary)', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>Assistant GreenCycle</h3>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-color)' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: msg.sender === 'user' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.1)',
                  color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)',
                  padding: '0.75rem 1rem',
                  borderRadius: msg.sender === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                  fontSize: '0.95rem',
                  lineHeight: '1.4'
                }}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', padding: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Réflexion en cours...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', padding: '0.75rem', background: 'var(--card-bg)', borderTop: '1px solid var(--card-border)' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question..."
              style={{ flex: 1, borderRadius: '20px', padding: '0.75rem 1rem', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none' }}
              disabled={loading}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ borderRadius: '50%', width: '45px', height: '45px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '0.5rem' }}
              disabled={loading || !input.trim()}
            >
              <span style={{ transform: 'rotate(-45deg)', marginTop: '-2px', marginLeft: '2px' }}>➔</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
