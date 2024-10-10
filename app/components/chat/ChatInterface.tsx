import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Message from "./Message";
import LoadingIndicator from "./LoadingIndicator";
import { ScrollArea } from "../../components/ui/scroll-area";
import { ChatContext } from "../../lib/data/ChatProvider";
import { Episode } from "@/lib/types";
import { Send } from "lucide-react";

export type ChatInterfaceProps = React.HTMLAttributes<HTMLDivElement>;

const ChatInterface: React.FC<ChatInterfaceProps> = (props) => {
  const [message, setMessage] = useState("");
  const [streamMessages] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    isLoading,
    messages,
    latestMessage,
    query,
    styling,
    getEpisodeDetails,
  } = useContext(ChatContext);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, latestMessage]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (message.trim()) {
        query(message, streamMessages);
        setMessage("");
      }
    },
    [message, query, streamMessages]
  );

  const onCommand = useCallback(
    (command: string) => {
      query(command, streamMessages);
      inputRef.current?.focus();
    },
    [query, streamMessages]
  );

  const makeLink = useCallback(
    async (episode: Episode) => {
      if (episode.link && episode.link.startsWith("https://overlaplife.com/")) {
        return episode.link;
      } else {
        const details = await getEpisodeDetails(episode.number);
        if (details) {
          if (
            details.link &&
            details.link.startsWith("https://overlaplife.com/")
          ) {
            return details.link;
          }
          const pubDate = new Date(details.publication_date);
          const year = pubDate.getFullYear();
          const month = pubDate.getMonth() + 1;
          const day = pubDate.getDate();
          const title = details.title
            .replace(/[.:,'`&$?!~-]/g, "")
            .replace(/ /g, "-")
            .toLowerCase()
            .replace(/(overlap-)*episode-[0-9]*/g, "")
            .replace(/-#[0-9]*/g, "")
            .replace(/^-?/, "");

          const formattedMonth = month.toString().padStart(2, "0");
          const formattedDay = day.toString().padStart(2, "0");
          const link = `https://overlaplife.com/${year}/${formattedMonth}/${formattedDay}/episode-${episode.number}-${title}`;

          return link;
        }
      }
    },
    [getEpisodeDetails]
  );

  const onEpisode = useCallback(
    (episode: Episode) => {
      (async (e) => {
        const link = await makeLink(e);
        if (link) {
          window.open(link, "_blank");
        }
      })(episode);
    },
    [makeLink]
  );

  const sendElement = useMemo(() => {
    if (typeof styling.input?.sendText === "string") {
      return <>{styling.input.sendText}</>;
    }
    return (
      <>
        <Send color="white" />
      </>
    );
  }, [styling?.input?.sendText]);

  return (
    <div
      className="flex flex-col h-full max-h-full bg-gray-900 text-white"
      {...props}
    >
      <div className="flex-grow overflow-hidden">
        <ScrollArea
          className="h-full "
          scrollBarClassName=""
          scrollAreaClassName=""
        >
          <div className="p-4">
            {messages.map((msg, index) => (
              <Message
                key={index}
                content={msg.content}
                role={msg.role}
                onCommand={onCommand}
                onEpisode={onEpisode}
                styling={styling}
              />
            ))}
            {latestMessage && (
              <Message
                content={latestMessage}
                role="assistant"
                isIncoming={true}
                styling={styling}
              />
            )}
            {isLoading && <LoadingIndicator />}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </div>
      <div className="border-t border-gray-400">
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 p-2 bg-slate-100 text-black rounded-l-xl focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 rounded-r-lg hover:bg-primary-600 focus:outline-none"
              style={{ backgroundColor: styling?.input?.sendButtonColor }}
            >
              {sendElement}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
