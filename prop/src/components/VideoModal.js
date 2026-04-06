import React, { useEffect, useState } from 'react';
import $ from 'jquery';

const VideoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState('');

  useEffect(() => {
    // Listen for custom events to open modal
    const handleOpenModal = (event) => {
      const videoUrl = event.detail;
      if (videoUrl) {
        let url = videoUrl;
        if (!url.includes('rel=')) {
          url += (url.includes('?') ? '&' : '?') + 'rel=0';
        }
        if (!url.includes('autoplay=1')) {
          url += (url.includes('?') ? '&' : '?') + 'autoplay=1';
        }
        setVideoSrc(url);
        setIsOpen(true);
      }
    };

    window.addEventListener('openVideoModal', handleOpenModal);

    // Close modal on background click
    $(document).on('click', function(event) {
      if (event.target.id === 'videoModal') {
        setIsOpen(false);
        setVideoSrc('');
      }
    });

    // Close modal on close button click
    $(document).on('click', '.close', function() {
      setIsOpen(false);
      setVideoSrc('');
    });

    return () => {
      window.removeEventListener('openVideoModal', handleOpenModal);
      $(document).off('click');
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div id="videoModal" className="modal" style={{ display: 'block' }}>
      <div className="modal-content">
        <span className="close">&times;</span>
        <iframe
          id="videoFrame"
          width="560"
          height="315"
          src={videoSrc}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default VideoModal;