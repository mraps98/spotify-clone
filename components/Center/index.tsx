import { ChevronDownIcon } from '@heroicons/react/outline';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { shuffle } from 'lodash';
import { playlistIdState, playlistState } from '../../atoms/playlistAtom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useSpotify } from '../../hooks/useSpotify';
import Songs from './Songs';

const colorsForGradient = [
  'indigo',
  'blue',
  'green',
  'red',
  'yellow',
  'pink',
  'purple',
];

const Center = () => {
  const spotifyService = useSpotify();
  const { data: session } = useSession();
  const [gradientFromColor, setGradientFromColor] = useState('green');
  const currentPlaylistId = useRecoilValue(playlistIdState);
  const [currentPlaylist, setCurrentPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    if (spotifyService.getAccessToken()) {
      spotifyService.getPlaylist(currentPlaylistId).then((data) => {
        setCurrentPlaylist(data.body);
      });
    }
  }, [spotifyService, currentPlaylistId]);

  useEffect(() => {
    setGradientFromColor(`from-${shuffle(colorsForGradient).pop()!}-500`);
  }, [currentPlaylistId]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8 cursor-pointer">
        <div
          onClick={() => signOut()}
          className="flex items-center bg-black space-x-3 text-white opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2"
        >
          <Image
            src={session?.user?.image || '/images/avatar.png'}
            height={40}
            width={40}
            className="rounded-full"
            alt="profile"
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${gradientFromColor} h-80 text-white p-8`}
      >
        <img
          src={currentPlaylist?.images?.[0]?.url}
          alt={currentPlaylist?.name}
          className="shadow-2xl w-44 h-44"
        />
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl">
            {currentPlaylist?.name}
          </h1>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  );
};

export default Center;
