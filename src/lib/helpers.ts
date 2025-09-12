import { AxiosError } from "axios";

export const handleError = (error: unknown): string => {
  console.log(error);
  let message = error instanceof Error ? error.message : String(error);
  if (error instanceof AxiosError) {
    message = error.response?.data?.message || message;
  }
  return message;
};
