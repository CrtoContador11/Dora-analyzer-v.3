export interface Question {
  id: number;
  text: {
    es: string;
    pt: string;
  };
  categoryId: number;
  options: {
    text: {
      es: string;
      pt: string;
    };
    value: number;
  }[];
}

export interface Category {
  id: number;
  name: {
    es: string;
    pt: string;
  };
}

export interface FormData {
  clientName: string;
  userName: string;
  answers: Record<number, number>;
  date: string;
}

export interface Draft extends FormData {
  lastQuestionIndex: number;
  isCompleted: boolean;
}