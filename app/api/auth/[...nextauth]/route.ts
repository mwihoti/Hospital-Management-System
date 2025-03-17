import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "email", type: "email", placeholder: "jsmith@example.com"},
                password: {label: "Password", type: "password"},
            }, 
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                
            try {
                // Connect to the database
                await connectToDatabase();

                // Find the user in the database
                const user = await User.findOne({ email: credentials.email}).select("+password");

                if (!user) {
                    console.log("User not found:", credentials.email);
                    return null;
                }

                // Verify password
                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    console.log("Invalid password for user:", credentials.email)
                    return null;
                }

                // Create a session user object (without password)
                const sessionUser = {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };

                console.log("NextAuth login successfull:", sessionUser);
                return sessionUser;
            } catch (error) {
                console.error("NextAuth authorize error:", error);
                return null;
            }
            },

        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Add user role to the token if available
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token}) {
            // Add user role to the session
            if  (session.user) {
                session.user.role = token.role;
                session.user.id = token.id;
            }
            return session
        }
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/login"
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }