import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../../atoms/songAtom';
import { useSongInfo } from '../../hooks/useSongInfo';
import { useSpotify } from '../../hooks/useSpotify';
import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from '@heroicons/react/ouline';
import {
  RewindIcon,
  SwitchHorizontalIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
} from '@heroicons/react/solid';

const Player = () => {
  const spotifyService = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const currentSongInfo = useSongInfo();

  useEffect(() => {
    if (spotifyService.getAccessToken() && !currentTrackId) {
      fetchCurrentSongFromAccount();
      setVolume(50);
    }
  }, [currentTrackId, spotifyService, session]);

  const handlePlayPause = () => {
    spotifyService.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyService
          .pause()
          .catch(() =>
            alert('You need a premium spotify account to use this feature.')
          );
        setIsPlaying(false);
      } else {
        spotifyService
          .play()
          .catch(() =>
            alert('You need a premium spotify account to use this feature.')
          );
        setIsPlaying(true);
      }
    });
  };

  const fetchCurrentSongFromAccount = () => {
    if (!currentSongInfo) {
      spotifyService.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item?.id!);
      });
      spotifyService.getMyCurrentPlaybackState().then((data) => {
        setIsPlaying(data.body?.is_playing);
      });
    }
  };

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={currentSongInfo?.album?.images?.[0].url}
          alt=""
        />
        <div>
          <h3>{currentSongInfo?.name}</h3>
          <p>{currentSongInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      {/* Center */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="player-button" />
        <RewindIcon className="player-button" />

        {isPlaying ? (
          <PauseIcon
            className="player-button w-10 h-10"
            onClick={handlePlayPause}
          />
        ) : (
          <PlayIcon
            className="player-button w-10 h-10"
            onClick={handlePlayPause}
          />
        )}
      </div>
    </div>
  );
};
export default Player;
