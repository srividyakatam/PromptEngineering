import React from "react";
import { useState } from 'react';
import "../Styles/PromptAnalyzer.css";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

// const systemMessage = {"role": "system", "content": "You are an expert at crafting effective prompts and train others to achieve the same. For each prompt given to you, analyze the prompt for clarity, specificity and any potential baises. If a prompt is biased, reject the prompt saying you do not support biased prompts. Give any useful guidance and tips for the users to improve."}
export const PromptAnalyzer = () => {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT trained on tutoring Prompting Techniques! Ask me your anything related to crafting perfect prompts!",
      sentTime: "just now",
      direction: 'incoming',
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message }
    });

    const apiRequestBody = {
      "messages": [
        // systemMessage, 
        ...apiMessages // The messages from our chat with ChatGPT
      ]
    }

    await fetch("http://127.0.0.1:8080/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      }).then((data) => {
        return data.json();
      }).then((data) => {
        console.log(data);
        setMessages([...chatMessages, {
          message: data.response,
          sender: "ChatGPT",
          direction: 'incoming'
        }]);
        setIsTyping(false);
      });
  }

  return (
    <div className="Prompt-Analyzer">
      <p>Chat with GPT and get tips on improving your prompting skills</p>
      <div className = "chatbox">
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => {
                console.log(message)
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" attachButton={false} onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
};