'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, HelpCircle, MessageSquare, Info, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export function AIChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: '¡Hola! Soy tu asistente de Tienda 3D 🤖✨. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const commonQuestions = [
    {
      q: '¿Cómo uso el visor 3D?',
      a: '¡Es súper intuitivo! Puedes mantener presionado y arrastrar (con el ratón o el dedo en móvil) para rotar el modelo. Usa la rueda del mouse o pellizca la pantalla para hacer zoom y examinar los detalles geométricos más de cerca. 🔍✨',
    },
    {
      q: '¿Qué métodos de pago tienen?',
      a: 'Soportamos pagos rápidos como Yape y Plin para compras rápidas locales en el Perú, además de transferencias directas y contra-entrega. 💳🇵🇪',
    },
    {
      q: '¿Hacen envíos a provincia?',
      a: '¡Sí, enviamos a todo el Perú! Para Lima contamos con envío exprés en 24 horas y para provincias despachamos vía Olva Courier o Shalom, llegando en un plazo de 2 a 3 días hábiles. 🚚📦',
    },
  ];

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      // Look for predefined answers
      const matchedQ = commonQuestions.find((item) => item.q === textToSend);
      
      const aiReplyText = matchedQ 
        ? matchedQ.a
        : `¡Excelente consulta! Como soy un asistente AI en fase beta, te recomiendo contactar directamente a soporte técnico escribiendo al WhatsApp (+51 999 888 777) o visitando nuestro catálogo para interactuar con más modelos 3D. 🛠️✨`;

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Expanded Chat Window */}
      {isOpen && (
        <Card className="w-[340px] sm:w-[380px] h-[480px] border-primary/15 bg-card/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden flex flex-col mb-4 animate-fade-in border">
          
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-primary to-secondary p-4 flex flex-row items-center justify-between space-y-0 text-primary-foreground">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 bg-white/20 border border-white/30 flex items-center justify-center">
                <AvatarFallback className="bg-transparent text-white">
                  <Bot className="h-5 w-5 animate-pulse" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <CardTitle className="text-sm font-heading font-black tracking-wide flex items-center gap-1">
                  Asistente Virtual 3D <Sparkles className="h-3.5 w-3.5 fill-current text-amber-300" />
                </CardTitle>
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Soporte en línea
                </span>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10 rounded-full cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </Button>
          </CardHeader>

          {/* Chat Content */}
          <CardContent className="flex-1 p-4 flex flex-col overflow-hidden min-h-0 bg-secondary/5">
            <ScrollArea className="flex-1 pr-3">
              <div className="space-y-4">
                {messages.map((msg) => {
                  const isAi = msg.sender === 'ai';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 max-w-[85%] ${isAi ? 'self-start' : 'ml-auto flex-row-reverse'}`}
                    >
                      {isAi && (
                        <Avatar className="h-7 w-7 border border-primary/10 bg-primary/10 shrink-0">
                          <AvatarFallback className="text-[10px] font-black text-primary uppercase">
                            AI
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex flex-col">
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          isAi 
                            ? 'bg-card border border-primary/5 text-foreground rounded-tl-none shadow-sm'
                            : 'bg-primary text-primary-foreground rounded-tr-none shadow-md shadow-primary/10'
                        }`}>
                          {msg.text}
                        </div>
                        <span className={`text-[8px] font-bold text-muted-foreground/60 mt-1 pl-1 ${
                          isAi ? 'self-start' : 'self-end pr-1'
                        }`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Simulated typing indicator */}
                {isTyping && (
                  <div className="flex gap-2.5 max-w-[85%] self-start">
                    <Avatar className="h-7 w-7 border border-primary/10 bg-primary/10 shrink-0">
                      <AvatarFallback className="text-[10px] font-black text-primary">AI</AvatarFallback>
                    </Avatar>
                    <div className="p-3 bg-card border border-primary/5 text-foreground rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Questions block */}
            <div className="mt-4 pt-3 border-t border-primary/5">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-2 flex items-center gap-1">
                <HelpCircle className="h-3 w-3 text-primary" /> Preguntas sugeridas:
              </span>
              <div className="flex flex-col gap-1.5">
                {commonQuestions.map((question) => (
                  <button
                    key={question.q}
                    type="button"
                    onClick={() => handleSendMessage(question.q)}
                    disabled={isTyping}
                    className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-primary hover:text-primary-foreground bg-primary/5 hover:bg-primary border border-primary/10 rounded-lg transition-all active:scale-[0.98] cursor-pointer truncate"
                  >
                    {question.q}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>

          {/* Footer Input */}
          <CardFooter className="p-3 bg-card border-t border-primary/5 flex items-center gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              placeholder="Pregúntame algo sobre la tienda..."
              disabled={isTyping}
              className="flex-1 h-9 rounded-xl border-primary/10 focus-visible:ring-1 focus-visible:ring-primary/20 text-xs"
            />
            <Button
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim() || isTyping}
              size="icon"
              className="h-9 w-9 rounded-xl bg-primary text-primary-foreground cursor-pointer shrink-0 active:scale-95 transition-all shadow-md shadow-primary/15"
            >
              <Send className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Floating Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 rounded-full shadow-2xl flex items-center justify-center shrink-0 cursor-pointer active:scale-95 hover:scale-105 transition-all relative border border-white/10 ${
          isOpen 
            ? 'bg-destructive text-destructive-foreground hover:bg-destructive/95' 
            : 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-primary/20 hover:shadow-primary/30'
        }`}
        aria-label="Chat con soporte AI"
      >
        {isOpen ? (
          <X className="h-6 w-6 animate-fade-in" />
        ) : (
          <div className="relative">
            <MessageSquare className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[8px] font-black text-white items-center justify-center">1</span>
            </span>
          </div>
        )}
      </Button>

    </div>
  );
}
