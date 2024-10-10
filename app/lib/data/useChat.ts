import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { API_ENDPOINT } from "./constants";
import { ConversationMessage, ConversationMessages } from "@/lib/types";
import { EventSourceParserStream } from "eventsource-parser/stream";
import { debounce } from "lodash";
import { useSearchParams } from "react-router-dom";
import { StoredMessage } from "@langchain/core/messages";
import { Styling } from "@/lib/utils";

export type ApiData = {
  stream: boolean;
  message: string;
  thread_id: string;
};

export type UseChat = ReturnType<typeof useChat>;
export type UseChatProps = {
  initialMessages: ConversationMessages;
  apiPrefix?: string;
  threadId?: string;
  storeThreadId?: (threadId: string) => void;
  styling?: Styling;
};

export type UserChatWithParamProps = Omit<UseChatProps, "threadId" | "storeThreadId">;

const useChatWithParam = ({ initialMessages, apiPrefix, styling }: UserChatWithParamProps) => {
  const [params, setParams] = useSearchParams()

  const [threadId, setThreadId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (params.has("id")) {
      setThreadId(params.get("id") as string);
    }
  }, [params])

  const memoizedData = useMemo(() => ({
    initialMessages,
    apiPrefix,
    threadId: threadId,
    storeThreadId: (_t: string) => setParams({ id: _t }),
    styling
  }), [initialMessages, apiPrefix, threadId, styling, setParams])

  return useChat(memoizedData);
}

const useChat = ({ initialMessages, apiPrefix, threadId: externalThreadId, storeThreadId, styling: _styling }: UseChatProps) => {


  const memoizedDependencies = useMemo(() => ({
    apiPrefix,
    initialMessages
  }), [apiPrefix, initialMessages]);

  const styling = useMemo<Styling>(() => { return _styling || {} }, [_styling]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [latestMessage, setLatestMessage] = useState<string>("");
  const loaded = useRef(false);

  const [messages, setMessages] = useState<ConversationMessages>([
    ...memoizedDependencies.initialMessages,
  ])

  const apiEndpoint = useMemo(() => {
    const url = memoizedDependencies.apiPrefix?.startsWith("http") ? memoizedDependencies.apiPrefix : `${API_ENDPOINT}${memoizedDependencies.apiPrefix}`;
    return url;
  }, [memoizedDependencies.apiPrefix]);

  const getEpisodeDetails = useCallback(async (episodeNumber: string) => {
    const response = await fetch(`${API_ENDPOINT}/episodes/${episodeNumber}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.episode;
  }, []);

  const fetchData = useCallback(async (threadId: string) => {
    if (loaded.current) return;

    console.log("Fetching messages for thread", threadId);
    const messagesQuery = await fetch(`${apiEndpoint}/messages/${threadId}`);
    if (messagesQuery.ok) {
      const data = await messagesQuery.json() as StoredMessage[];
      const messages = data.map((message) => {
        console.log(message.data.content)
        return {
          role: message.type === "human" ? "human" : "assistant",
          content: getCombinedContent(message.data.content),
        } as ConversationMessage
      })
        .filter((message) => typeof message.content === 'string' ? message.content.trim() !== "" : true)
        .filter((message) => message.role === 'human' || (message.role === "assistant" && typeof message.content === 'string' ? message.content.startsWith("<answer>") : true))
        ;
      setMessages([...memoizedDependencies.initialMessages, ...messages]);
      loaded.current = true;
    };

  }, [apiEndpoint, memoizedDependencies]);

  useEffect(() => {
    if (!threadId) return;
    fetchData(threadId).catch(console.error);
  }, [fetchData, threadId]);

  useEffect(() => {
    if (externalThreadId) {
      setThreadId(externalThreadId);
      storeThreadId?.(externalThreadId);
    }
  }, [externalThreadId, storeThreadId]);

  const startThread = useCallback(async () => {
    setIsLoading(true);

    const response = await fetch(`${apiEndpoint}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      setIsLoading(false);
      setThreadId(null);
      return;
    }
    else {
      const data = await response.json();
      console.log(data);
      setThreadId(data.thread_id);
      storeThreadId?.(data.thread_id);
    }

    setIsLoading(false);
    return;
  }, [apiEndpoint, storeThreadId]);

  const obtainAPIResponse = useCallback(
    async (apiRoute: string, apiData: ApiData) => {
      const apiResponse = await fetch(apiRoute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!apiResponse.body) return;

      if (apiData.stream) {
        const reader = apiResponse.body
          .pipeThrough(new TextDecoderStream())
          .pipeThrough(new EventSourceParserStream())
          .getReader();

        let incomingMessage = "";

        for (; ;) {
          const { value, done } = await reader.read();
          if (done) {
            setMessages((messages) => [
              ...messages,
              { role: "assistant", content: incomingMessage },
            ]);
            setLatestMessage("");
            setIsLoading(false)
            break;
          }
          if (value) {
            const eventName = value.event;
            if (eventName === "message-delta") {
              incomingMessage += value.data;
              setLatestMessage(incomingMessage);
            } else if (eventName === "usage") {
              console.log("Usage: ", value.data);
            } else if (eventName === "done") {
              setIsLoading(false);
            }
          }
        }
      } else {
        const data = await apiResponse.json();
        setMessages((messages) => [
          ...messages,
          { role: "assistant", content: data.message },
        ]);
        setIsLoading(false);
      }
    },
    []
  );


  const queryBase = useCallback(
    async (message: string, stream: boolean = true) => {
      setIsLoading(true);
      const queryMessage: ConversationMessage = {
        role: "human",
        content: message,
      };

      setMessages((prevMessages) => [...prevMessages, queryMessage]);

      await obtainAPIResponse(`${apiEndpoint}/message`, {
        stream: stream,
        message: message,
        thread_id: threadId!,
      });
    },
    [apiEndpoint, obtainAPIResponse, threadId]
  );

  const query = useMemo(() => debounce(queryBase, 500), [queryBase]);

  return useMemo(() => ({
    startThread,
    threadId,
    isLoading,
    latestMessage,
    messages,
    query,
    styling,
    getEpisodeDetails,
  }), [getEpisodeDetails, isLoading, latestMessage, messages, query, startThread, styling, threadId])
}


function getCombinedContent(message: string | [{ index: number, type: 'text', text: string }]): string {
  if (typeof message === "string") {
    return message;
  }
  else if (Array.isArray(message)) {
    return message
      .filter(block => block.type === "text")
      .map(block => block.type === "text" ? block.text : "")
      .join("\n");
  }
  return "";
}

export { useChat, useChatWithParam };
