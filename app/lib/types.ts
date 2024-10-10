export type Roles = "human" | "assistant";

export type ConversationMessage = {
  content: string;
  role: Roles;
};

export type Episode = {
  number: string;
  title: string;
  link: string;
}


export type ConversationMessages = ConversationMessage[];
