import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './VideoCreation.css'; // Ensure this imports your CSS

const VideoCreation = () => {
  const { tiktokName } = useParams();
  const navigate = useNavigate();

  const tiktok = useSelector((state) =>
    state.tiktoks.find((t) => t.name === tiktokName)
  );

  const [instructions] = useState([
    'Click on empty clip',
    "Upload your video or photo. If it's a video, use the slider to set the start and end times. The clip will automatically adjust to the trend's length.",
    "Download the final video once all clips are filled. It's now ready for social media!",
  ]);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileType, setUploadedFileType] = useState(null);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [contents, setContents] = useState([]);
  const [videoDuration, setVideoDuration] = useState(0);
  const [sliderValues, setSliderValues] = useState([0, 10]);
  const [thumbnails, setThumbnails] = useState([]);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);
  const [allContentsFilled, setAllContentsFilled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const videoPlayerRef = useRef(null);

  // Move calculateDimensions here to avoid initialization issues
  const calculateDimensions = () => {
    const timelineContainer = document.querySelector('.timeline-container-vc');
    if (timelineContainer) {
      const horizontalLine = timelineContainer.querySelector('.horizontal-line');
      if (horizontalLine) {
        horizontalLine.style.width = `${timelineContainer.offsetWidth}px`;
      }
    }
  };

  useEffect(() => {
    if (tiktok && tiktok.timestamps) {
      const timestampsArray = JSON.parse(tiktok.timestamps);
      setContents(Array(timestampsArray.length - 1).fill(null));
    }

    // Load contents from localStorage
    const storedContents = localStorage.getItem('contents');
    if (storedContents) {
      setContents(JSON.parse(storedContents));
    }

    window.addEventListener('resize', calculateDimensions);
    window.addEventListener('beforeunload', resetContentsOnUnload);

    return () => {
      window.removeEventListener('resize', calculateDimensions);
      window.removeEventListener('beforeunload', resetContentsOnUnload);
    };
  }, [tiktok]);

  useEffect(() => {
    // Save contents to localStorage whenever contents change
    localStorage.setItem('contents', JSON.stringify(contents));
    setAllContentsFilled(contents.every((content) => content !== null));
  }, [contents]);

  if (!tiktok) {
    return <div>Loading...</div>;
  }

  const timestamps = JSON.parse(tiktok.timestamps || '[]');

  const timeToSeconds = (time) => {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataURL = reader.result;
      setUploadedFile(dataURL);

      if (file.type.startsWith('image')) {
        setUploadedFileType('image');
        // Generate thumbnail
        setThumbnails((prevThumbnails) => {
          const updatedThumbnails = [...prevThumbnails];
          updatedThumbnails[selectedContainer] = dataURL;
          return updatedThumbnails;
        });
      } else if (file.type.startsWith('video')) {
        setUploadedFileType('video');
        if (videoPlayerRef.current) {
          videoPlayerRef.current.src = dataURL;
        }
      } else {
        console.error('Unsupported file type');
      }
    };
  };

  const selectContainer = (index) => {
    setSelectedContainer(index);
    setStartTime(timeToSeconds(timestamps[index]));
    setEndTime(timeToSeconds(timestamps[index + 1]));
  };

  const generateThumbnail = (dataURL) => {
    return new Promise((resolve, reject) => {
      if (uploadedFileType === 'video') {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        video.src = dataURL;

        video.addEventListener('loadeddata', () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          video.currentTime = 0;
        });

        video.addEventListener('seeked', () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageDataURL = canvas.toDataURL('image/png');
          resolve(imageDataURL);
        });

        video.addEventListener('error', (error) => {
          reject(error);
        });
      } else if (uploadedFileType === 'image') {
        resolve(dataURL);
      } else {
        console.error('Unsupported file type');
        resolve('');
      }
    });
  };

  const trimVideo = async (dataURL, startTime, endTime) => {
    // Implement your video trimming logic here
    // For the sake of example, we'll return the original dataURL
    return dataURL;
  };

  const submitFile = async () => {
    if (selectedContainer !== null && uploadedFile) {
      setIsSubmitting(true); // Start loading
      let processedFile = uploadedFile;

      if (uploadedFileType === 'video') {
        try {
          processedFile = await trimVideo(
            uploadedFile,
            sliderValues[0],
            sliderValues[1]
          );
          setUploadedFile(processedFile);
        } catch (error) {
          console.error('Error during trimVideo process:', error);
        }
      }

      const updatedContents = [...contents];
      updatedContents[selectedContainer] = processedFile;
      setContents(updatedContents);

      const newThumbnail = await generateThumbnail(processedFile);
      setThumbnails((prevThumbnails) => {
        const updatedThumbnails = [...prevThumbnails];
        updatedThumbnails[selectedContainer] = newThumbnail;
        return updatedThumbnails;
      });

      // Reset upload box
      setUploadedFile(null);
      setSelectedContainer(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
      setUploadedFileType(null);
      setIsSubmitting(false); // Stop loading
    }
  };

  const playPreview = () => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.currentTime = sliderValues[0];
      videoPlayerRef.current.play();

      setTimeout(() => {
        videoPlayerRef.current.pause();
      }, (sliderValues[1] - sliderValues[0]) * 1000);
    }
  };

  const handleSliderChange = (values) => {
    setSliderValues(values);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.currentTime = values[0];
    }
  };

  const resetContentsOnUnload = () => {
    window.addEventListener('beforeunload', () => {
      localStorage.removeItem('contents');
    });
  };

  const downloadVideo = async () => {
    try {
      console.log('Starting downloadVideo process...');
      setIsSubmitting(true); // Start loading
      const formData = new FormData();
      contents.forEach((content, index) => {
        const fileType = dataURLType(content);
        if (fileType.startsWith('video')) {
          formData.append('contents', dataURLToFile(content, `video${index}.webm`));
        } else if (fileType.startsWith('image')) {
          formData.append('contents', dataURLToFile(content, `image${index}.png`));
        } else {
          console.error('Unsupported file type');
        }
        formData.append('timestamps', timestamps[index]);
      });

      const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
        responseType: 'blob',
      });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'output.mp4';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        console.log('Video downloaded successfully.');
      } else {
        console.error('Failed to download video');
      }
      setIsSubmitting(false); // Stop loading
    } catch (error) {
      console.error('Error during downloadVideo process:', error);
      setIsSubmitting(false); // Stop loading
    }
  };

  const dataURLToFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const dataURLType = (dataurl) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    return mime;
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    // Use the same logic as handleFileUpload
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataURL = reader.result;
      setUploadedFile(dataURL);

      if (file.type.startsWith('image')) {
        setUploadedFileType('image');
        // Generate thumbnail
        setThumbnails((prevThumbnails) => {
          const updatedThumbnails = [...prevThumbnails];
          updatedThumbnails[selectedContainer] = dataURL;
          return updatedThumbnails;
        });
      } else if (file.type.startsWith('video')) {
        setUploadedFileType('video');
        if (videoPlayerRef.current) {
          videoPlayerRef.current.src = dataURL;
        }
      } else {
        console.error('Unsupported file type');
      }
    };
  };

  const preventClick = (e) => {
    if (isSubmitting) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div
      className={`grid-container container-vc ${isSubmitting ? 'loading' : ''}`}
      onClick={preventClick}
      onKeyDown={preventClick}
    >
      <div className="timeline">
        <div className="image-container-vc">
          {timestamps.slice(0, -1).map((timestamp, index) => (
            <div key={index} className="image-container-wrapper">
              <div
                className={`image-container ${selectedContainer === index ? 'selected' : ''}`}
                onClick={() => !isSubmitting && selectContainer(index)}
              >
                {contents[index] ? (
                  <img src={thumbnails[index]} alt="preview" className="image-preview" />
                ) : (
                  <div>{tiktok.clips[index].type || 'Insert file'}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="timeline-container-vc">
          <div className="horizontal-line"></div>
          {timestamps.map((timestamp, index) => (
            <div key={index} className="timeline-item-wrapper-vc">
              <div className={`timeline-item`}>
                <div className="timeline-dash"></div>
                <div className="bubble timestamp-bubble timestamp-bubble-vc">{timestamp}</div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="upload box-container"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="upload-input" />
          <div className="upload-box" onClick={() => !isSubmitting && fileInputRef.current.click()}>
            {!uploadedFile ? (
              <p className="dark-grey-text">Upload photos or videos</p>
            ) : uploadedFileType === 'image' ? (
              <img src={uploadedFile} alt="Uploaded File" className="uploaded-file-preview" />
            ) : (
              <video
                ref={videoPlayerRef}
                className="uploaded-video-preview"
                onLoadedMetadata={() => {
                  setVideoDuration(videoPlayerRef.current.duration);
                  setSliderValues([0, videoPlayerRef.current.duration]);
                }}
              >
                <source src={uploadedFile} type="video/mp4" />
              </video>
            )}
          </div>

          {uploadedFileType === 'video' && (
            <>
              <div className="slider-container">
                <div className="play-icon" onClick={playPreview}>
                  ▶
                </div>
                <Slider
                  range
                  min={0}
                  max={videoDuration}
                  value={sliderValues}
                  onChange={handleSliderChange}
                  allowCross={false}
                />
              </div>
              {selectedContainer !== null && uploadedFile && (
                <button onClick={submitFile} className="submit-button" disabled={isSubmitting}>
                  Submit
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="right-box">
        <div>
          <h1 className="bold dark-navy-text">{tiktok.name || 'Untitled'}</h1>
          <h3 className="grey-text">{tiktok.description || 'No description available'}</h3>
        </div>

        <div className="small-box instructions-text">
          <h3 className="bold dark-grey-text">Instructions</h3>
          {instructions.map((instruction, index) => (
            <p className="dark-grey-text" key={index}>{`${index + 1}. ${instruction}`}</p>
          ))}
        </div>

        {allContentsFilled && (
          <button onClick={downloadVideo} className="download-button" disabled={isSubmitting}>
            Download Video (Coming soon!)
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCreation;
