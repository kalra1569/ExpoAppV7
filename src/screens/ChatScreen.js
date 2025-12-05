// src/screens/ChatScreen.js (Firestore version, simplified)
import React, {useState, useEffect, useRef} from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, SafeAreaView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { db, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, auth, startAnonymousAuth, onAuthStateChanged } from '../firebase/firebase';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]); // will store messages sorted newest first
  const [text, setText] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // ensure user signed in (anonymous)
    startAnonymousAuth();
    const unsubAuth = onAuthStateChanged(auth, user => {
      if (user) setUserId(user.uid);
    });

    // subscribe to messages collection
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(50));
    const unsub = onSnapshot(q, snapshot => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    }, err => console.warn('snapshot err', err));

    return () => { unsub(); unsubAuth(); };
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      await addDoc(collection(db, 'messages'), {
        text: text.trim(),
        userId: userId || 'unknown',
        createdAt: serverTimestamp()
      });
      setText('');
    } catch(e) {
      console.warn('send error', e);
    }
  };

  return (
    <SafeAreaView style={{flex:1}}>
      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':'height'} keyboardVerticalOffset={90}>
        <FlatList
          data={messages}
          inverted
          keyExtractor={item=>item.id}
          renderItem={({item}) => (
            <View style={{padding:8, alignItems: item.userId === userId ? 'flex-end' : 'flex-start'}}>
              <Text style={{backgroundColor: item.userId===userId ? '#1e90ff' : '#fff', color: item.userId===userId ? '#fff' : '#000', padding:8, borderRadius:12}}>
                {item.text}
              </Text>
            </View>
          )}
          contentContainerStyle={{padding:12}}
        />
        <View style={{flexDirection:'row', padding:8, borderTopWidth:1, borderColor:'#eee'}}>
          <TextInput style={{flex:1, backgroundColor:'#fff', padding:10, borderRadius:20}} value={text} onChangeText={setText} placeholder="Message" onSubmitEditing={sendMessage} />
          <TouchableOpacity onPress={sendMessage} style={{marginLeft:8, justifyContent:'center', paddingHorizontal:12, backgroundColor:'#1e90ff', borderRadius:20}}>
            <Text style={{color:'#fff'}}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
