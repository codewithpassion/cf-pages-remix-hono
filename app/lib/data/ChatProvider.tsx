import { createContext } from "react";
import { useChat } from "./useChat";
import { debounce } from "lodash";

type ChatProviderState = ReturnType<typeof useChat>;
const ChatContextDefaults: ChatProviderState = {
  isLoading: false,
  messages: [],
  threadId: null,
  latestMessage: "",
  styling: {},
  startThread: () => {
    return Promise.resolve();
  },
  query: debounce(() => Promise.resolve(), 0),
};

const ChatContext = createContext<ChatProviderState>(ChatContextDefaults);

export { ChatContext };
