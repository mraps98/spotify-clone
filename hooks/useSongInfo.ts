import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState } from '../atoms/songAtom';
import { useSpotify } from './useSpotify';

export const useSongInfo = () => {
  const spotifyService = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentTrackId) {
        const trackInfoFromSpotifyApi = await (
          await fetch(`https://api.spotify.com/v1/tracks/${currentTrackId}`, {
            headers: {
              Authorization: 'Bearer ' + spotifyService.getAccessToken(),
            },
          })
        ).json();

        setSongInfo(trackInfoFromSpotifyApi);
      }
    };

    fetchSongInfo();
  }, [currentTrackId, spotifyService]);

  return songInfo;
};
