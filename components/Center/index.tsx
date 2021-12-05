import { ChevronDownIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { shuffle } from 'lodash';

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
  const { data: session } = useSession();
  const [gradientFromColor, setGradientFromColor] = useState('green');

  useEffect(() => {
    setGradientFromColor(`from-${shuffle(colorsForGradient).pop()!}-500`);
  }, []);

  useEffect(() => {
    console.log(gradientFromColor);
  }, [gradientFromColor]);

  return (
    <div className="flex-grow">
      <header className="absolute top-5 right-8">
        <div className="flex items-center bg-black space-x-3 text-white opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
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
        {/* <Image src="" alt=""/> */}
      </section>
    </div>
  );
};

export default Center;
