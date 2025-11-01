import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import './VideoCard.css'
// Load YT IFrame API once
const loadYT = (() => {
  let promise;
  return () => {
    if (window.YT?.Player) return Promise.resolve(window.YT);
    if (!promise) {
      promise = new Promise((resolve) => {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
        window.onYouTubeIframeAPIReady = () => resolve(window.YT);
      });
    }
    return promise;
  };
})();

// Global registry to pause other inline players
const players = new Set();
function pauseAllExcept(me) {
  players.forEach((p) => { if (p !== me) try { p.pauseVideo(); } catch (_) {} });
}

export default function VideoCard({ title, youtubeId, start = 0 }) {
  const [open, setOpen] = useState(false);
  const mountRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    let gone = false;
    loadYT().then((YT) => {
      if (gone || !mountRef.current) return;
      const p = new YT.Player(mountRef.current, {
        videoId: youtubeId,
        playerVars: {
          rel: 0,
          controls: 1,
          modestbranding: 1,
          playsinline: 1,
          start,
          iv_load_policy: 3,  // hide annotations/cards
          cc_load_policy: 0,  // captions off by default
          hl: 'en'
        },
        events: {
          onReady: (e) => {
            try { e.target.setOption('captions', 'track', {}); } catch {}
            try { e.target.unloadModule('captions'); } catch {}
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) pauseAllExcept(playerRef.current);
          }
        }
      });
      playerRef.current = p;
      players.add(p);
    });
    return () => {
      gone = true;
      const p = playerRef.current;
      players.delete(p);
      try { p?.stopVideo(); p?.destroy(); } catch (_) {}
    };
  }, [youtubeId, start]);

  const modalSrc =
    `https://www.youtube.com/embed/${youtubeId}` +
    `?rel=0&controls=1&modestbranding=1&playsinline=1&autoplay=1&start=${start}` +
    `&iv_load_policy=3&cc_load_policy=0&hl=en`;

  const openModal = () => {
    try { playerRef.current?.pauseVideo(); } catch (_) {}
    setOpen(true);
  };

  return (
    <>
      <div className="card video-card shadow-sm w-100">
        <div className="card-header py-2 text-center">
          <strong>{title}</strong>
        </div>
        <div className="card-body p-2">
          <div className="video-wrapper position-relative">
            <div className="ratio ratio-16x9">
              {/* YT API replaces this div with an iframe */}
              <div ref={mountRef} />
            </div>
            <button
              type="button"
              className="btn btn-light btn-sm expand-btn"
              onClick={openModal}
              title="Open large player"
              aria-label="Open large player"
            >
              <i className="bi bi-arrows-fullscreen" />
            </button>
          </div>
        </div>
      </div>

      <Modal show={open} onHide={() => setOpen(false)} size="lg" centered>
        <Modal.Header closeButton><Modal.Title>{title}</Modal.Title></Modal.Header>
        <Modal.Body>
          <div className="ratio ratio-16x9">
            {open && (
              <iframe
                src={modalSrc}
                title={`${title} (Large)`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}