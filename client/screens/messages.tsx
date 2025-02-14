import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, BackHandler } from 'react-native';
import MessageTab from '../components/messages/message-tab';
import MessagePanel from '../components/messages/message-panel';
import _Button from '../components/control/button';
import _TextInput from '../components/control/text-input';
import { authTokenHeader, env, getLocalStorage, navProp, NavTo, setLocalAppSettingsCurrentChat, setLocalAppSettingsCurrentRooms } from '../helper';
import WavingHand from '../assets/images/waving_hand_svg';
import { Color, FontSize, Style } from '../style';
import _Text from '../components/control/text';
import { useNavigation } from '@react-navigation/native';

const MessagesScreen = (props: any) => {
  const [showPanel, updateShowPanel] = useState(false);
  const [currentChat, setCurrentChat] = useState<any>({});
  const [chats, setChats] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>();
  const [chatsHaveLoaded, setChatsHaveLoaded] = useState<boolean>(false);
  const navigation = useNavigation<navProp>();
  const [typing, setTyping] = useState<any>([]);
  const [receiveMsg, setReceiveMsg] = useState(null);
  const [openingChat, setOpeningChat] = useState('');

  // Initiate by getting the user info
  useEffect(() => {
    getUserInfo();
  }, [])

  useEffect(() => {
    const back = BackHandler.addEventListener('hardwareBackPress', backPress);
    return () => {
      back.remove();
    }
  });

  const backPress = () => {
    return goBack();
  }

  const goBack = () => {
    let rt = route();
    props.setShowingMessagePanel(false);
    if (rt && rt.params && rt.name && rt.name == NavTo.Messages && rt.params['from']) {
      if (rt.params['from'] === NavTo.Profile) {
        props.setNavSelector(NavTo.Search);
        navigation.navigate(NavTo.Profile, {profile: rt.params['user']} as never);
        return true;
      }
      else if (rt.params['from'] === NavTo.Listings) {
        props.setNavSelector(NavTo.Listings);
        navigation.navigate(NavTo.Listings);
        return true;
      }
    }
    else if (showPanel) {
      updateShowPanel(false);
      return true;
    }

    let routes = navigation.getState()?.routes;
    if (routes && routes[routes.length - 2]?.name && navigation.canGoBack()) {
      props.setNavSelector(routes[routes.length - 2]?.name);
      navigation.goBack();
      return true;
    }
    else
      return false;
  }

  const route = () => {
    if (navigation) {
      let state = navigation.getState();
      if (state && state.routes) {
        return state.routes[state.index];
      }
    }
    return null;
  };

  const getUserInfo = async () => {
    const userInfo = await getLocalStorage().then((res) => {return (res && res.user ? res.user : null)});
    // join own user room
    props.socket.emit('join_room', userInfo.id);
    setUserInfo(userInfo);
  }
  
  useEffect(() => {
    getChats();
  }, [userInfo])

  useEffect(() => {
    if (props.deleteChatNotifications) {
      if (chats) {
        const delChats = chats.map((chat) => {
          if (chat.id === props.deleteChatNotifications) {
            return {...chat, notificationCount: 0};
          }
          return chat;
        });
        setChats(delChats);
      }
      props.setDeleteChatNotifications("");
    }
  }, [props.deleteChatNotifications])

  const getChats = async () => {
    if (!userInfo?.id)
      return;

    const tokenHeader = await authTokenHeader();
    fetch(
      `${env.URL}/chats/allChats`, {method:'GET',headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}
    ).then(async ret => {
      const res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
      }
      else {
        let totalNotifications = 0;
        for (let i = 0; i < res.length; i++) {
          let muted = res[i]?.muted.find((x: any) => x === userInfo?.id);
          let count = 0;
          if (!muted) {
            if (res[i]?.Notification && res[i]?.Notification.length > 0) {
              res[i]?.Notification.map((x: any) => {
                if (x.userId === userInfo?.id)
                  count++;
              })
              if (res[i]?.lastMessage?.userId !== userInfo?.id) {
                totalNotifications += count;
              }
            }
          }
          Object.assign(res[i], {notificationCount: count});
        }
        connectToChatRooms(res);
        setChats(res);
        setChatsHaveLoaded(true);
        props.setMessageCount(totalNotifications);
      }
    });
  }

  const getUser = async (id: string) => {
    const tokenHeader = await authTokenHeader();
    return fetch(
      `${env.URL}/users/profile?userId=${id}`, {method:'GET',headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}
    ).then(async ret => {
      const res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
      }
      else {
        const user = {
          first_name: res.first_name,
          last_name: res.last_name,
          id: res.id,
          email: res.email,
          image: res.image,
        };
        return user;
      }
    });
  }

  const connectToChatRooms = async (chats: any) => {
    if (chats.length === 0)
      return;
    const rooms = await chats.map((chat: any) => {
      return chat.id;
    })
    setLocalAppSettingsCurrentRooms(rooms);
    props.socket.emit('join_room', rooms)
  }

  useEffect(() => {
    if (props.receiveTyping) {
      let idx = typing.findIndex((x: any) => {
        return x.chat === props.receiveTyping?.chatId && x.user === props.receiveTyping?.userId
      });

      if (props.receiveTyping?.isTyping) {
        if (idx < 0) {
          if (props.receiveTyping) {
            let chat = props.receiveTyping?.chatId;
            let user = props.receiveTyping?.userId;
            if (chat && user) {
              setTyping([...typing, {chat: chat, user: user}]);
            }
          }
        }
      }
      else if (idx >= 0) {
        let typers = [] as never[];
        typing.forEach((x: any) => typers.push(x as never))
        typers.splice(idx, 1)
        setTyping(typers);
      }

    }
  }, [props.receiveTyping])

  useEffect(() => {
    if (currentChat.id) {
      deleteNotifications();
    }
  }, [currentChat]);

  useEffect(() => {
    if (props?.route?.params?.user && !chatsHaveLoaded && userInfo) {
      updateShowPanel(true);
      setOpeningChat(props?.route?.params?.user);
    }
  }, [chats]);

  useEffect(() => {
    if (openingChat) {
      openOrCreateChat(openingChat);
      setOpeningChat('');
    }
  }, [openingChat]);

  useEffect(() => {
    if (props.receiveMessage) {
      const newMsg = chats.find(chat => chat.id === props.receiveMessage?.chatId);
      if (newMsg && newMsg.blocked)
        return;
      setReceiveMsg(props.receiveMessage);
      updateTabs(props.receiveMessage);
      props.setReceiveMessage(null);
    }
  }, [props.receiveMessage])

  useEffect(() => {
    if (props.receiveBlock) {
      updateBlocked(props.receiveBlock?.chat);
      props.setReceiveBlock(null);
    }
  }, [props.receiveBlock])

  useEffect(() => {
    if (props.receiveChat) {
      props.socket.emit('join_room', props.receiveChat?.id);
      const newChats = [props.receiveChat, ...chats];
      setChats(newChats);
      props.setReceiveChat(null);
    }
  }, [props.receiveChat])

  // Start - Added by Joseph for push notifications
  useEffect(() => {
    if (chats && props.openChatFromPush) {
      let chat = chats.find(chat => chat.id === props.openChatFromPush);
      if (chat) {
        let data = {id: props.openChatFromPush, is_showing: showPanel, disabled: false, current_page: NavTo.Messages};
        setLocalAppSettingsCurrentChat(data);
        setCurrentChat(chat);
        updateShowPanel(true);
        props.setOpenChatFromPush('');
      }
    }
  }, [chats, props.openChatFromPush]);

  useEffect(() => {
    if (props.receiveNotification) {
      if (props.receiveNotification?.userId !== userInfo?.id)
        return;
      const rcvChats = chats.map((chat) => {
        if (chat.id === props.receiveNotification?.chatId) {
          if (currentChat.id === chat.id && showPanel) {
            deleteNotifications();
            return chat;
          };
          
          let count = 0;
          let muted = chat.muted.find((x: any) => x === userInfo?.id);
          if (!muted) {
            count = 1;
          }
          return {...chat, notificationCount: (chat.notificationCount + count)};
        }
        return chat;
      });
      setChats(rcvChats);
    }
  }, [props.receiveNotification]);

  useEffect(() => {
    let chatId = '';
    if (currentChat) {
      chatId = (currentChat as any).id
    }
    let data = {id: chatId, is_showing: showPanel, disabled: false, current_page: NavTo.Messages};
    setLocalAppSettingsCurrentChat(data);
    props.setShowingMessagePanel(showPanel);
    props.setCurrentChat(chatId);
  }, [currentChat, showPanel]);
  // End

  useEffect(() => {
    if (props.showingMessagePanel != showPanel) {
      // JA Hacky but works to avoid changing a bunch of code 31323
      setTimeout(() => {
        updateShowPanel(props.showingMessagePanel);
      }, 0);
    }
  }, [props.showingMessagePanel])

  useEffect(() => {
    if (!props?.route?.params?.user || !userInfo)
      return;

    updateShowPanel(true);
    setOpeningChat(props?.route?.params?.user);
  }, [props?.route?.params?.requestId])

  const createChat = async (userIdOne: string, userIdTwo: string) => {
    if (userIdOne === userIdTwo)
      return;

    const obj = {userIdOne: userIdOne, userIdTwo: userIdTwo};
    const js = JSON.stringify(obj);
    const tokenHeader = await authTokenHeader();
    await fetch(
      `${env.URL}/chats`, {method:'POST', body:js, headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}
    ).then(async ret => {
      let res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
        updateShowPanel(false);
      }
      else {
        let chat = res['chat'];
        if (chat) {
          const user = await getUser(userIdTwo);
          if (!user)
            return;

          // Send new chat info to other user.
          // Here we use userTwo's info for the users array so that we know which room to send the new chat to.
          const usersForUserTwo = [user];
          const chatForUserTwo = {...chat, users: usersForUserTwo, userInfo: userInfo, blocked: '', muted: [], notificationCount: 0};
          console.log('chatForUserTwo: ', chatForUserTwo);
          props.socket.emit('create_chat', chatForUserTwo);

          // Set up new chat info for current user
          const users = [user];
          chat = {...chat, users: users, userInfo: user, blocked: '', muted: [], notificationCount: 0};
          console.log('chat: ', chat);
          const newChats = [chat, ...chats];
          if (chat && chat.id)
            props.socket.emit('join_room', chat.id);
          setChats(newChats);
          setCurrentChat(chat);
          updateShowPanel(true);
        }
      }
    });
  };
  
  const openOrCreateChat = (userId: string) => {
    let chat = chats.filter((chat) => {
      return chat?.userInfo?.id === userId;
    })
    // Chat exists
    if (chat.length !== 0) {
      setCurrentChat(chat[0]);
      updateShowPanel(true);
      return;
    }
    createChat(userInfo.id, userId);
  };

  const deleteNotifications = async () => {
    const obj = {userId: userInfo.id, chatId: currentChat.id};
    const js = JSON.stringify(obj);
    const tokenHeader = await authTokenHeader();
    return fetch(
      `${env.URL}/notifications`, {method:'DELETE', body:js, headers:{'Content-Type': 'application/json', 'authorization': tokenHeader}}
    ).then(async ret => {
      let res = JSON.parse(await ret.text());
      if (res.Error) {
        console.warn("Error: ", res.Error);
      } else {
        const delChats = chats.map((chat) => {
          if (chat.id === currentChat.id) {
            let cnt = props.messageCount - chat.notificationCount;
            props.setMessageCount(cnt);
            return {...chat, notificationCount: 0};
          }
          return chat;
        });
        setChats(delChats);
      }
    });
  };  
  const renderChatTabItem = (item: any) => {
    return <MessageTab
    showPanel={showPanel}
    updateShowPanel={updateShowPanel}
    chat={item}
    setCurrentChat={setCurrentChat}
    isDarkMode={props.isDarkMode}
    typing={typing}
  />
  }
  
  const updateTabs = async (data: any) => {
    if (chats.length === 0)
      return;

    const latestMessage = {content: data.content, userId: data.userId};
    let newChat: any;
    let newChats = chats.filter((chat) => {
      const condition = data.chatId !== chat.id; 
      if (!condition) {
        newChat = chat;
      }
      return condition;
    })
    newChat = {...newChat, lastMessage: latestMessage};
    newChats = [newChat, ...newChats];
    setChats(newChats);
  }

  function updateBlocked(c: any) {
    if (!c) return;
    const newChats = chats.map((chat) => {
      if (chat.id === c.id) {
        return { ...chat, blocked: c.blocked }
      }
      return chat;
    });
    setChats(newChats);
    setCurrentChat({...currentChat, blocked: c.blocked})
  }

  function updateMuted(c: any) {
    if (!c) return;
    const newChats = chats.map((chat) => {
      if (chat.id === c.id) {
        return { ...chat, muted: c.muted }
      }
      return chat;
    });
    setChats(newChats);
    setCurrentChat({...currentChat, muted: c.muted})
  }

  const styles = StyleSheet.create({
    noMessagesContainer: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textStyle: {
      fontSize: FontSize.large,
      fontWeight: 'bold',
      marginHorizontal: 40,
      textAlign: 'center',
      color: Color(props.isDarkMode).text
    },
    subTextStyle: {
      fontWeight: 'normal',
      marginTop: 10,
      marginBottom: 20,
      fontSize: FontSize.default
    },
    loadingScreen: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1
    },
  });

  if (!chatsHaveLoaded) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator
        size="large"
        color={Color(props.isDarkMode).gold}
        />
      </View>
    );
  }

  if (chatsHaveLoaded && chats.length === 0) {
    return (
      <View style={styles.noMessagesContainer}>
          <WavingHand width={100} height={100}/>
          <_Text
          style={styles.textStyle}
          >
            No messages
          </_Text>
          <_Text
          style={[styles.textStyle, styles.subTextStyle]}
          >
            Find your next roommate by starting a chat from a profile through the explore page!
          </_Text>
          <_Button
          style={Style(props.isDarkMode).buttonInverted}
          textStyle={Style(props.isDarkMode).buttonInvertedText}
          onPress={() => {
            props.setNavSelector(NavTo.Search);
            navigation.navigate(NavTo.Search);
          }}
          isDarkMode={props.isDarkMode}
          >
            Explore
          </_Button>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={chats}
        renderItem={({item}) => renderChatTabItem(item)}
        keyExtractor={(item, index) => String(index)}
        style={showPanel ? {display: 'none'} : {display: 'flex'}}
      />
      <MessagePanel
        showPanel={showPanel}
        socket={props.socket}
        userInfo={userInfo}
        updateShowPanel={updateShowPanel}
        chat={currentChat}
        updateBlocked={updateBlocked}
        updateMuted={updateMuted}
        isDarkMode={props.isDarkMode}
        receiveMessage={receiveMsg}
        receiveTyping={props.receiveTyping}
        typing={typing}
      />
    </>
  );
};

export default MessagesScreen;