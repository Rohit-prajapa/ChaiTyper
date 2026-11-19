import api from "./api";

export interface SaveSessionData {
  language: "javascript" | "python" | "cpp";
  lessonId: string;
  lessonTitle: string;
  wpm: number;
  cpm: number;
  accuracy: number;
  errors: number;
  duration: number;
  completed: boolean;
}

// MongoDB session response
export interface TypingSession {
  _id: string;
  user: string;
  language: "javascript" | "python" | "cpp";
  lessonId: string;
  lessonTitle: string;
  wpm: number;
  cpm: number;
  accuracy: number;
  errorCount: number;
  duration: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SaveSessionResponse {
  success: boolean;
  message: string;
  session: TypingSession;
}

interface GetSessionsResponse {
  success: boolean;
  message: string;
  count: number;
  sessions: TypingSession[];
}

// Save a typing session
export const saveTypingSession = async (data: SaveSessionData) => {
  const response = await api.post<SaveSessionResponse>("/sessions", data);

  return response.data;
};

// Fetch typing history
export const getTypingSessions = async () => {
  const response = await api.get<GetSessionsResponse>("/sessions");

  return response.data;
};
