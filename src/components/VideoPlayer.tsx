import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';

interface VideoPlayerProps {
  video: {
    id: string;
    title: string;
    subject: string;
    duration: string;
    difficulty: string;
    icon: string;
    videoUrl: string;
    description: string;
  };
  onComplete: (videoId: string, subject: string, watchTime: number) => void;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onComplete, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      if (!hasCompleted) {
        setHasCompleted(true);
        onComplete(video.id, video.subject, watchTime);
      }
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnded);

    // Track watch time
    const interval = setInterval(() => {
      if (isPlaying) {
        setWatchTime(prev => prev + 1);
      }
    }, 1000);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnded);
      clearInterval(interval);
    };
  }, [isPlaying, hasCompleted, onComplete, video.id, video.subject, watchTime]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFullscreen) {
      video.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const restart = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setCurrentTime(0);
    setWatchTime(0);
    setHasCompleted(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">{video.title}</h2>
              <p className="text-white/80 text-sm">{video.subject} • {video.difficulty}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Video Container */}
        <div className="relative bg-black">
          <video
            ref={videoRef}
            className="w-full h-64 md:h-96 object-cover"
            poster={`data:image/svg+xml,%3Csvg width='800' height='600' viewBox='0 0 800 600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='800' height='600' fill='%23667eea'/%3E%3Ctext x='400' y='300' text-anchor='middle' font-size='120' fill='white'%3E${video.icon}%3C/text%3E%3Ctext x='400' y='400' text-anchor='middle' font-size='24' fill='white'%3E${video.title}%3C/text%3E%3C/svg%3E`}
          >
            <source src={video.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
              </button>

              <button
                onClick={restart}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-white" />
              </button>

              <div className="flex-1 flex items-center gap-2">
                <span className="text-white text-sm">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-white text-sm">{formatTime(duration)}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <button
                onClick={toggleFullscreen}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <Maximize className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">About this video</h3>
          <p className="text-gray-600 mb-4">{video.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Watch time: {Math.floor(watchTime / 60)}:{(watchTime % 60).toString().padStart(2, '0')}</span>
              <span>Progress: {duration > 0 ? Math.round((currentTime / duration) * 100) : 0}%</span>
            </div>
            
            {hasCompleted && (
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <span>✅</span>
                <span>Completed! +10 XP</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;