import { useNavigate } from 'react-router-dom';
import { afaYellowLogo } from "../../assets";

const ConsoleLander = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/user/ScanQR');
  };

  return (
    <div className="relative mt-[65px] w-screen flex flex-col items-center pt-16 md:pt-0 md:justify-center h-[calc(100vh-65px)] bg-slate-100 gap-6 px-3">
      <img
        src={afaYellowLogo}
        alt="logo"
        className="w-48 object-cover rounded-full brightness-110"
      />
      <div className="w-full flex flex-col justify-center items-center gap-1">
        <span className="text-2xl tracking-wider font-bold text-center">
          Alpha Angels Animal Trust
        </span>
        <span className="italic text-xl text-center md:w-[60%]">
          Trapping app
        </span>
      </div>
      <div className="absolute bottom-9 right-2 flex justify-center">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4" onClick={handleClick}>
          Scan QR
        </button>
      </div>
      <div className="w-full absolute bottom-0 left-0 text-center border-t bg-sky-600 text-white py-1 text-xs brightness-110 tracking-wider">
        Developed by{" "}
        <span
          className="italic uppercase font-semibold text-sm hover:underline active:underline transition-all underline-offset-2 cursor-pointer"
          onClick={() => {
            window.open("https://treleva.org", { target: "_blank" });
          }}
        >
          Treleva Technologies
        </span>
      </div>
    </div>
  );
};
export default ConsoleLander;
