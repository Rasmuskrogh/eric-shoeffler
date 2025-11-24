import NextAuth from "next-auth";
import { authOptions } from "@/components/AdminDashboard/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
