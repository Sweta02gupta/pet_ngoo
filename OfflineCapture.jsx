import { useEffect, useRef, useState } from "react";
import { MdCamera } from "react-icons/md";
import SnackBarAlert from "../Dialog/SnackBarAlert";
import { generateCurrentDateTime } from "../../utils/CustomUtilityFunctions";

const OfflineCapture = ({ setToggleCapture, captureType }) => {
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
    console.log("geo tag", position);
    console.log(croppedImage);
    if (position) {
      console.log(`${captureType}_${position.latitude}_${position.longitude}`);
      const currDateTime = generateCurrentDateTime();
      // Create a link element with the image data as its href attribute
      const link = document.createElement("a");
      link.href = croppedImage;
      // Set the download attribute to the desired name
      link.download = `${captureType}_${position.latitude}_${position.longitude}_${currDateTime}.png`;

      // Programmatically click on the link to download the image
      link.click();
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
    console.log("retrieve location");
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
        className={`mt-[65px] fixed w-screen h-[calc(100vh-65px)] bg-black z-[100] flex items-start justify-center`}
      >
        <div
          className="absolute top-5 right-5 bg-gray-600 text-white font-bold rounded-full text-xs pt-1 pb-2 px-[10px] flex justify-center items-center bg-opacity-5 backdrop-blur-xl cursor-pointer z-[110]"
          onClick={() => {
            setToggleCapture((prev) => !prev);
            handleStop();
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

export default OfflineCapture;
