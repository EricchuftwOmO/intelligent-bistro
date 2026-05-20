import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useCartStore } from '../store/cartStore';
import { API_URL } from '../config';

const categories = ['All', 'Mains', 'Starters', 'Drinks', 'Desserts'];

export default function MenuScreen() {
  const [menu, setMenu] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [addedId, setAddedId] = useState(null);
  const addItem = useCartStore(s => s.addItem);

  const handleAdd = (item) => {
    addItem(item);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 800);
  };

  useEffect(() => {
    fetch(`${API_URL}/api/menu`)
      .then(r => r.json())
      .then(setMenu)
      .catch(() => {});
  }, []);

  const filtered = activeCategory === 'All' ? menu : menu.filter(i => i.category === activeCategory);

  return (
    <View className="flex-1 bg-bistro-bg pt-12">
      <Text className="text-3xl font-bold text-white px-5 mb-2">The Intelligent Bistro</Text>
      <Text className="text-bistro-gold px-5 mb-4 text-sm">AI-Powered Dining Experience</Text>

      <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              className={`px-4 py-2 mr-2 rounded-full ${activeCategory === cat ? 'bg-bistro-accent' : 'bg-bistro-card'}`}
            >
              <Text className={`text-sm font-medium ${activeCategory === cat ? 'text-white' : 'text-gray-400'}`}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => String(i.id)}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View className="bg-bistro-card rounded-2xl p-4 mb-3 flex-row items-center">
            <Text className="text-4xl mr-4">{item.image}</Text>
            <View className="flex-1">
              <Text className="text-white font-semibold text-base">{item.name}</Text>
              <Text className="text-gray-400 text-xs mt-1" numberOfLines={1}>{item.description}</Text>
              <Text className="text-bistro-gold font-bold mt-1">${item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity onPress={() => handleAdd(item)} className={`w-9 h-9 rounded-full items-center justify-center ${addedId === item.id ? 'bg-green-500' : 'bg-bistro-accent'}`}>
              <Text className="text-white text-xl font-bold">{addedId === item.id ? '✓' : '+'}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
