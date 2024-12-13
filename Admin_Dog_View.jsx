import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import SkeletonLoader from "../../../../components/Loaders/SkeletonLoader";
import ReleaseDialog from "../../../../components/Dialog/ReleaseDialog";
import DogAccordion from "../../../../components/Accordion/DogAccordion";
import SnackBarAlert from "../../../../components/Dialog/SnackBarAlert";
import TokenReverification from "../../../../components/Dialog/TokenReverification";
import AnimalPlaceholder from "../../../../components/miscellaneous/AnimalPlaceholder";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from '@mui/icons-material/Close';
//import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import {
  decodeStatusTextColor,
  getCurrentDateRev,
  getDateBeforeNDaysRev,
  searchDogObjects,
  sortArrayByUpdatedAt,
} from "../../../../utils/CustomUtilityFunctions";
import { AppContext } from "../../../../context/SuperProvider";
import ViewControllers from "../../../../components/miscellaneous/ViewControllers";
import ForceCaseCloseDialog from "../../../../components/Dialog/ForceCaseCloseDialog";
//import { faFilter, faSort } from '@fortawesome/free-solid-svg-icons';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

const Admin_Dog_View = () => {
  const { statusList } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu open/close
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
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

  const fetchAllTransaction = () => {
    setSearchQuery("");
    setSkeletonLoader(true);
    axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/api/v2/transaction/sterilization/dog/all`,
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
  const [filterType, setFilterType] = useState("");
const [selectedTrapperNames, setSelectedTrapperNames] = useState([]);
const [selectedStatuses, setSelectedStatuses] = useState([]);
const [filteredData, setFilteredData] = useState(trapsBackup);
const ITEM_HEIGHT = 12;
const [filteredTraps, setFilteredTraps] = useState([]);
 
const handleFilterDataWithDate = (startDate, endDate) => {
  const filteredData = trapsBackup.filter((trap) => {
    const trapDate = new Date(trap.TrapDate || trap.updatedAt);
    return trapDate >= new Date(startDate) && trapDate <= new Date(endDate);
  });
  setFoundSearches(filteredData);
  setSearchFilteredArrayToggle(filteredData.length > 0);
};

  
  // Handle checkbox changes for Trapper Name and Status
  // Reusable function to filter data
  const filterData = (trapperNames, statuses) => {
    const filtered = trapsBackup.filter(
      (trap) =>
        (!trapperNames.length || 
          trapperNames.map(n => n.toLowerCase()).includes(trap.username.toLowerCase())) &&
        (!statuses.length || 
          statuses.map(s => s.toLowerCase()).includes(trap.StatusName.toLowerCase()))
    );
    return filtered;
  };
  
  


const [startDate, setStartDate] = useState(null); // Initialize startDate
const [endDate, setEndDate] = useState(null); // Initialize endDate
useEffect(() => {
  let result = trapsBackup;
  
  // Apply Filtering
  if (selectedTrapperNames.length || selectedStatuses.length) {
    result = result.filter(
      (trap) =>
        (!selectedTrapperNames.length || selectedTrapperNames.includes(trap.username)) &&
        (!selectedStatuses.length || selectedStatuses.includes(trap.StatusName))
    );
  }
  
  // Apply Date Filtering
  if (startDate && endDate) {
    result = result.filter((trap) => {
      const trapDate = new Date(trap.date);
      return trapDate >= new Date(startDate) && trapDate <= new Date(endDate);
    });
  }
  
  // Apply Sorting
  if (filterType === "date") {
    result = result.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
  } else if (filterType === "area") {
    result = result.sort((a, b) => a.AreaName.localeCompare(b.AreaName));
  }
  
  setFilteredData(result);
  }, [
  filterType,
  selectedTrapperNames,
  selectedStatuses,
  startDate,
  endDate,
  trapsBackup,
  ]);
const handleFilterChange = (value) => {
  setFilterType(value);
  setSortType(""); // Reset sort when filter changes
  handleMenuClose();
};
const handleSortChange = (value) => {
  setSortType(value);
  setFilterType(value); // Ensure both are consistent
  handleMenuClose();
};



// Handlers for Changing Filters or Sorting

const [sortType, setSortType] = useState("");

const handleDateRangeChange = (start, end) => {
  setStartDate(start);
  setEndDate(end);
};

const handleCheckboxChange = (value, type) => {
  if (type === "trapperName") {
    const updatedTrapperNames = selectedTrapperNames.includes(value)
      ? selectedTrapperNames.filter((name) => name !== value)
      : [...selectedTrapperNames, value];
    setSelectedTrapperNames(updatedTrapperNames);
  } else if (type === "status") {
    const updatedStatuses = selectedStatuses.includes(value)
      ? selectedStatuses.filter((status) => status !== value)
      : [...selectedStatuses, value];
    setSelectedStatuses(updatedStatuses);
  }
};
const handleMenuClick = (event) => {
  setMenuAnchorEl(event.currentTarget);
  setIsMenuOpen(true);
};

const handleMenuClose = () => {
  setIsMenuOpen(false);
};

const handleCloseClick = () => {
  setIsMenuOpen(false);
};


    const handleAccordionCollapse = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  

  const updateComments = () => {
    setSkeletonLoader(true);
    setShowCmtUpdDialog(false);
    axios
      .put(
        `${
          import.meta.env.VITE_API_URL
        }/api/v2/transaction/sterilization/dog/update/${
          currentModification.id
        }`,
        JSON.stringify({
          afaComment: currentModification.Comment,
        }),
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
        console.log("cmts upd then", response);
        if (response.status === 200) {
          fetchAllTransaction();
          setSnackbarOpen({
            open: true,
            message: "Comments successfully updated",
            type: "success",
          });
        }
        setShowCmtUpdDialog(false);
        setSkeletonLoader(false);
      })
      .catch((error) => {
        console.error("cmts upd catch", error);
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
        setShowCmtUpdDialog(true);
        setSkeletonLoader(false);
      });
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
      const searchedData = searchDogObjects(traps, searchQuery); // Assuming this is your search function
      setFoundSearches(searchedData);
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

const [visibleDetails, setVisibleDetails] = useState({});

const handleDetailsToggle = (name) => {
  setVisibleDetails((prev) => ({
    ...prev,
    [name]: !prev[name],
  }));
};


return (
  <>
     {skeletonLoader ? (
      <div className="mt-[65px] w-screen px-5 md:px-20 lg:px-72 pt-10 flex flex-col justify-center items-center gap-3">
        {skeletons}
      </div>
    ) : (
      <>
      {/* Page Container */}
<div className="w-full flex flex-col">
  {/* Left Menu Section - 20% Width */}
  <div className="w-full flex justify-between items-center p-6  border-gray-300">


  <div className="sm:w-1/6">
    <IconButton onClick={isMenuOpen ? handleCloseClick : handleMenuClick} className="mb-4">
    {isMenuOpen ? <CloseIcon /> : <MoreVertIcon />}
    </IconButton>
    
    <Menu
      anchorEl={menuAnchorEl}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        style: {
          
            maxHeight: 200,
            width: "200px",
            zIndex: 9999,
            position: "fixed", // Fixed position
            top: menuAnchorEl?.getBoundingClientRect().bottom || "100px", // Dynamically calculates position
            left: menuAnchorEl?.getBoundingClientRect().left || "50px",
        },
      }}
    >
      
      <MenuItem>
        <div className="w-full">
          <strong>Sort By :</strong>
          <select
            className="mt-1 w-full py-1 px-2 border p-8 border-gray-100 rounded-md"
            value={sortType}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="">None</option>
            <option value="date">Date</option>
            <option value="area">Area</option>
          </select>
        </div>
      </MenuItem>

      <MenuItem>
  <div className="w-full">
    <strong>Filter By :</strong>
    <select
      className="mt-1 w-full py-1 px-2 border border-gray-100 rounded-md"
      value={filterType}
      onChange={(e) => {
        handleFilterChange(e.target.value); 
        handleMenuClose(); 
      }}
    >
      <option value="">None</option>
      <option value="trapperName">Trapper Name</option>
      <option value="status">Status</option>
    </select>
  </div>
</MenuItem>

    </Menu>

    {/* Filter Section */}
    <div className="flex flex-col sm:flex-col w-full">

      <div className="w-full sm:w-1/4 h-2 p-2">
      <div className="relative w-full sm:w-1/4 p-2">
  <div
  className="relative z-50 text-sm py-2 px-3 border-gray-300 rounded-md "
  style={{ position: 'fixed', top: '50px', zIndex: 9999 }}
>
{filterType === "trapperName" && (
  <div
    className="relative z-50 text-sm py-2 px-3 border-gray-300 rounded-md bg-white shadow-lg"
    style={{ position: 'absolute', top: '50px', zIndex: 9999 }}
  >
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold border-b pb-2">Select Trapper Names</h2>
      <button
        className="text-gray-600 text-sm font-semibold hover:underline"
        onClick={() => setFilterType(null)}
      >
        X
      </button>
    </div>
    {[...new Set(trapsBackup.map((trap) => trap.username))].map((name, index) => (
      <label key={index} className="flex items-center gap-2 mb-2 cursor-pointer">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-blue-600 rounded"
          checked={selectedTrapperNames.includes(name)}
          onChange={() => handleCheckboxChange(name, "trapperName")}
        />
        <span>{name}</span>
      </label>
    ))}
  </div>
)}

{filterType === "status" && (
  <div
    className="relative z-50 text-sm py-2 px-3 border-gray-300 rounded-md bg-white shadow-lg"
    style={{ position: 'fixed', top: '100px', zIndex: 9999 }}
  >
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold border-b pb-2">Select Status</h2>
      <button
        className="text-gray-600 text-sm font-semibold hover:underline"
        onClick={() => setFilterType(null)}
      >
        X
      </button>
    </div>
    {[...new Set(trapsBackup.map((trap) => trap.StatusName))].map((status, index) => (
      <label key={index} className="flex items-center gap-2 mb-2 cursor-pointer">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-green-600 rounded"
          checked={selectedStatuses.includes(status)}
          onChange={() => handleCheckboxChange(status, "status")}
        />
        <span>{status}</span>
      </label>
    ))}
  </div>
)}

  </div>


          {/* Display selected data */}
          <div className="mt-6">
            {selectedTrapperNames.length > 0 &&
              selectedTrapperNames.map((name, index) => (
                <div key={`trapper-${index}`} className="mb-4">
                  <div
                    id={`accordion-trapper-${index}`}
                    style={{ display: visibleDetails[name] ? "block" : "none" }}

                    className="mt-2"
                  >
                    {filteredData
                      .filter((trap) => trap.username === name)
                      .map((trap, subIndex) => (
                        <div key={subIndex} className="p-2 border-t">
                          <p className="text-gray-700">
                            <strong>Status:</strong> {trap.StatusName}
                          </p>
                          <p className="text-gray-700">
                            <strong>Date:</strong> {trap.date}
                          </p>
                          <p className="text-gray-700">
                            <strong>Description:</strong>{" "}
                            {trap.description || "No details available"}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}

            {selectedStatuses.length > 0 &&
              selectedStatuses.map((status, index) => (
                <div key={`status-${index}`} className="mb-4">
                  <div
                    id={`accordion-status-${index}`}
                    style={{ display: visibleDetails[name] ? "block" : "none" }}

                    className="mt-2"
                  >
                    {filteredData
                      .filter((trap) => trap.StatusName === status)
                      .map((trap, subIndex) => (
                        <div key={subIndex} className="p-2 border-t">
                          <p className="text-gray-700">
                            <strong>Trapper Name:</strong> {trap.username}
                          </p>
                          <p className="text-gray-700">
                            <strong>Date:</strong> {trap.date}
                          </p>
                          <p className="text-gray-700">
                            <strong>Description:</strong>{" "}
                            {trap.description || "No details available"}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Right Content Section - 80% Width */}
  <div className="w-4/5 sm:w-4/5 mx-auto p-5 flex justify-between items-center">
  <div className="w-full sm:w-4/5 lg:w-2/3 pt-10 ml-4 flex flex-wrap items-center justify-center sm:justify-start gap-2">
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
</div>


</div>
    {/* Right Section: Content Display (Tables or Data) */}   

  </div>
  <div className="w-full sm:w-3/4 lg:w-1/2 mx-auto sm:pt-0  sm:mt-0">
  {searchFilteredArrayToggle ? (
    <div className="w-full">
      {foundSearches.length ? (
        <>
          <div className="w-full text-sm sm:text-base md:text-lg font-medium text-center sm:text-left mb-4">
            {foundSearches.length} search{foundSearches.length > 1 ? "es" : ""} found for your query.
          </div>
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-300 w-full text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((trap, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 break-words">
                      <DogAccordion
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
                        setShowTokenReverificationDialog={setShowTokenReverificationDialog}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <AnimalPlaceholder fetchAllTransaction={fetchAllTransaction} />
      )}
    </div>
  ) : (
    <div className="w-full">
      {traps.length ? (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full text-xs sm:text-sm md:text-base">
            <tbody>
              {filteredData.map((trap, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 break-words">
                    <DogAccordion
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
                      setShowTokenReverificationDialog={setShowTokenReverificationDialog}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <AnimalPlaceholder fetchAllTransaction={fetchAllTransaction} />
      )}
    </div>
  )}
</div>
  

 {/* Release Dialog */}
 {showReleaseDialog && (
            <ReleaseDialog
              statusList={statusList.filter((s) =>
                ["trapped", "released", "surgery", "sick", "deceased", "release without surgery"].includes(s.StatusName)
              )}
              currentModification={currentModification}
              setShowReleaseDialog={setShowReleaseDialog}
              fetchAllTransaction={fetchAllTransaction}
              modifierType="admin"
            />
          )}

          {/* Force Close Dialog */}
          {showForceCloseDialog && (
            <ForceCaseCloseDialog
              fetchAllTransaction={fetchAllTransaction}
              currentModification={currentModification}
              showForceCloseDialog={showForceCloseDialog}
              setShowForceCloseDialog={setShowForceCloseDialog}
              statusList={statusList}
              setShowTokenReverificationDialog={setShowTokenReverificationDialog}
              dogCase
            />
          )}

        {/* Snackbar Alert */}
        <SnackBarAlert
            snackbarOpen={snackbarOpen}
            setSnackbarOpen={setSnackbarOpen}
          />

          {/* Token Reverification Dialog */}
          {showTokenReverificationDialog && (
            <TokenReverification
              setShowTokenReverificationDialog={setShowTokenReverificationDialog}
            />
          )}

          {/* Comment Update Dialog */}
          <Dialog
            open={showCmtUpdDialog}
            onClose={() => {
              setShowCmtUpdDialog((prev) => !prev);
            }}
          >
            <DialogTitle fontSize={16}>
              Updating Comments for {currentModification.FileNo}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>Put your comments below.</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Comments"
                variant="standard"
                fullWidth
                multiline
                minRows={3}
                maxRows={5}
                value={currentModification.Comment}
                onChange={(e) =>
                  setCurrentModification({
                    ...currentModification,
                    Comment: e.target.value,
                  })
                }
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setShowCmtUpdDialog((prev) => !prev);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (currentModification.Comment.length) {
                    updateComments();
                  } else {
                    setSnackbarOpen({
                      open: true,
                      message: "No comments found",
                      type: "error",
                    });
                  }
                }}
              >
                Update
              </Button>
            </DialogActions>
          </Dialog>
        </div>



       
      </>
    )}
   </>
);

}
export default Admin_Dog_View;