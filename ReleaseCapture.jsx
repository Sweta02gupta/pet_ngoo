import { useEffect, useRef, useState } from "react";
import { MdCamera } from "react-icons/md";
import SnackBarAlert from "../Dialog/SnackBarAlert";

const ReleaseCapture = ({ setGeoLoc, setToggler, setImgSrc }) => {
  const [snackbarOpen, setSnackbarOpen] = useState({
    open: false,
    message: "",
    type: "success",
  });

  // Geolocation state variables
  const [position, setPosition] = useState(null);
  const [geoError, setGeoError] = useState(null);

  //Recorder state variables
  const videoRef = useRef();
  const streamRef = useRef();

  const handleCapture = () => {
    const canvas = document.createElement("canvas");

    // Calculate the crop dimensions based on the desired aspect ratio
    const video = videoRef.current;
    const aspectRatio = 16 / 9; // Example aspect ratio
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const cropHeight = videoHeight;
    const cropWidth = cropHeight * aspectRatio;
    const xOffset = (videoWidth - cropWidth) / 2;

    // Set the dimensions of the canvas
    canvas.width = cropWidth;
    canvas.height = cropHeight;

    // Capture the cropped image from the video stream
    const context = canvas.getContext("2d");
    context.drawImage(
      video,
      xOffset,
      0,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );
    const croppedImage = canvas.toDataURL("image/png");
    if (position) {
      setGeoLoc({
        lat: position.latitude,
        long: position.longitude,
      });
      setImgSrc(croppedImage);
      console.log("geo tag", position);
      handleStop();
      setToggler((prev) => !prev);
    } else {
      setSnackbarOpen({
        open: true,
        message: geoError || "Error: Location not found",
        type: "error",
      });
    }
  };

  const handlePermission = (stream) => {
    videoRef.current.srcObject = stream;
    streamRef.current = stream;
    videoRef.current.play();
  };

  const handleError = (error) => {
    console.error("Error accessing media devices.", error);
    setSnackbarOpen({
      open: true,
      message: `Camera: ${error.message}`,
      type: "error",
    });
  };

  const constraints = {
    audio: false,
    video: { facingMode: "environment" }, // 'user' for front-facing camera, 'environment' for back-facing camera
  };

  const getMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      handlePermission(stream);
    } catch (error) {
      handleError(error);
    }
  };

  const handleStop = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Geolocation Capture - Starts
  const retrieveLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition(pos.coords),
      (err) => setGeoError(err.message),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: Infinity,
      }
    );
  };

  useEffect(() => {
    retrieveLocation();
    getMedia();
    return handleStop;
  }, []);

  return (
    <>
      <div
        className={`mt-[65px] fixed w-screen h-screen top-0 bg-black bg-opacity-60 backdrop-blur-2xl z-[100] flex items-start justify-center`}
      >
        <div
          className="absolute top-10 right-5 bg-gray-600 text-white font-bold rounded-full text-xs pt-1 pb-2 px-[10px] flex justify-center items-center bg-opacity-5 cursor-pointer z-[150]"
          onClick={() => {
            handleStop();
            setToggler((prev) => !prev);
          }}
        >
          X
        </div>
        <video
          ref={videoRef}
          className="w-full max-w-full h-full max-h-full object-cover md:object-contain"
        />
        <div
          className="absolute bottom-32 md:bottom-16 w-20 h-20 border-[5px] border-red-700 rounded-full p-2 bg-transparent transition ease-in-out duration-100 hover:scale-90 active:scale-90 cursor-pointer"
          onClick={() => {
            retrieveLocation();
            handleCapture();
          }}
        >
          <div className="bg-red-700 brightness-200 rounded-full w-full h-full flex justify-center items-center">
            <MdCamera color="#eee" size={40} />
          </div>
        </div>
      </div>
      <SnackBarAlert
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
      />
    </>
  );
};

export default ReleaseCapture;
