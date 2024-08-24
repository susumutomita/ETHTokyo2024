import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SiweMessage } from "siwe"; // SIWE (Sign-In with Ethereum) を使った認証

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "MetaMask",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      authorize: async (credentials) => {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || "{}"),
          );

          // Generate a nonce if it doesn't exist
          const nonce = siwe.nonce || generateNonce(); // nonceの生成または既存のものを使用

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: process.env.NEXTAUTH_URL,
            nonce: nonce, // ここで nonce を使用
          });

          if (result.success) {
            return {
              id: siwe.address,
              name: siwe.address,
              email: "",
              image: "",
            };
          }
          return null;
        } catch (e) {
          console.error("Authentication error:", e);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      session.address = token.sub;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
};

// nonceの生成関数
function generateNonce() {
  return Math.floor(Math.random() * 1000000).toString();
}
