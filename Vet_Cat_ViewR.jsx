import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import SkeletonLoader from "../../../../components/Loaders/SkeletonLoader";
//import DogAccordion from "../../../../components/Accordion/DogAccordion";
//import CatAccordion from "../../../../components/Accordion/CatAccordion";
import CatAccordionR from "../../../../components/Accordion/CatAccordionR";
import SnackBarAlert from "../../../../components/Dialog/SnackBarAlert";
import TokenReverification from "../../../../components/Dialog/TokenReverification";
import AnimalPlaceholder from "../../../../components/miscellaneous/AnimalPlaceholder";
import {
  decodeStatusTextColor,
  getCurrentDateRev,
  getDateBeforeNDaysRev,
  searchDogObjects,
  sortArrayByUpdatedAt,
} from "../../../../utils/CustomUtilityFunctions";
import { AppContext } from "../../../../context/SuperProvider";
import ViewControllers from "../../../../components/miscellaneous/ViewControllers";
import SurgeryDialogCatR from "../../../../components/Dialog/SurgeryDialogCatR";

const Vet_Cat_ViewR = () => {
  const { statusList } = useContext(AppContext);

  // Loaders and Dialog togglers
  const [skeletonLoader, setSkeletonLoader] = useState(true);
  const skeletons = Array.from({ length: 8 }, (_, index) => (
    <SkeletonLoader key={index} />
  ));
  const [snackbarOpen, setSnackbarOpen] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [showTokenReverificationDialog, setShowTokenReverificationDialog] =
    useState(false);
  const [showReleaseDialog, setShowReleaseDialog] = useState(false);
  const [showSurgeryDialog, setShowSurgeryDialog] = useState(false);
  const [showForceCloseDialog, setShowForceCloseDialog] = useState(false);
  const [showCmtUpdDialog, setShowCmtUpdDialog] = useState(false);

  // date filter variables
  const [showToDate, setShowToDate] = useState("");
  const [showFromDate, setShowFromDate] = useState("");
  const [dateFilter, setDateFilter] = useState({
    min: "",
    max: "",
  });

  // Search state variables
  const [searchFilteredArrayToggle, setSearchFilteredArrayToggle] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [foundSearches, setFoundSearches] = useState([]);

  // State variables
  const [expanded, setExpanded] = useState(false);
  const [traps, setTraps] = useState([]);
  const [trapsBackup, setTrapsBackup] = useState([]);
  const [currentModification, setCurrentModification] = useState({});
  const [isDescending, setIsDescending] = useState(true);
  const location = useLocation();
  const [isRedirectedFromLocation, setIsRedirectedFromLocation] = useState(false);

  const fetchAllTransaction = () => {
    setSkeletonLoader(true);
    setSearchQuery("");
    axios
      .get(
        // `${
        //   import.meta.env.VITE_API_URL
        // }/api/v2/transaction/sterilization/dog/all/${
        //   JSON.parse(localStorage.getItem("AFA_user")).userId
        // }`,
        `${import.meta.env.VITE_API_URL}/api/v2/rescue/cat/vet/${
          JSON.parse(localStorage.getItem("AFA_user")).userId
        }`,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("AFA_user")).token
            }`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("transaction then", response);
        if (response.status === 200) {
          const refactoredResponse = response.data.map((trap) => {
            return {
              id: trap?.afaTnId,
              LoginId: trap?.afaTrapperId,
              username: trap?.afaTrapperName,
              CategoryId: trap?.afaCategoryId,
              Weight: trap?.afaWeight,
              gender: trap?.afaGender,
              Color: trap?.afaColorId,
              ColorName: trap?.afaColorName,
              AreaId: trap?.afaAreaId,
              AreaName: trap?.afaAreaName,
              NgoId: trap?.afaNgoId,
              NgoName: trap?.afaNgoName,
              StatusId: trap?.afaStatusId,
              StatusName: trap?.afaStatusName,
              FileDate: trap?.afaFileDate,
              CaseNo: trap?.afaCaseNo,
              FileNo: trap?.afaFileNo,
              Comment: trap?.afaComment,
              Remark: trap?.afaRemark,
              Landmark: trap?.afaLandmark,
              TrapDate: trap?.afaTrapDate,
              TrapImg: trap?.afaTrapImg,
              TrapLocation: trap?.afaTrapLocation,
              ReleaseDate: trap?.afaReleaseDate,
              ReleaseImg: trap?.afaReleaseImg,
              ReleaseLocation: trap?.afaReleaseLocation,
              SickDate: trap?.afaSickDate,
              SickImg: trap?.afaSickImg,
              TreatmentId: trap?.afaTreatmentId,
              TreatmentImg: trap?.afaTreatmentImg,
              VetId: trap?.afaVetId,
              ownerName: trap?.afaOwnerName,
              ownerContact: trap?.afaOwnerContact,
              SurgeryDate: trap?.afaSurgeryDate,
              SurgeryImg: trap?.afaSurgeryImg,
              createdAt: trap?.afaTnCreatedAt,
              updatedAt: trap?.afaTnUpdatedAt,
            };
          });
          setTrapsBackup(
            sortArrayByUpdatedAt(refactoredResponse, isDescending)
          );
          setShowToDate("");
          setShowFromDate("");
          setTraps(sortArrayByUpdatedAt(refactoredResponse, isDescending));
        }
        setSkeletonLoader(false);
      })
      .catch((error) => {
        console.error("transaction catch", error);
        if (error.code === "ERR_NETWORK") {
          setSnackbarOpen({
            open: true,
            message: "Error 503: Server is down",
            type: "error",
          });
          return;
        } else if (error?.response?.data.message === "jwt expired") {
          setShowTokenReverificationDialog(true);
        } else {
          setSnackbarOpen({
            open: true,
            message: error?.response?.data.message,
            type: "error",
          });
        }
        setSkeletonLoader(false);
      });
  };

  const decodeStatus = (statusId) => {
    const foundStatus = statusList.find((obj) => obj.id === statusId);
    return foundStatus ? foundStatus.StatusName : "-NA-";
  };

  const handleFilterDataWithDate = () => {
    if (showFromDate !== "" && showToDate !== "") {
      if (new Date(showFromDate) <= new Date(showToDate)) {
        console.log(showFromDate);
        console.log(showToDate);
        const filteredData = trapsBackup.filter((item) => {
          const fileDate = item.FileDate.split("-").reverse().join("-");
          return fileDate >= showFromDate && fileDate <= showToDate;
        });
        setTraps(sortArrayByUpdatedAt(filteredData, isDescending));
      } else {
        setSnackbarOpen({
          open: true,
          message: "From date cannot be greater than To date",
          type: "warning",
        });
      }
    }
  };

  const handleAccordionCollapse = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    fetchAllTransaction();
    setDateFilter({
      min: getDateBeforeNDaysRev(),
      max: getCurrentDateRev(),
    });
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchFilteredArrayToggle(false);
    } else {
      setSearchFilteredArrayToggle(true);
      console.log(searchDogObjects(traps, searchQuery));
      setFoundSearches(searchDogObjects(traps, searchQuery));
    }
  }, [searchQuery]);

  
  useEffect(() => {
    console.log("Passed Data to me:", location.state?.scannedData);

    if (location.state && location.state.scannedData) {
      const scannedData = JSON.parse(location.state.scannedData);

      if (scannedData.CaseNo) {
        setSearchFilteredArrayToggle(true);
        setSearchQuery(scannedData.FileNo);
        setFoundSearches(searchDogObjects(traps, scannedData.FileNo));
      }
    }
  }, [location.state?.scannedData, traps]);

  useEffect(() => {
    if (location.state && location.state.scannedData) {
      setIsRedirectedFromLocation(true);
    }
  }, [location.state?.scannedData]);

  useEffect(() => {
    if (isRedirectedFromLocation) {

      setShowSurgeryDialog(true);
    }
  }, [isRedirectedFromLocation]);
  
  return (
    <>
      {skeletonLoader ? (
        <div className="mt-[65px] w-screen px-5 md:px-20 lg:px-72 pt-10 flex flex-col justify-center items-center gap-3">
          {skeletons}
        </div>
      ) : (
        <>
          <div className="mt-[65px] max-w-screen font-quicksand overflow-x-hidden p-5 md:px-20 md:py-8 lg:px-72 flex flex-col justify-center items-center gap-3 md:gap-6 lg:gap-8">
            <ViewControllers
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              fetchAllTransaction={fetchAllTransaction}
              showFromDate={showFromDate}
              setShowFromDate={setShowFromDate}
              dateFilter={dateFilter}
              showToDate={showToDate}
              setShowToDate={setShowToDate}
              handleFilterDataWithDate={handleFilterDataWithDate}
            />
            {searchFilteredArrayToggle ? (
              <div className="w-full">
                {foundSearches.length ? (
                  <>
                    <div className="w-full text-xl md:text-2xl font-semibold">
                      {foundSearches.length} search(s) found for your query.
                    </div>
                    {foundSearches.map((trap, index) => (
                      <CatAccordionR
                        key={index}
                        index={index}
                        expanded={expanded}
                        setExpanded={setExpanded}
                        handleAccordionCollapse={handleAccordionCollapse}
                        trap={trap}
                        setCurrentModification={setCurrentModification}
                        setShowReleaseDialog={setShowReleaseDialog}
                        setShowForceCloseDialog={setShowForceCloseDialog}
                        decodeStatusTextColor={decodeStatusTextColor}
                        decodeStatus={decodeStatus}
                        setShowCmtUpdDialog={setShowCmtUpdDialog}
                        fetchAllTransaction={fetchAllTransaction}
                        setSnackbarOpen={setSnackbarOpen}
                        setShowTokenReverificationDialog={
                          setShowTokenReverificationDialog
                        }
                        setShowSurgeryDialog={setShowSurgeryDialog}
                        isVetView
                      />
                    ))}
                  </>
                ) : (
                  <AnimalPlaceholder
                    fetchAllTransaction={fetchAllTransaction}
                  />
                )}
              </div>
            ) : (
              <div className="w-full">
                {traps.length ? (
                  <>
                    {traps.map((trap, index) => (
                      <CatAccordionR
                        key={index}
                        index={index}
                        expanded={expanded}
                        setExpanded={setExpanded}
                        handleAccordionCollapse={handleAccordionCollapse}
                        trap={trap}
                        setCurrentModification={setCurrentModification}
                        setShowReleaseDialog={setShowReleaseDialog}
                        setShowForceCloseDialog={setShowForceCloseDialog}
                        decodeStatusTextColor={decodeStatusTextColor}
                        decodeStatus={decodeStatus}
                        setShowCmtUpdDialog={setShowCmtUpdDialog}
                        fetchAllTransaction={fetchAllTransaction}
                        setSnackbarOpen={setSnackbarOpen}
                        setShowTokenReverificationDialog={
                          setShowTokenReverificationDialog
                        }
                        setShowSurgeryDialog={setShowSurgeryDialog}
                        isVetView
                      />
                    ))}
                  </>
                ) : (
                  <AnimalPlaceholder
                    fetchAllTransaction={fetchAllTransaction}
                  />
                )}
              </div>
            )}
          </div>
        </>
      )}
      {showSurgeryDialog && (
        <SurgeryDialogCatR
          statusList={statusList}
          currentModification={currentModification}
          setShowSurgeryDialog={setShowSurgeryDialog}
          fetchAllTransaction={fetchAllTransaction}
        />
      )}
      <SnackBarAlert
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
      />
      {showTokenReverificationDialog && (
        <TokenReverification
          setShowTokenReverificationDialog={setShowTokenReverificationDialog}
        />
      )}
    </>
  );
};

export default Vet_Cat_ViewR;
