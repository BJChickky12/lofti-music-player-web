'use client';

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import '../components/musicplayer.css';
import playlist from '@/app/data/song_library';

export default function MusicPlayer({onBackgroundChange, userPlaylist}) {
    const waveFormRef = useRef(null);
    const wavesurfer = useRef(null);

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

    const activePlaylist = useUserLibrary ? userPlaylist : playlist;
    const current = activePlaylist[currentTrack] || { };

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
            barRadius: true,
            duration: true,

        });

        wavesurfer.current.load(current.audioSrc);

        wavesurfer.current.on('finish', () => {
            switchTracks(currentTrack + 1);
        });

        wavesurfer.current.on('ready', () => {
        if (isPlaying) {
            wavesurfer.current.play();
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

    const switchTracks = (index) => {
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
    }, [currentTrack, current.cover, onBackgroundChange])

    return (
    <div className={`max-w-md mx-auto mt-10 bg-gray-800 text-white shadow-2xl shadow-blue-900 border-2 border-blue-900 rounded-xl transition duration-300 hover:shadow-blue-700 hover:shadow-2xl transition duration-500 ${
    !isPlaying ? 'animate-pulse' : ''}`}>
      <div className="relative w-full h-60">
        <img
            src={current.cover}
            alt={current.title}
            className="w-full h-full object-cover rounded-t-xl"
        />

        {/* Toggle button inside image */}
        <button
            onClick={() => {
            wavesurfer.current?.stop();
            setUseUserLibrary(!useUserLibrary);
            setCurrentTrack(0);
            setIsPlaying(false);
            }}
            disabled={userPlaylist.length === 0}
            className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded pixel-text text-xs tracking-wider"
        >
            {!useUserLibrary ? 'Default' : 'My Library'}
        </button>
        </div>
      {/* <img src={current.cover} alt={current.title} className="w-full h-60 object-cover" /> */}
      <div className="p-4">
        <h2 className="font-semibold pixel-text-header tracking-widest">{current.title}</h2>

        {/* 🎛 Waveform visualizer */}
        <div ref={waveFormRef} className="my-4"></div>

        <div className="flex justify-between items-center space-x-2 mt-2">
          <button onClick={() => switchTracks(currentTrack - 1)} className="bg-gray-600 px-3 py-2 rounded hover:bg-gray-500 pixel-text">⏮️</button>
          <button onClick={togglePlayer} className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 pixel-text tracking-widest">
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button onClick={() => switchTracks(currentTrack + 1)} className="bg-gray-600 px-3 py-2 rounded hover:bg-gray-500 pixel-text">⏭️</button>
        </div>

        {/* Volume */}
         <div className="mt-4">
          <label className="text-sm pixel-text tracking-widest">Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-blue-400"
          />
        </div>

        {/* 🎵 Playlist Dropdown */}
        <div className="mt-4">
          <select
            onChange={(e) => switchTracks(parseInt(e.target.value))}
            value={currentTrack}
            className="bg-gray-700 border border-gray-600 text-white rounded p-2 w-full pixel-text tracker-widest"
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