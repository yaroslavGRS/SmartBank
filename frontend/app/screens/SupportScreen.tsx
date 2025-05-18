import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  Appbar,
  Text,
  TextInput,
  Button,
  IconButton,
  Avatar,
} from 'react-native-paper';

type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
};

export default function SupportScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', text: 'Hi! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim(),
    };

    setMessages(prev => [...prev, newMsg]);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'Thank you for your message! A support agent will reply shortly.',
        },
      ]);
    }, 1000);

    setInput('');
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.botMessage]}>
        <Avatar.Icon
          size={32}
          icon={isUser ? 'account' : 'robot'}
          style={styles.avatar}
        />
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Appbar */}
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Support" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      {/* Chat history */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chat}
      />
      <KeyboardAvoidingView
        style={styles.inputContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity onPress={() => console.log('Attach file')}>
          <IconButton icon="paperclip" size={24} />
        </TouchableOpacity>
        <TextInput
          placeholder="Type a message"
          value={input}
          onChangeText={setInput}
          style={styles.textInput}
          mode="outlined"
        />
        <Button mode="contained" onPress={handleSend} style={styles.sendButton}>
          Send
        </Button>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: {
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerTitle: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chat: {
    padding: 16,
    paddingBottom: 100,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatar: {
    marginRight: 8,
    backgroundColor: '#ccc',
  },
  messageText: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    maxWidth: '80%',
    fontSize: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  botMessage: {
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  textInput: {
    flex: 1,
    marginHorizontal: 8,
  },
  sendButton: {
    borderRadius: 8,
  },
});
