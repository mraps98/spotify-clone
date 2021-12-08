import { useRecoilValue } from 'recoil';
import { playlistState } from '../../../atoms/playlistAtom';
import Song from './Song';

const Songs = () => {
  const currentPlaylist: SpotifyApi.SinglePlaylistResponse | null =
    useRecoilValue(playlistState);
  return (
    <div className="text-white px-8 flex flex-col space-y-1 pb-28">
      {currentPlaylist!?.tracks?.items?.map((track, i) => (
        <Song key={track.track.id} track={track} order={i} />
      ))}
    </div>
  );
};

export default Songs;
