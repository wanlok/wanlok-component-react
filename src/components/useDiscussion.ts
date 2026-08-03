import { useEffect, useRef, useState } from "react";
import { Message } from "../services/Types";

export const useDiscussion = ({
  messages,
  onAddMessage
}: {
  messages: Message[];
  onAddMessage: (name: string, text: string) => void;
}) => {
  const [isDeletingMessages, setIsDeletingMessages] = useState(false);
  const [name, setName] = useState(() => localStorage.getItem("discussionName") ?? "");
  const stackRef = useRef<HTMLDivElement>(null);
  const numberOfMessagesRef = useRef(messages.length);

  useEffect(() => {
    const scrollable = stackRef.current?.parentElement;
    if (scrollable && messages.length > numberOfMessagesRef.current) {
      scrollable.scrollTo({ top: scrollable.scrollHeight, behavior: "smooth" });
    }
    numberOfMessagesRef.current = messages.length;
  }, [messages.length]);

  const onNameChange = (value: string) => {
    setName(value);
    localStorage.setItem("discussionName", value);
  };

  const onSendMessage = (text: string) => {
    setIsDeletingMessages(false);
    onAddMessage(name, text);
  };

  const onToggleDeleteMessages = () => setIsDeletingMessages((prev) => !prev);

  return {
    isDeletingMessages,
    name,
    onNameChange,
    onSendMessage,
    onToggleDeleteMessages,
    stackRef
  };
};
