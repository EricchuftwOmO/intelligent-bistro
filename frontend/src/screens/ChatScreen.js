import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useCartStore } from '../store/cartStore';
import { API_URL } from '../config';

export default function ChatScreen() {
  const welcomeMsg = { id: '0', role: 'ai', text: "Welcome to The Intelligent Bistro! 🍽️ I can help you order. Try saying 'Add two spicy chicken sandwiches and a lemonade' or ask me about the menu." };
  const [aiMessages, setAiMessages] = useState([welcomeMsg]);
  const [basicMessages, setBasicMessages] = useState([welcomeMsg]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('ai');
  const flatListRef = useRef();
  const { addItem, removeItem, updateQuantity, clearCart } = useCartStore();

  const messages = mode === 'ai' ? aiMessages : basicMessages;
  const setMessages = mode === 'ai' ? setAiMessages : setBasicMessages;

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/parse-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text, mode }),
      });
      const data = await res.json();

      // Apply actions to cart
      if (data.actions) {
        data.actions.forEach(action => {
          if (action.type === 'add') addItem(action.item, action.quantity);
          else if (action.type === 'remove') removeItem(action.item.id);
          else if (action.type === 'update') updateQuantity(action.item.id, action.quantity);
          else if (action.type === 'clear') clearCart();
        });
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', text: data.reply }]);

      // Show quota warning
      if (data.aiError === 'quota_exceeded') {
        setMessages(prev => [...prev, {
          id: (Date.now() + 2).toString(),
          role: 'system',
          text: "⚠️ AI quota exceeded. Your order was processed with the basic parser. Switch to Basic mode for uninterrupted service."
        }]);
      }
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', text: "Sorry, I couldn't connect to the server. Please check your connection." }]);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-bistro-bg" keyboardVerticalOffset={90}>
      <View className="flex-1 pt-12">
        <View className="flex-row items-center justify-between px-5 mb-1">
          <View className="flex-row items-center">
            <Text style={{ fontSize: 24 }}>{mode === 'ai' ? '🤖' : '⚡'}</Text>
            <Text className={`text-2xl font-bold ml-2 ${mode === 'ai' ? 'text-purple-400' : 'text-green-400'}`}>
              {mode === 'ai' ? 'AI Assistant' : 'Basic Assistant'}
            </Text>
          </View>
          <View className="flex-row bg-bistro-card rounded-full p-1">
            <TouchableOpacity onPress={() => setMode('ai')} className={`px-3 py-1 rounded-full ${mode === 'ai' ? 'bg-purple-600' : ''}`}>
              <Text className={`text-xs font-medium ${mode === 'ai' ? 'text-white' : 'text-gray-400'}`}>🤖 AI</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMode('basic')} className={`px-3 py-1 rounded-full ${mode === 'basic' ? 'bg-green-600' : ''}`}>
              <Text className={`text-xs font-medium ${mode === 'basic' ? 'text-white' : 'text-gray-400'}`}>⚡ Basic</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text className={`text-xs px-5 mb-3 ${mode === 'ai' ? 'text-purple-300' : 'text-green-300'}`}>
          {mode === 'ai' ? 'Powered by Google Gemini — understands natural language' : 'Rule-based parser — use exact menu item names'}
        </Text>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={i => i.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          renderItem={({ item }) => (
            <View className={`mb-3 max-w-[85%] ${item.role === 'user' ? 'self-end' : 'self-start'}`}>
              <View className={`px-4 py-3 rounded-2xl ${
                item.role === 'user' ? 'bg-bistro-accent rounded-br-sm' :
                item.role === 'system' ? 'bg-yellow-900 rounded-bl-sm' :
                'bg-bistro-card rounded-bl-sm'
              }`}>
                <Text className="text-white text-sm leading-5">{item.text}</Text>
              </View>
            </View>
          )}
        />

        <View className="flex-row items-center px-4 py-3 border-t border-gray-800 bg-bistro-card">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={mode === 'ai' ? "Try: 'Hey, can I get a burger and fries?'" : "Try: 'Add a truffle burger and fries'"}
            placeholderTextColor="#666"
            onSubmitEditing={sendMessage}
            className="flex-1 bg-bistro-bg text-white px-4 py-3 rounded-full mr-3 text-sm"
          />
          <TouchableOpacity onPress={sendMessage} disabled={loading} className={`w-10 h-10 rounded-full items-center justify-center ${loading ? 'bg-gray-600' : 'bg-bistro-accent'}`}>
            <Text className="text-white text-lg">↑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
