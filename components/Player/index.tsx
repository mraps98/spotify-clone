import { useSession } from 'next-auth/react';
import {
  ChangeEventHandler,
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../../atoms/songAtom';
import { useSongInfo } from '../../hooks/useSongInfo';
import { useSpotify } from '../../hooks/useSpotify';
import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from '@heroicons/react/outline';
import {
  RewindIcon,
  SwitchHorizontalIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
} from '@heroicons/react/solid';
import { debounce } from 'lodash';

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

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyService
        .setVolume(volume)
        .catch((err) => console.log('Premium required'));
    }, 500),
    []
  );

  const handlePlayPause = () => {
    spotifyService.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
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

  const handleChangeVolume: ChangeEventHandler<HTMLInputElement> = (e) => {
    setVolume(Number(e.target.value));
  };

  const handleClickVolumeDown: MouseEventHandler<SVGSVGElement> = () => {
    volume > 0 && setVolume(volume - 10);
  };

  const handleClickVolumeUp: MouseEventHandler<SVGSVGElement> = () => {
    volume < 100 && setVolume(volume + 10);
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

        <FastForwardIcon className="player-button" />

        <ReplyIcon className="player-button" />
      </div>

      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          className="player-button"
          onClick={handleClickVolumeDown}
        />
        <input
          type="range"
          value={volume}
          min={0}
          max={100}
          className="w-14 md:w-28"
          onChange={handleChangeVolume}
        />
        <VolumeUpIcon className="player-button" onClick={handleClickVolumeUp} />
      </div>
    </div>
  );
};
export default Player;
