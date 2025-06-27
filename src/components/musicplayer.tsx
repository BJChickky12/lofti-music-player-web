'use client';

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import '../components/musicplayer.css'; // Assume we'll replace this with plain CSS
import playlist from '../app/data/song_library';

type Track = {
  title: string;
  cover: string;
  audioSrc: string;
};

type Props = {
  onBackgroundChange?: (coverUrl: string) => void;
  userPlaylist: Track[];
};

export default function MusicPlayer({ onBackgroundChange, userPlaylist }: Props) {
  const waveFormRef = useRef(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [useUserLibrary, setUseUserLibrary] = useState(false);

  useEffect(() => {
    const saveTrack = localStorage.getItem('lastTrack');
    if (saveTrack) setCurrentTrack(parseInt(saveTrack));
  }, []);

  useEffect(() => {
    localStorage.setItem('lastTrack', currentTrack.toString());
  }, [currentTrack]);

  const activePlaylist: Track[] = useUserLibrary ? userPlaylist : playlist;
  const current: Track | undefined = activePlaylist[currentTrack];

  useEffect(() => {
    if (!waveFormRef.current) return;

    if (wavesurfer.current) {
      wavesurfer.current.destroy();
    }

    wavesurfer.current = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor: '#666',
      progressColor: '#3B82F6',
      height: 32,
      barWidth: 2,
      interact: true,
      barGap: 2
    });

    wavesurfer.current.load(current.audioSrc);

    wavesurfer.current.on('finish', () => {
      switchTracks(currentTrack + 1);
    });

    wavesurfer.current.on('ready', () => {
      if (isPlaying) {
        wavesurfer.current?.play();
      }
    });

    return () => {
      wavesurfer.current?.destroy();
    };
  }, [currentTrack, useUserLibrary, current.audioSrc]);

  useEffect(() => {
    wavesurfer.current?.setVolume(volume);
  }, [volume]);

  const togglePlayer = () => {
    if (!wavesurfer.current) return;
    wavesurfer.current.playPause();
    setIsPlaying(!isPlaying);
  };

  const switchTracks = (index: number) => {
    const currentList = useUserLibrary ? userPlaylist : playlist;
    if (index < 0) index = currentList.length - 1;
    if (index >= currentList.length) index = 0;
    setCurrentTrack(index);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (onBackgroundChange) {
      onBackgroundChange(current.cover);
    }
  }, [currentTrack, current.cover, onBackgroundChange]);

  return (
    <div className={`music-player-container ${!isPlaying ? 'pulse' : ''}`}>
      <div className="cover-wrapper">
        <img
          src={current.cover}
          alt={current.title}
          className="cover-image"
        />
        <button
          onClick={() => {
            wavesurfer.current?.stop();
            setUseUserLibrary(!useUserLibrary);
            setCurrentTrack(0);
            setIsPlaying(false);
          }}
          disabled={userPlaylist.length === 0}
          className="library-toggle"
        >
          {!useUserLibrary ? 'Default' : 'My Library'}
        </button>
      </div>
      <div className="content-wrapper">
        <h2 className="track-title">{current.title?.length > 15 ? current.title.slice(0, 12) + '...' : current.title}</h2>

        <div ref={waveFormRef} className="waveform"></div>

        <div className="controls">
          <span onClick={() => switchTracks(currentTrack - 1)} className="control-button">⏮</span>
          <button onClick={togglePlayer} className="play-button">
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <span onClick={() => switchTracks(currentTrack + 1)} className="control-button">⏭</span>
        </div>

        <div className="volume-control">
          <label>Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </div>

        <div className="track-selector">
          <select
            onChange={(e) => switchTracks(parseInt(e.target.value))}
            value={currentTrack}
          >
            {activePlaylist.map((track, index) => (
              <option key={index} value={index}>
                {track.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
