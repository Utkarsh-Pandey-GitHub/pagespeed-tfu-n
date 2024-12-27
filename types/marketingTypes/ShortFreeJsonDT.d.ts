interface Meta {
  name: string;
  content: string;
  key: string;
}

export interface DataItem {
  slug_Title: string;
  page_title: string;
  meta: Meta;
  language: string;
  heading: string;
  sub_heading: string;
}

export interface schema {
  [key: string]: DataItem;
}

export type Params = Promise<{ id:string,slug: string }>
export type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>
