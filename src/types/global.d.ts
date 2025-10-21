export {};

declare global {
  interface Window {
    va?: (action: 'track', eventName: string, payload?: Record<string, unknown>) => void;
  }
}
