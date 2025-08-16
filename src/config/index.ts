import dotenv from "dotenv";
dotenv.config();
export const config = {
  stripe: {
    apiKey: process.env["STRIPE_API_KEY"],
  },
};
