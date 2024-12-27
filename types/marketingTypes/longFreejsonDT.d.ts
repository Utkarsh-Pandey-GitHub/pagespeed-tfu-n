export interface Meta {
  name: string;
  content: string;
  key: string;
}
export interface Head {
  title: string;
  meta: Meta;
}

export interface FaqObj {
  question: string;
  answer: string;
}

export interface CourseOutcome {
  outcome1: string;
  outcome2: string;
  outcome3: string;
  outcome4: string;
  outcome5: string;
}
export interface DataItem {
  tick_select_options?: any[];
  slug_Title: string;
  head: Head;
  language: string;
  headLine: string;
  hero_text: string;
  below_hook_line: string;
  buy_motive: Array<string>;
  course_outcome: CourseOutcome;
  teacher_features: Array<string>;
  FAQ_Content: Array<FaqObj>;
}

export interface schema {
  [key: string]: DataItem;
}
