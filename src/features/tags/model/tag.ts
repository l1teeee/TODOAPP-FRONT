export type TagColor =
  | "purple"
  | "blue"
  | "pink"
  | "orange"
  | "green"
  | "gray";

export interface Tag {
  id: string;
  name: string;
  color: TagColor;
}
