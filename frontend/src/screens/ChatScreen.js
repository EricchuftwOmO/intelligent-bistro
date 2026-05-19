import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useCartStore } from '../store/cartStore';
import { API_URL } from '../config';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: '0', role: 'ai', text: "Welcome to The Intelligent Bistro! 🍽️ I can help you order. Try saying 'Add two spicy chicken sandwiches and a lemonade' or ask me about the menu." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef();
  const { addItem, removeItem, updateQuantity, clearCart } = useCartStore();

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
        body: JSON.stringify({ message: userMsg.text }),
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
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', text: "Sorry, I couldn't connect to the server. Please check your connection." }]);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-bistro-bg" keyboardVerticalOffset={90}>
      <View className="flex-1 pt-12">
        <Text className="text-2xl font-bold text-white px-5 mb-1">AI Assistant</Text>
        <Text className="text-gray-400 text-xs px-5 mb-3">Order by chatting naturally</Text>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={i => i.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          renderItem={({ item }) => (
            <View className={`mb-3 max-w-[85%] ${item.role === 'user' ? 'self-end' : 'self-start'}`}>
              <View className={`px-4 py-3 rounded-2xl ${item.role === 'user' ? 'bg-bistro-accent rounded-br-sm' : 'bg-bistro-card rounded-bl-sm'}`}>
                <Text className="text-white text-sm leading-5">{item.text}</Text>
              </View>
            </View>
          )}
        />

        <View className="flex-row items-center px-4 py-3 border-t border-gray-800 bg-bistro-card">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Try: 'Add a truffle burger and fries'"
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
