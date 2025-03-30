
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  fileType: string;
  category: string;
  url: string;
  isNew: boolean;
  uploadDate: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  };
  mood: string;
  notes: string;
  waterIntake: number;
  hasCoachFeedback: boolean;
  coachFeedback: string;
}
