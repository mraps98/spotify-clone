import { BuiltInProviderType } from 'next-auth/providers';
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from 'next-auth/react';
import Image from 'next/image';
import { FC } from 'react';

interface ILoginProps {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
}

const Login: FC<ILoginProps> = ({ providers }) => {
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <div className="mb-5">
        <Image
          height={208}
          width={208}
          src="https://links.papareact.com/9xl"
          alt="spotify"
        />
      </div>
      {Object.values(providers!).map((provider) => (
        <div key={provider.id}>
          <button
            className="bg-[#18D860] text-white p-5 rounded-full"
            onClick={() => signIn(provider.id, { callbackUrl: '/' })}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Login;

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: { providers },
  };
}
