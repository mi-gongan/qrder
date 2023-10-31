export const tossClientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "";
export const tossSecretKey =
  "Basic " + btoa(process.env.NEXT_PUBLIC_TOSS_SECRET_KEY + ":");
