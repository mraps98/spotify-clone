import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import SpotifyProvider from 'next-auth/providers/spotify';
import spotifyService, { SPOTIFY_LOGIN_URL } from '../../../lib/spotify';

const refreshAccessToken = async (token: any) => {
  try {
    spotifyService.setAccessToken(token.accessToken);
    spotifyService.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyService.refreshAccessToken();

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: +Date.now + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error(error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
};

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: SPOTIFY_LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }: any) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          userName: account.providerAccountId,
          accessTokenExpires: account.expires_at! * 1000,
        };
      }

      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    },
  },
});
