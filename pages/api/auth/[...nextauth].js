import clientPromise from "@/lib/mongidb";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth, { getServerSession } from "next-auth";
// import GithubProvider from "next-auth/providers/github"
// import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";

const adminEmails = ["obidniakm@gmail.com"];

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // EmailProvider({
    //   server: process.env.EMAIL_SERVER,
    //   from: process.env.EMAIL_FROM,
    // }),
    // ...add more providers here
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({ session, token, user }) => {
      // console.log("🚀 ~ file: [...nextauth].js:31 ~ token, account, profile:", {
      //   session,
      //   user,
      //   token,
      // });
      if (adminEmails.includes(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
};

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if(!adminEmails.includes(session?.user?.email)){
    res.status(401)
    res.end()
    throw 'Not an admin'
  } 
}
export default NextAuth(authOptions);
