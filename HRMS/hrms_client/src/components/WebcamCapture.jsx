"use client";

import { useRef, useEffect, useState } from "react";

const WebcamCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let stream;

    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch((err) => {
              console.error("Play error:", err);
              setError("Unable to play video.");
            });
          };
        }
        setError(null);
      } catch (err) {
        console.error("Webcam error:", err);
        setError("Could not access webcam. Make sure permissions are allowed.");
      }
    };

    startWebcam();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas && video.videoWidth && video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/png");
      onCapture(imageData);
    } else {
      alert("Webcam not ready. Try again shortly.");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Webcam Capture</h3>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="rounded-lg overflow-hidden aspect-video bg-gray-100 shadow relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />

        <canvas ref={canvasRef} className="hidden" />
      </div>

      <button
        onClick={capturePhoto}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition"
      >
        Capture Selfie
      </button>
    </div>
  );
};

export default WebcamCapture;
