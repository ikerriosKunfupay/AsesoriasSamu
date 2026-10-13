export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  messageId?: string;
  fieldErrors?: Record<string, string[]>;
};

export const initialActionState: ActionState = { status: "idle" };
