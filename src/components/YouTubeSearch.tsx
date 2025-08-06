import React, { useState, useEffect, useRef } from 'react';
import './YouTubeSearch.css';

const API_KEY = 'AIzaSyCCFq-ZRgtWV38v4hd8E9nuuMbXk0m56vw';

const YouTubeSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const playerRef = useRef<HTMLIFrameElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${API_KEY}&maxResults=10&type=video`
      );
      const data = await response.json();
      setResults(data.items || []);
      setPlayingVideoId(null);
      setCurrentIndex(null);
      setShowSuggestions(false);
    } catch (error) {
      console.error('YouTube search error:', error);
    }
  };

  const handleVideoClick = (videoId: string, index: number) => {
    setPlayingVideoId(videoId);
    setCurrentIndex(index);
    setShowSuggestions(false);
  };

  const closeVideo = () => {
    setPlayingVideoId(null);
    setCurrentIndex(null);
    setShowSuggestions(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    if (!playingVideoId || currentIndex === null) return;

    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data === 'string' && event.data.includes('"playerState":0')) {
        window.removeEventListener('message', handleMessage);

        timeoutRef.current = setTimeout(() => {
          const nextIndex = currentIndex + 1;

          if (nextIndex < results.length) {
            setPlayingVideoId(results[nextIndex].id.videoId);
            setCurrentIndex(nextIndex);
            setShowSuggestions(false);
          } else {
            setShowSuggestions(true); // No next video, show suggestions
          }
        }, 1000);
      }
    };

    window.addEventListener('message', handleMessage);

    const interval = setInterval(() => {
      playerRef.current?.contentWindow?.postMessage('{"event":"listening","id":1}', '*');
    }, 2000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('message', handleMessage);
    };
  }, [playingVideoId, currentIndex, results]);

  return (
    <div className="youtube-search-container">
      <div className="search-bar-wrapper">
        <div className="search-bar">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search YouTube..."
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>

      {playingVideoId ? (
        <div className="video-player-wrapper">
          <button className="close-search-btn" onClick={closeVideo}>×</button>
          <div className="video-player">
            <iframe
              ref={playerRef}
              src={`https://www.youtube.com/embed/${playingVideoId}?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0&enablejsapi=1`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="YouTube Player"
            />
          </div>

          {showSuggestions && (
            <div className="yt-results">
              {results.map((item, index) =>
                index !== currentIndex && (
                  <div
                    key={item.id.videoId}
                    className="yt-result-item"
                    onClick={() => handleVideoClick(item.id.videoId, index)}
                  >
                    <img src={item.snippet.thumbnails.medium.url} alt="thumbnail" />
                    <div className="yt-result-text">
                      <div className="yt-title">{item.snippet.title}</div>
                      <div className="yt-channel">{item.snippet.channelTitle}</div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="yt-results">
          {results.map((item, index) => (
            <div
              key={item.id.videoId}
              className="yt-result-item"
              onClick={() => handleVideoClick(item.id.videoId, index)}
            >
              <img src={item.snippet.thumbnails.medium.url} alt="thumbnail" />
              <div className="yt-result-text">
                <div className="yt-title">{item.snippet.title}</div>
                <div className="yt-channel">{item.snippet.channelTitle}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YouTubeSearch;
