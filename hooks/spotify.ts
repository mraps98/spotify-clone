import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import spotifyService from '../lib/spotify';

export const useSpotify = () => {
  const { data: session, status }: any = useSession();
  useEffect(() => {
    if (session) {
      if (session.error === 'RefreshAccessTokenError') {
        signIn();
      }
    }

    spotifyService.setAccessToken(session?.user?.accessToken);
  }, [session]);

  return spotifyService;
};
