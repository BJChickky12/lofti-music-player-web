'use client';

import MusicPlayer from '@/components/musicplayer';
import { useState } from 'react';
import './globals.css';

type Track = {
  title: string;
  audioSrc: string;
  cover: string;
};

export default function Home() {
  const [currentBackground, setCurrentBackground] = useState('');
  const [userPlaylist, setUserPlaylist] = useState<Track[]>([]);
  const [showCredit, setShowCredit] = useState(false);

  const handleUserUpload = (files: FileList) => {
    if (!files || files.length === 0) return;

    const defaultCovers = [
      '/covers/background-lofi-1.gif',
      '/covers/background-lofi-2.gif',
      '/covers/background-lofi-3.gif',
      '/covers/background-lofi-4.gif',
      '/covers/background-lofi-5.gif'
    ];

    const uploadedTracks = Array.from(files).map((file) => ({
      title: file.name.replace(/\.[^/.]+$/, ''),
      audioSrc: URL.createObjectURL(file),
      cover: defaultCovers[Math.floor(Math.random() * defaultCovers.length)],
    }));

    setUserPlaylist((prev) => [...prev, ...uploadedTracks]);
  };

  return (
    <div>
      {/* Uploader */}
      <div className="upload-container">
        <input
          type="file"
          id="fileUpload"
          accept="audio/mp3"
          multiple
          className="hidden-input"
          onChange={(e) => {
            if (e.target.files) {
              handleUserUpload(e.target.files);
            }
          }}
        />
        <label htmlFor="fileUpload" className="upload-label">
          Upload Songs
        </label>
      </div>

      <div className="heart-container">
          <a
            href="https://github.com/BJChickky12"
            target="_blank"
            rel="noopener noreferrer"
            className="github-icon heart"
            aria-label="GitHub Profile"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#3B82F6"
              viewBox="0 0 24 24"
              width="25"
              height="25"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.165c-3.338.726-4.033-1.415-4.033-1.415-.546-1.385-1.333-1.754-1.333-1.754-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.235 1.84 1.235 1.07 1.835 2.81 1.305 3.495.997.11-.776.42-1.305.76-1.605-2.665-.3-5.466-1.335-5.466-5.93 0-1.31.47-2.38 1.235-3.22-.135-.3-.54-1.515.105-3.155 0 0 1.005-.322 3.3 1.23a11.47 11.47 0 0 1 3-.405c1.02.005 2.045.14 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.64.24 2.855.12 3.155.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.435.375.81 1.11.81 2.24v3.32c0 .32.21.695.825.575C20.565 21.795 24 17.29 24 12 24 5.37 18.63 0 12 0Z" />
            </svg>
          </a>

        <span className="heart" onClick={() => setShowCredit(!showCredit)} role='button' aria-label='Toggle creator name'>💙</span>
        {showCredit && (
        <span className="creator-name">Created by Joren</span>
      )}
      </div>


      <main
        className="main-wrapper"
        style={{ backgroundImage: `url(${currentBackground})` }}
      >
        {/* Blurring overlay */}
        <div className="overlay" />

        {/* Foreground content */}
        <div className="content-wrapper">
          <MusicPlayer
            onBackgroundChange={setCurrentBackground}
            userPlaylist={userPlaylist}
          />
        </div>
      </main>
    </div>
  );
}
