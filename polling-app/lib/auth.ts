import GoogleProvider from "next-auth/providers/google";
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export const authOptions = {
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_ID || "",
          clientSecret: process.env.GOOGLE_SECRET || "",
          authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code"
            }
          }
        })
      ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async signIn({ user }: { user: any }) {
            await dbConnect();
            console.log(user);

            const userExists = await User.findOne({ id: user.id });
            if (userExists) {
                return { redirect: '/dashboard' };
            }

            console.log(user);

            await User.create({
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
            });
            return { redirect: '/dashboard' };
        }
    },
    pages: {
        signIn: '/login',
    },
};