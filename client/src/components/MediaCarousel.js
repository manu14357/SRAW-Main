import React, { useState, useEffect, memo, useRef } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import styled from 'styled-components';

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  margin: auto;
  overflow: hidden;
  user-select: none; /* Prevents text/media selection */
`;

const MediaWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 5px;
  }
`;

const MediaContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  touch-action: pan-y; /* Allow vertical scrolling but disable horizontal scrolling */
  
  @media (min-width: 1024px) {
    max-width: 80%;
  }

  & img,
  & video {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  & audio {
    width: 100%;
  }
`;

const CustomIndicator = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
`;

const IndicatorDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => (props.active ? '#007bff' : '#007bff')};
  opacity: ${props => (props.active ? '1' : '0.5')};
  transition: opacity 0.3s ease;
`;

const CustomCarousel = styled(Carousel)`
  .control-prev,
  .control-next {
    opacity: 0;
    pointer-events: none;
  }

  .slide {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MediaCarousel = memo(({ mediaUrls }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const videoRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          // Attempt to play the video
          video.play().catch((error) => {
            // Handle autoplay failures gracefully
            console.error('Autoplay failed:', error);
          });
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.5 });

    videoRefs.current.forEach(video => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach(video => {
        if (video) observer.unobserve(video);
      });
    };
  }, [mediaUrls]);

  const handleChange = (index) => {
    setCurrentIndex(index);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    carouselRef.current.startX = touch.clientX;
    carouselRef.current.startY = touch.clientY;
  };
  
  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const startX = carouselRef.current.startX;
    const startY = carouselRef.current.startY;
    const currentX = touch.clientX;
    const currentY = touch.clientY;
  
    const diffX = startX - currentX;
    const diffY = startY - currentY;
  
    // Determine if the swipe is more horizontal than vertical
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // If horizontal swipe, prevent default behavior to avoid vertical scrolling
      e.preventDefault();
    }
  
    // Stop propagation to avoid affecting other touch event handlers
    e.stopPropagation();
  };
  
  const showDots = mediaUrls.length > 1;

  return (
    <CarouselWrapper>
      <CustomCarousel
        ref={carouselRef}
        showThumbs={false}
        showStatus={false}
        showIndicators={false}
        infiniteLoop
        useKeyboardArrows
        swipeable
        emulateTouch
        onChange={handleChange}
        selectedItem={currentIndex}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {mediaUrls.filter(url => url).map((url, index) => (
          <div key={index} className="slide">
            <MediaWrapper>
              <MediaContent>
                {url.endsWith('.mp4') || url.endsWith('.mov') ? (
                  <video ref={el => videoRefs.current[index] = el} controls autoPlay muted>
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : url.endsWith('.mp3') ? (
                  <audio controls>
                    <source src={url} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <img src={url} alt={`media-${index}`} />
                )}
              </MediaContent>
            </MediaWrapper>
          </div>
        ))}
      </CustomCarousel>

      <CustomIndicator show={showDots}>
        {showDots && mediaUrls.filter(url => url).map((_, index) => (
          <IndicatorDot key={index} active={index === currentIndex} />
        ))}
      </CustomIndicator>
    </CarouselWrapper>
  );
});

export default MediaCarousel;