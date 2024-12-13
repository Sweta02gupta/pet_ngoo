import { Button, Card, CardActions, CardContent } from "@mui/material";
import ImageWithZoom from "../miscellaneous/ImageWithZoom";

const BillCards = ({
  billId,
  invoiceDate,
  invoiceNumber,
  Images,
  downloadImage,
  setSweeperImageList,
  setShowSweeper,
}) => {
  return (
    <Card sx={{ width: 280, border: "0.5px solid #d3d3d3" }}>
      <div className="w-full p-1 h-[15rem] flex justify-center items-center">
        <ImageWithZoom
          src={`${import.meta.env.VITE_API_URL}/billImage/${Images[0]}`}
          alt="bill"
        />
      </div>
      <CardContent>
        {Images.length > 1 && (
          <div className="w-full flex items-end justify-end">
            <span
              className="italic text-blue-500 font-semibold uppercase cursor-pointer"
              onClick={() => {
                setSweeperImageList([...Images]);
                setShowSweeper(true);
              }}
            >
              + {Images.length} Bills
            </span>
          </div>
        )}
        <div className="flex flex-col w-full gap-3">
          <span className="text-xl font-semibold truncate">
            {invoiceNumber}
          </span>
          <span className="font-medium italic">
            {invoiceDate.split("T")[0]}
          </span>
        </div>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          fullWidth
          sx={{ m: 1, bgcolor: "#1976D2" }}
          onClick={() => downloadImage(Images[0])}
        >
          Download
        </Button>
      </CardActions>
    </Card>
  );
};

export default BillCards;
