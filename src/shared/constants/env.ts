const required = (value: string | undefined, key: string): string => {
  if (!value) {
    throw new Error(`Missing required env: ${key}`);
  }
  return value;
};

export const ENV = {
  API_BASE_URL: required(import.meta.env.VITE_API_BASE_URL, "VITE_API_BASE_URL"),
};
