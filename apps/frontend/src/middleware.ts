import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/", // Redirect to home instead of default NextAuth login page
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
