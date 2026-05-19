import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useCartStore } from '../store/cartStore';

export default function CartScreen() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-bistro-bg items-center justify-center">
        <Text className="text-6xl mb-4">🛒</Text>
        <Text className="text-white text-xl font-semibold">Your cart is empty</Text>
        <Text className="text-gray-400 mt-2">Add items from the menu or chat with our AI</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bistro-bg pt-12">
      <View className="flex-row justify-between items-center px-5 mb-4">
        <Text className="text-2xl font-bold text-white">Your Order</Text>
        <TouchableOpacity onPress={clearCart} className="bg-red-900/40 px-3 py-1 rounded-full">
          <Text className="text-red-400 text-sm">Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={i => String(i.id)}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 160 }}
        renderItem={({ item }) => (
          <View className="bg-bistro-card rounded-2xl p-4 mb-3 flex-row items-center">
            <Text className="text-3xl mr-3">{item.image}</Text>
            <View className="flex-1">
              <Text className="text-white font-semibold">{item.name}</Text>
              <Text className="text-bistro-gold text-sm">${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)} className="bg-gray-700 w-8 h-8 rounded-full items-center justify-center">
                <Text className="text-white text-lg">−</Text>
              </TouchableOpacity>
              <Text className="text-white mx-3 font-bold text-base">{item.quantity}</Text>
              <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} className="bg-bistro-accent w-8 h-8 rounded-full items-center justify-center">
                <Text className="text-white text-lg">+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View className="absolute bottom-0 left-0 right-0 bg-bistro-card border-t border-gray-800 p-5 pb-8">
        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-400 text-base">Total</Text>
          <Text className="text-bistro-gold text-xl font-bold">${getTotal().toFixed(2)}</Text>
        </View>
        <TouchableOpacity className="bg-bistro-accent py-4 rounded-2xl items-center">
          <Text className="text-white font-bold text-base">Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
