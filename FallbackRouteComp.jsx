import { useLocation, useNavigate } from "react-router-dom";

const FallbackRouteComp = () => {
  const location = useLocation();
  const currentUrl = location.pathname;
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-2">
      <span className="text-yellow-600 text-9xl italic">404</span>
      <span className="text-center max-w-[30rem]">
        <b>Path: {currentUrl}</b> <br />
        You are trying to access a route for which you are not authorized or
        your session has expired. Try login again.
      </span>
      <div
        className="border rounded-full text-center- py-3 px-8 text-white text-xl bg-blue-500 hover:bg-blue-600 active:bg-blue-500 transition cursor-pointer"
        onClick={() => navigate("/")}
      >
        Go to LOGIN page
      </div>
    </div>
  );
};

export default FallbackRouteComp;
