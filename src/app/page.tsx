import React from 'react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Bienvenido a Creciendo cuento a cuento
          <code className="font-mono font-bold ml-2">src/app/page.tsx</code>
        </p>
      </div>

      <div className="text-[#28405F] mt-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Bienvenido a Creciendo cuento a cuento</h1>
        <p>Aquí podrás crear y explorar maravillosas historias.</p>
      </div>
    </div>
  );
}
