import Image from 'next/image';
import ShowcasePresence from '@/components/showcase-presence';

export default function Home() {
  return (
    <section className="w-full flex-col min-h-[100dvh] flex items-center pb-8">
      <div className="flex flex-col items-center">
        <h1 className="text-5xl font-bold text-center max-w-xl text-pretty mt-48">
          A way to <span className='text-[--orange-9]'>expose</span> your

          <Image
            width={200}
            height={200}
            src='/discord-text.svg'
            className='inline'
            alt='Discord logo'
          /> 

          {' '}
          presence
        </h1>
        
        <p className="mt-8 text-center text-lg max-w-3xl font-medium text-[--gray-9]">
          Lantern is a powerful service designed to effortlessly broadcast your active Discord status to both a RESTful API endpoint and a WebSocket connection.
        </p>
      </div>

      <div className='flex items-start flex-col gap-y-4 w-full max-w-3xl mt-12'>
        <ShowcasePresence />
      </div>
    </section>
  );
}