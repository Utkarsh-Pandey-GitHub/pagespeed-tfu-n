interface Meta {
  name: string;
  content: string;
  key: string;
}

export interface DataItem {
  slug_Title: string;
  page_title: string;
  meta: Meta;
  heading: string;
  sub_heading: string;
  teacher_name: string;
  teacher_exp: string;
  custom_token?: string;
  amount?: number;
}

export interface schema {
  [key: string]: DataItem;
}
