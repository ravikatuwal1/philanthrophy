import React, { useMemo } from 'react';
import VideoCard from './VideoCard';
import data from '../../data/prayer-videos.json';
import './PrayerVideo.css';

export default function PrayerVideo() {
  const title = data?.title || 'Congregational Prayer Format';
  const videos = useMemo(() => {
    const arr = Array.isArray(data?.videos) ? data.videos.slice() : [];
    arr.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title));
    return arr;
  }, []);

  return (
    <div className="prayer-container mt-5">
      <h2 className="text-center mb-4">
        {title}
      </h2>

      {videos.length === 0 ? (
        <p className="text-center text-muted">No videos available.</p>
      ) : (
        <div className="row g-4 justify-content-center">
          {videos.map((v) => (
            <div key={v.id} className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
              <VideoCard title={v.title} youtubeId={v.youtubeId} start={v.start || 0} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}