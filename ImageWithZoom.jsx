import { useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import LazyLoad from "react-lazyload";

const ImageWithZoom = ({ src, alt }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative">
      <LazyLoad offset={100}>
        <img
          src={src}
          alt={alt}
          className={`w-full max-h-[40vh] ${
            isExpanded
              ? "fixed inset-0 m-auto object-contain"
              : "cursor-pointer hover:opacity-75 transition-opacity duration-300 ease-in-out"
          }`}
          onClick={toggleExpand}
        />
      </LazyLoad>
      {isExpanded && (
        <div className="fixed top-0 left-0 z-[90] w-screen h-screen flex justify-center items-center bg-black bg-opacity-75">
          <div
            className="absolute bottom-32 md:bottom-14 text-white text-lg cursor-pointer z-[200] flex justify-center items-center gap-2 rounded-lg py-2 px-3 bg-red-500 brightness-110 font-semibold bg-opacity-90"
            onClick={toggleExpand}
          >
            <BsArrowLeft className="text-white text-lg font-semibold" /> BACK
          </div>
          <img
            src={src}
            alt={alt}
            className="min-w-full min-h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default ImageWithZoom;
