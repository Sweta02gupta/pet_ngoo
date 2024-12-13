import { Dog, Cat } from "../../assets/index";
import { Link } from "react-router-dom";

const ViewQR = () => {
  return (
    <div className="mt-[65px] flex flex-col justify-center items-center px-10 h-[calc(100vh-65px)] w-screen gap-y-14 md:gap-20">
      <div className="w-full flex items-center justify-center gap-16 lg:justify-between lg:w-[50rem]">
        <div className="flex flex-col items-center justify-center transition duration-200 ease-in-out transform active:scale-125 hover:scale-125 cursor-pointer h-full">
          <Link
            to="/user/ViewQR/dog"
            className="flex flex-col items-center justify-center h-full w-full gap-8"
          >
            <img
              src={Dog}
              alt="dog"
              className="w-[100px] md:w-[250px] object-cover"
            />
            <span className="font-quicksand font-extrabold text-xl md:text-2xl text-center">
              DOG
            </span>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center transition duration-200 ease-in-out transform active:scale-125 hover:scale-125 cursor-pointer">
          <Link
            to="/user/ViewQR/cat"
            className="flex flex-col items-center justify-center w-full"
          >
            <img
              src={Cat}
              alt="cat"
              className="w-[100px] md:w-[250px] object-cover"
            />
            <span className="font-quicksand font-extrabold text-xl md:text-2xl text-center">
              CAT
            </span>
          </Link>
        </div>
      </div>
      <p className="font-quicksand font-semibold text-3xl md:text-5xl w-full text-center leading-relaxed">
        Who are we <br />
        VIEWING
        <br /> today?
      </p>
    </div>
  );
};

export default ViewQR;
