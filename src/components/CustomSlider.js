import React, { useRef, useEffect, useState } from 'react';
import './CustomSlider.css';

const CustomSlider = ({ videoDuration, clipLength, startTime, onChange }) => {
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [initialStartTime, setInitialStartTime] = useState(startTime);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStartX(e.clientX);
    setInitialStartTime(startTime);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const deltaX = e.clientX - dragStartX;
    const deltaTime = (deltaX / rect.width) * videoDuration;

    let newStartTime = initialStartTime + deltaTime;
    let newEndTime = newStartTime + clipLength;

    // Boundary checks
    if (newStartTime < 0) {
      newStartTime = 0;
      newEndTime = clipLength;
    }
    if (newEndTime > videoDuration) {
      newEndTime = videoDuration;
      newStartTime = videoDuration - clipLength;
    }

    onChange(newStartTime, newEndTime);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  // Calculate the position and width of the clip rectangle
  const clipStartPercentage = (startTime / videoDuration) * 100;
  const clipEndPercentage = ((startTime + clipLength) / videoDuration) * 100;

  return (
    <div className="custom-slider" ref={sliderRef}>
      <div
        className="slider-clip"
        style={{
          left: `${clipStartPercentage}%`,
          width: `${clipLength / videoDuration * 100}%`,
        }}
        onMouseDown={handleMouseDown}
      ></div>
    </div>
  );
};

export default CustomSlider;
