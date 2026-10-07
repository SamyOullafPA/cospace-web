import axios, { isAxiosError } from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
  },
});

export default api;

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string }>(error)) {
    if (error.response) {
      return error.response.data?.message ?? `The server returned an error (${error.response.status}).`;
    }
    // A request with no response means the server was unreachable (offline, server down, or CORS).
    if (error.request) {
      return "Can't reach the server. Check your connection and try again.";
    }
  }
  return "Something went wrong. Please try again.";
}
