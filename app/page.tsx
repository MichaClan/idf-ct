'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-3">
          <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase">Jujutsu Kaisen</p>
          <h1 className="text-5xl font-black tracking-tight">
            CT<span className="text-neutral-600">.</span>FORGE
          </h1>
          <p className="text-neutral-400 text-lg">
            Build your Cursed Technique.
          </p>
        </div>

        <div className="h-px bg-neutral-800 w-24 mx-auto" />

        <div className="space-y-3">
          <Link
            href="/build"
            className="block w-full border border-white text-white py-4 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-200"
          >
            Forge a Technique
          </Link>
          <Link
            href="/build?mode=random"
            className="block w-full border border-neutral-700 text-neutral-400 py-4 text-sm tracking-widest uppercase hover:border-neutral-400 hover:text-white transition-colors duration-200"
          >
            Randomize
          </Link>
        </div>

        <p className="text-neutral-600 text-xs">
          Quiz · Manual · Random — your choice
        </p>
      </div>
    </main>
  )
}