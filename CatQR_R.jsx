import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import SkeletonLoader from "../../components/Loaders/SkeletonLoader";
import AnimalPlaceholder from "../../components/miscellaneous/AnimalPlaceholder";
import { AppContext } from "../../context/SuperProvider";
import html2pdf from 'html2pdf.js';

import {
    getCurrentDateRev,
    getDateBeforeNDaysRev,
    searchDogObjects,
    sortArrayByUpdatedAt,
} from "../../utils/CustomUtilityFunctions";
import ViewControllers from "../../components/miscellaneous/ViewControllers";
import QR_R from "../../components/QR/QR_R";

const CatQR_R = (loginDetails) => {
    const { statusList } = useContext(AppContext);
    const location = useLocation();
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
    const [currentModification, setCurrentModification] = useState({});
    const [traps, setTraps] = useState([]);
    const [trapsBackup, setTrapsBackup] = useState([]);
    const [isDescending, setIsDescending] = useState(true);
    const numberOfDays = import.meta.env.VITE_QR_NUM_OF_DAYS ? parseInt(import.meta.env.VITE_QR_NUM_OF_DAYS) : 3;
    console.log(numberOfDays);
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() - numberOfDays);
    const formattedEndDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`;
    console.log(formattedEndDate);
    const [animalType, setAnimalType] = useState("Cat");
    const [isPrinting, setIsPrinting] = useState(false);

    const fetchAllTransaction = () => {
        setSkeletonLoader(true);
        setSearchQuery("");
        axios
            .get(`${import.meta.env.VITE_API_URL}/api/v2/rescue/cat/all`, {
                headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("AFA_user")).token
                        }`,
                    "Content-Type": "application/json",
                },
            })
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
                            SurgeryDate: trap?.afaSurgeryDate,
                            SurgeryImg: trap?.afaSurgeryImg,
                            createdAt: trap?.afaTnCreatedAt,
                            updatedAt: trap?.afaTnUpdatedAt,
                        };
                    });
                    setTrapsBackup(
                        sortArrayByUpdatedAt(
                            refactoredResponse.filter(
                                (trap) =>
                                    trap.StatusName === "trapped"
                            ),
                            isDescending
                        )
                    );
                    if  (searchQuery === "") {
                        setTrapsBackup(
                          sortArrayByUpdatedAt(
                            refactoredResponse.filter((trap) => {
                              // Check if the FileDate is within the last numberOfDays
                              const fileDate = trap.FileDate.split("-").reverse().join("-");
                              return fileDate >= formattedEndDate && trap.StatusName === "trapped";
                            }),
                            isDescending
                          )
                        );
                      }
                    setShowToDate("");
                    setShowFromDate("");
                    setTraps(
                        sortArrayByUpdatedAt(
                            refactoredResponse.filter(
                                (trap) =>
                                    trap.StatusName === "trapped"
                            ),
                            isDescending
                        )
                    );
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



    const handleFilterDataWithDate = () => {
        const today = new Date();
        const endDate = new Date(today);
        endDate.setDate(today.getDate() - numberOfDays);

        const formattedEndDate = getCurrentDateRev(endDate);

        const filteredData = trapsBackup.filter((item) => {
            const fileDate = item.FileDate.split("-").reverse().join("-");
            return fileDate >= formattedEndDate;
        });

        setTraps(sortArrayByUpdatedAt(filteredData, isDescending));
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

    const handlePrint = () => {
        setIsPrinting(true);
        const element = document.getElementById('qrContainer');

        const opt = {
            margin: 1.15,
            filename: 'qr_codes.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(element).set(opt).save().then(() => {
            setIsPrinting(false);
        });
    };

    useEffect(() => {
        if (loginDetails.loginDetails?.role.includes("ViewTrapper")) {
            // Filter traps based on user's role
            const filteredTraps = trapsBackup.filter(trap => trap.username === loginDetails.loginDetails?.username);
            setTraps(filteredTraps);
        } else {
            // If the user doesn't have the role, reset the traps to the original data
            setTraps(trapsBackup);
        }
    }, [loginDetails, trapsBackup]);


    return (
        <div className={`mt-[65px] max-w-screen font-quicksand overflow-x-hidden p-5 md:px-20 md:py-8 lg:px-90 flex flex-col justify-center items-center gap- md:gap-6 lg:gap-8 ${skeletonLoader ? 'hidden' : ''}`}>
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
            <button
                onClick={handlePrint}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Print QR Codes
            </button>

            <div id="qrContainer" className="w-full flex flex-wrap justify-center">
                {searchFilteredArrayToggle ? (
                    foundSearches.length ? (
                        foundSearches.map((trap, index) => (
                            <QR_R trap={trap} animalType={animalType} key={index} />
                        ))
                    ) : (
                        <AnimalPlaceholder fetchAllTransaction={fetchAllTransaction} />
                    )
                ) : (
                    traps.length ? (
                        traps.map((trap, index) => (
                            <QR_R trap={trap} size={isPrinting ? 35 : 100} animalType={animalType} key={index} />
                        ))
                    ) : (
                        <AnimalPlaceholder fetchAllTransaction={fetchAllTransaction} />
                    )
                )}

            </div>
        </div>
    );

};

export default CatQR_R;