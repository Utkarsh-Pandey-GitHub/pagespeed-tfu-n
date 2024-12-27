export interface Meta {
  name: string;
  content: string;
  key: string;
}

export interface Head {
  title: string;
  meta: Meta;
}
export interface DataItem {
  slug_Title: string;
  head: Head;
  language: string;
  mcDuration: string;
  Heading: string;
  HeadingPara: string;
  teacherName: string;
  learningOutcome: LearningOutcome;
  meetYourMentor: MeetYourMentor;
  testimonials: Array<Array<string>>;
  FAQ_Content: Array<FaqObj>;
}

export interface FaqObj {
  question: string;
  answer: string;
}

export interface schema {
  [key: string]: DataItem;
}

export interface LearningOutcome {
  loHeading: string;
  loList: Array<string>;
}

export interface MeetYourMentor {
  mymPara: string;
  mymContent: Array<Array<string>>;
}
