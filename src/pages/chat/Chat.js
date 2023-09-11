import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Paper,
  IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import UserSelection from '../../components/UserSelection/UserSelection';
import UserMessages from '../../components/Messages/Messages';
import ChatModal from '../../components/ChatModal/ChatModal';
import Select from 'react-select';
import './chat.scss';
import useAxios from '../../hooks/useAxios';
import { useUserContext } from '../../context/useUserContext'
import { useSocketIO } from '../../hooks/useSocketIO';

let pollingInterval = null;

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openOneToOneModal, setOpenOneToOneModal] = useState(false);
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]); 
  const [selectedOneToOneUser, setSelectedOneToOneUser] = useState(null); 
  const [groupName, setGroupName] = useState('')
  const { getData, postData } = useAxios();
  const { user } = useUserContext()
  const { socket, joinNewUser } = useSocketIO(); 


  useEffect(() => {
    if (user?.id) joinNewUser(user.id);
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);


  socket?.on("new-message", (notificationData) => {
    if (notificationData.sender_id === user.id) return;

    const prevMessages = messages;
    if (prevMessages.find((message) => message.id === notificationData.id))
      return;

    prevMessages.push(notificationData);

    setMessages([...prevMessages]);

  });


  socket?.on("new-conversation", (notificationData) => {

    const isEligible = notificationData?.members.every(
      (participant) => participant.user_id !== user.id
    );

    if (isEligible) return;

    const list = conversations;

    if (list.find((con) => con.id === notificationData.id)) return

    if (notificationData.type === 'one_to_one') {
      const member = notificationData.members.find(member => member.user_id !== user.id);

      if (member) {
        list.push({
          ...notificationData,
          title: member.username
        });
      } else list.push(notificationData);

    } else {
      list.push(notificationData);
    }



    setConversations([...list]);
  });

  const handleSendMessage = () => {
    if (message.trim() === '') return;

    const newMessage = { content: message, send_by: user.username, sender_id: user.id };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    sendMessageToServer(message);
    setMessage('');
  };

  useEffect(() => {
    fetchConversations(); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessageToServer = async (message) => {
    const payload = {
      content: message,
      dialogueId: selectedConversation.id,
      sendBy: user.username,
      senderId: user.id
    }

    try {
      await postData('/users/conversations/send-message', payload);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchConversations = async () => {
    try {
      const { conversations } = await getData('/users/conversations');

      setConversations(conversations); 
      if (conversations.length) setSelectedConversation(conversations[0])
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { users } = await getData('/users');

      setUsers(users); 

    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const { messages } = await getData(`/users/conversations/${selectedConversation.id}`);

      setMessages(messages); 

    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    if (selectedConversation) {
      clearInterval(pollingInterval);

      socket.emit("joinConversation", selectedConversation.id + '-conversations');
      pollingInterval = setInterval(() => {
        fetchMessages(selectedConversation);
      }, 8000)
      fetchMessages(selectedConversation);
    }

    return () => {
      clearInterval(pollingInterval);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation])

  const handleUserSelection = (user) => {
    setSelectedConversation(user);
  };

  const handleCreateOneToOneChat = () => {
    fetchUsers();
    setOpenOneToOneModal(true);
  };

  const handleCreateGroupChat = () => {
    fetchUsers();
    setOpenGroupModal(true);
  };

  const handleCloseOneToOneModal = () => {


    setOpenOneToOneModal(false);
  };

  const handleCloseGroupModal = () => {
    setOpenGroupModal(false);
  };

  const handleStartGroupChat = async () => {
    const payload = {
      members: [...selectedUsers.map(user => user.value)],
      type: 'group',
      title: groupName,
    }

    try {
      await postData('/users/new-conversation', payload)

    } catch(error) {
      console.log('Error:: while starting conversations', error);
    }

    fetchConversations();
    setSelectedUsers([])
    setGroupName('');
    setOpenGroupModal(false);
  };

  const handleStartOneToOneChat = async () => {
    const payload = {
      members: [selectedOneToOneUser.value],
      type: 'one_to_one',
      title: selectedOneToOneUser.label,
    }

    const oneToOneConversations = conversations.filter((conversation) => conversation.type === 'one_to_one');

    for (const conversation of oneToOneConversations) {
      if (conversation.members.some(member => member.user_id === selectedOneToOneUser.value)) {
        setSelectedConversation(conversation);
        setSelectedOneToOneUser(null);
        setOpenOneToOneModal(false); 
        return;
      }
    }

    try {
      await postData('/users/new-conversation', payload)

    } catch(error) {
      console.log('Error:: while starting conversations', error);
    }

    fetchConversations();
    setSelectedOneToOneUser(null);
    setOpenOneToOneModal(false); 
  };

  return (
    <div
      style={{
        display: "flex",
        height: "90vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "300px",
          padding: "16px",
          borderRight: "1px solid #ccc",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            style={{ marginBottom: "10px" }}
            onClick={handleCreateGroupChat}
            className="chat-button"
          >
            Start Group Chat
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateOneToOneChat}
            className="chat-button"
          >
            Start One-to-One Chat
          </Button>

          <TextField
            label="Search users"
            fullWidth
            style={{ marginTop: "20px" }}
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <UserSelection
            searchQuery={searchQuery}
            conversations={conversations}
            selectedConversation={selectedConversation}
            handleUserSelection={handleUserSelection}
          />
        </div>
      </div>
      <div
        style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {selectedConversation && (
          <Paper
            elevation={3}
            style={{
              flex: "1",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                flex: "1",
                overflowY: "auto",
                marginBottom: "16px",
              }}
            >
              <UserMessages messages={messages} />
            </div>
            <div style={{ display: "flex" }}>
              <TextField
                label="Type your message..."
                fullWidth
                variant="outlined"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                style={{ flex: "1", marginRight: "8px" }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                style={{ alignSelf: "flex-end" }}
              >
                <SendIcon />
              </IconButton>
            </div>
          </Paper>
        )}
      </div>

      {/* One-to-One Chat Modal */}
      <ChatModal
        open={openOneToOneModal}
        onClose={handleCloseOneToOneModal}
        title="Create One-to-One Chat"
        type={1}
        selectedOneToOneUser={selectedOneToOneUser}
        content={
          <Select
            options={users.map((user) => ({
              value: user.id,
              label: user.username,
            }))}
            isClearable
            isLoading={!users.length}
            onChange={(selectedOption) =>
              setSelectedOneToOneUser(selectedOption)
            }
            placeholder="Select a user"
          />
        }
        onSubmit={handleStartOneToOneChat}
        disabled={!selectedOneToOneUser}
      />

      {/* Group Chat Modal */}
      <ChatModal
        open={openGroupModal}
        onClose={handleCloseGroupModal}
        title="Create Group Chat"
        type={2}
        selectedUsers={selectedUsers}
        content={
          <div className="group-chat">
            <TextField
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e?.target?.value)}
              placeholder="Enter your group name"
            />
            <Select
              options={users.map((user) => ({
                value: user.id,
                label: user.username,
              }))}
              isLoading={!users.length}
              isMulti
              onChange={(selectedOptions) => setSelectedUsers(selectedOptions)}
              placeholder="Select users"
            />
          </div>
        }
        onSubmit={handleStartGroupChat}
        disabled={!selectedUsers.length}
      />
    </div>
  );
}

export default Chat;
