import React, { useEffect, useState } from "react";
import { generateStringDate } from "../../utils/CustomUtilityFunctions";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ImageWithZoom from "../miscellaneous/ImageWithZoom";
import { Button } from "@mui/material";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  width: "100%",
  "&:before": {
    display: "none",
  },
}));

const PrimaryAccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={
      <ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem", color: "white" }} />
    }
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "#204c87",
  color: "white",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
  fontSize: 22,
  fontWeight: 500,
}));

const SecondaryAccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
  fontSize: 18,
  fontWeight: 450,
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const SubAccordion = ({
  secondaryExpanded,
  inv,
  ind2,
  handleSecondaryAccChange,
}) => {
  const [fetchImage, setFetchImage] = useState(false);
  return (
    <Accordion
      expanded={secondaryExpanded === `panel-${inv.invInvoiceNo}-${ind2}`}
      onChange={handleSecondaryAccChange(`panel-${inv.invInvoiceNo}-${ind2}`)}
    >
      <SecondaryAccordionSummary>{inv.invInvoiceNo}</SecondaryAccordionSummary>
      <AccordionDetails>
        <div
          className={`flex items-center ${
            fetchImage ? "" : "justify-center min-h-[20vh]"
          } gap-4 flex-wrap`}
        >
          {fetchImage ? (
            <>
              {inv.Images.map((imageName, ind) => (
                <div
                  className="w-[10rem] lg:w-[15rem] flex justify-center items-center"
                  key={`${ind}-${imageName}`}
                >
                  <ImageWithZoom
                    src={`${
                      import.meta.env.VITE_API_URL
                    }/billImage/${imageName}`}
                    alt={imageName}
                  />
                </div>
              ))}
            </>
          ) : (
            <Button
              variant="outlined"
              color="success"
              onClick={() => setFetchImage(true)}
              sx={{ fontSize: 20 }}
            >
              Download Image
            </Button>
          )}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

const BillAccordion = ({ uniqueInvoiceDates, bills }) => {
  const [primaryExpanded, setPrimaryExpanded] = useState(false);
  const [secondaryExpanded, setSecondaryExpanded] = useState(false);

  const handlePrimaryAccChange = (panel) => (event, isExpanded) => {
    setPrimaryExpanded(isExpanded ? panel : false);
  };
  const handleSecondaryAccChange = (panel) => (event, isExpanded) => {
    setSecondaryExpanded(isExpanded ? panel : false);
  };
  useEffect(() => {
    console.log("inv dates", uniqueInvoiceDates);
    console.log("bills", bills);
    uniqueInvoiceDates.map((uDate, ind) => {
      console.log(
        bills.filter((b) => {
          console.log(b.invInvoiceDate, uDate);
          return b.invInvoiceDate === uDate;
        })
      );
    });
  }, []);
  return (
    <>
      {uniqueInvoiceDates.map((uDate, ind) => (
        <Accordion
          expanded={primaryExpanded === `panel-${uDate}`}
          onChange={handlePrimaryAccChange(`panel-${uDate}`)}
          key={ind}
        >
          <PrimaryAccordionSummary>
            {generateStringDate(uDate)}
          </PrimaryAccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            {bills.filter((b) => b.invInvoiceDate === uDate).length ? (
              bills
                .filter((b) => b.invInvoiceDate === uDate)
                .map((inv, ind2) => (
                  <SubAccordion
                    secondaryExpanded={secondaryExpanded}
                    inv={inv}
                    ind2={ind2}
                    handleSecondaryAccChange={handleSecondaryAccChange}
                    key={ind2}
                  />
                ))
            ) : (
              <div className="w-full text-center italic py-2">
                No Bill(s) to show
              </div>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default BillAccordion;
