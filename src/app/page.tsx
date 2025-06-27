'use client';

import MusicPlayer from '@/components/musicplayer';
import { useState } from 'react';

type Track = {
  title: string;
  audioSrc: string;
  cover: string;
};

export default function Home() {
  const[currentBackground, setCurrentBackground] = useState('');
  const [userPlaylist, setUserPlaylist] = useState<Track[]>([]);

  const handleUserUpload = (files: FileList) => {
    if (!files || files.length === 0) return;
    
    const defaultCovers = [
      '/covers/background-lofi-1.gif',
      '/covers/background-lofi-2.gif',
      '/covers/background-lofi-3.gif',
      '/covers/background-lofi-4.gif',
      '/covers/background-lofi-5.gif'
    ]

    const uploadedTracks = Array.from(files).map((file) => ({
      title: file.name.replace(/\.[^/.]+$/, ''),
      audioSrc: URL.createObjectURL(file),
      cover: defaultCovers[Math.floor(Math.random() * defaultCovers.length)],
    }));

    setUserPlaylist((prev) => [...prev, ...uploadedTracks]);
  }

  return (
    <div>
      {/* Uploader */}
      <div className="absolute top-4 left-4 z-10">
        <input
          type="file"
          id="fileUpload"
          accept="audio/mp3"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              handleUserUpload(e.target.files);
            }
          }}
        />
        <label
          htmlFor="fileUpload"
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded cursor-pointer pixel-text text-sm tracking-wider shadow-lg shadow-black/30 border border-gray-700"
        >
          Upload Songs
        </label>
      </div>
    
    <main className="min-h-screen bg-gray-900 flex items-center justify-center bg-no-repeat bg-cover bg-center transition-all duration-500 ease-in-out"

      style={{backgroundImage: `url(${currentBackground})`}}>
        {/* Blurring overlay */}
        <div className="absolute inset-0 backdrop-blur-md bg-black/45 z-0"/>

        {/* Foreground content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">

        {/* Music Player */}
        <MusicPlayer onBackgroundChange={setCurrentBackground} userPlaylist={userPlaylist} />

      </div>
    </main>
  </div>
  );
}
