import { ConversationMessage } from "@/lib/types";
import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "../button";
import { Styling } from "@/lib/utils";
import { Episode } from "@/lib/types";

type TextWithAnswersAndEpisodes = {
  text: string;
  answer: string;
  episodes: Episode[];
  commands?: { command: string }[];
};

export type MessageProps = ConversationMessage & {
  isIncoming?: boolean;
  onEpisode?: (episode: Episode) => void;
  onCommand?: (command: string) => void;
  styling?: Styling;
};

function parseText(
  input: string | [{ type: string; text?: string }]
): TextWithAnswersAndEpisodes {
  const result: TextWithAnswersAndEpisodes = {
    text: "",
    answer: "",
    episodes: [],
    commands: [],
  };
  // Extract text
  const text = Array.isArray(input)
    ? input.map((item) => item.text).join("")
    : input;

  result.text = text.split("<answer>")[0].trim();

  // Extract answers
  const answerMatch = text.match(/<answer>(.*?)<\/answer>/s);
  if (answerMatch) {
    result.answer = answerMatch[1].trim();
  }

  // Extract episodes
  const episodesMatch = text.match(/<episodes>(.*?)<\/episodes>/s);
  if (episodesMatch) {
    const episodesContent = episodesMatch[1];
    const episodeMatches = episodesContent.match(/<episode>.*?<\/episode>/gs);

    if (episodeMatches) {
      result.episodes = episodeMatches.map((episodeString) => {
        const numberMatch = episodeString.match(
          /<episode_number>(.*?)<\/episode_number>/
        );
        const titleMatch = episodeString.match(
          /<episode_title>(.*?)<\/episode_title>/
        );
        const linkMatch = episodeString.match(
          /<episode_link>(.*?)<\/episode_link>/
        );

        return {
          number: numberMatch ? numberMatch[1] : "",
          title: titleMatch ? titleMatch[1] : "",
          link: linkMatch ? linkMatch[1] : "",
        };
      });
    }
  }

  const commandsMatch = text.match(/<commands>([\s\S]*?)<\/commands>/);
  if (commandsMatch) {
    const commandsXml = commandsMatch[1];
    const commands = commandsXml
      .match(/<command_\d+>(.*?)<\/command_\d+>/g)
      ?.map((cmd) => ({
        command: cmd.replace(/<\/?command_\d+>/g, ""),
      }));

    result.commands = commands;
    result.text = result.text.replace(commandsXml, "").trim();
  }

  if (result.text === "") {
    result.text = " ";
  }

  return result;
}

function stripXmlTags(input: string): string {
  return input.replace(/<\/?[^>]+(>|$)/g, "").trim();
}

const loadingMessages: string[] = [
  "Let me look this up...",
  "Rewinding the tape...",
  "Tuning in...",
  "Scanning the airwaves...",
  "Checking the playlist...",
  "Dialing into the archives...",
  "Spinning the record...",
];

function getRandomLoadingMessage(): string {
  const randomIndex = Math.floor(Math.random() * loadingMessages.length);
  return loadingMessages[randomIndex];
}

const Message = (
  { content, role, onCommand, onEpisode, isIncoming, styling }: MessageProps = {
    content: "",
    role: "human",
    isIncoming: false,
  }
) => {
  const isHuman = role === "human";
  const loadingMessage = useMemo(() => getRandomLoadingMessage(), []);

  const { text, answer, commands, episodes } = useMemo(() => {
    if (isIncoming) {
      if (content.includes("<answer>")) {
        if (!content.includes("</answer>")) {
          const answerStart = content.indexOf("<answer>");
          const answer = content.slice(answerStart);
          return { text: stripXmlTags(answer), answer: "", episodes: [] };
        }
      } else {
        return { text: loadingMessage, answer: "", episodes: [] };
      }
    }
    const { text, answer, commands, episodes } = parseText(content);
    return { text: stripXmlTags(text), answer, commands, episodes };
  }, [content, isIncoming, loadingMessage]);

  return (
    <div className={`flex ${isHuman ? "justify-end" : "justify-start"}`}>
      <div className="flex flex-col max-w-[80%]">
        <div
          className={`rounded-lg p-3 mb-2 mt-2 ${
            isHuman ? "bg-gray-50" : "bg-primary-500"
          }`}
          style={{
            backgroundColor: isHuman
              ? styling?.message?.human?.backgroundColor
              : styling?.message?.ai?.backgroundColor,
          }}
        >
          <ReactMarkdown
            className={`prose max-w-none ${isHuman ? "prose-human" : "prose-assistant"} `}
          >
            {isHuman ? text : answer.length === 0 && text ? text : answer}
          </ReactMarkdown>
        </div>
        {/* episodes */}
        {episodes?.length > 0 && (
          <div className="flex flex-row items-center justify-start flex-wrap">
            {episodes?.map((episode, index) => (
              <Button
                key={index}
                onClick={() => {
                  onEpisode?.(episode);
                }}
                variant="outline"
              >{`${episode.number}: ${episode.title}`}</Button>
            ))}
          </div>
        )}

        {/* commands */}
        {(commands?.length ? commands.length > 0 : false) && (
          <div className="flex flex-row items-center justify-start flex-wrap">
            {commands?.map((command, index) => (
              <Button
                key={index}
                onClick={() => {
                  onCommand?.(command.command);
                }}
                variant="outline"
              >{`${command.command}`}</Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
