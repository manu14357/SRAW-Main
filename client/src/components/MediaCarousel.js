import React, { useState, memo } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import styled from 'styled-components';

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%; /* Full width on all devices */
  margin: auto;
  overflow: hidden;
`;

const MediaWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 10px; /* Space around media items */
  box-sizing: border-box;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 5px; /* Less padding on smaller screens */
  }
`;

const MediaContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  
  @media (min-width: 1024px) { /* Desktop view */
    max-width: 80%; /* Scale down media size to 80% of the container */
  }
  
  & img,
  & video {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain; /* Ensure media is scaled correctly */
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
  visibility: ${props => props.show ? 'visible' : 'hidden'};
`;

const IndicatorDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#007bff' : '#007bff'};
  opacity: ${props => props.active ? '1' : '0.5'};
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

  const handleChange = (index) => {
    setCurrentIndex(index);
  };

  const showDots = mediaUrls.length > 1;

  return (
    <CarouselWrapper>
      <CustomCarousel
        showThumbs={false}
        showStatus={false}
        showIndicators={false}
        infiniteLoop
        useKeyboardArrows
        swipeable
        emulateTouch
        onChange={handleChange}
        selectedItem={currentIndex}
      >
        {mediaUrls.filter(url => url).map((url, index) => (
          <div key={index} className="slide">
            <MediaWrapper>
              <MediaContent>
                {url.endsWith('.mp4') || url.endsWith('.mov') ? (
                  <video controls>
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
