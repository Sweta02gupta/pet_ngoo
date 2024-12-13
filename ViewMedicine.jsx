import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Select, MenuItem } from "@mui/material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { GrRefresh } from "react-icons/gr";
import SkeletonLoader from "../../../components/Loaders/SkeletonLoader";
import SnackBarAlert from "../../../components/Dialog/SnackBarAlert";
import axios from "axios";
import TokenReverification from "../../../components/Dialog/TokenReverification";
import {
  generateCurrentDate,
  searchInventoryObjects,
  sortArrayByExpirationDate,
  sortArrayByUpdatedAt,
} from "../../../utils/CustomUtilityFunctions";
import InventoryPlaceholder from "../../../components/miscellaneous/InventoryPlaceholder";
import { useNavigate } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const UsersActions = ({
  params,
  handleOpenModal,
  handleAddOpenModal,
  handleDelete,
  handleEditingModal,
  handleDeleteModal,
}) => {
  return (
    <div className="flex gap-2">
      <Button
        size="small"
        variant="contained"
        onClick={() => {
          handleOpenModal(params);
        }}
      >
        DISPATCH
      </Button>
      <Button
        size="small"
        variant="outlined"
        color="error"
        onClick={() => {
          handleAddOpenModal(params);
        }}
      >
        ADD
      </Button>
      <IconButton
        size="small"
        color="info"
        onClick={() => {
          handleEditingModal(params);
        }}
      >
        <Edit />
      </IconButton>
      <IconButton
        size="small"
        color="error"
        onClick={() => {
          handleDeleteModal(params);
        }}
      >
        <Delete />
      </IconButton>
    </div>
  );
};

const ViewMedicine = () => {
  const [threshold, setThreshold] = useState("");
  const columns = [
    {
      field: "invName",
      headerName: "Name",
      width: 140,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.invName}>
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {params.row.invName}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "invSalt",
      headerName: "Salt",
      valueGetter: (params) =>
        `${params.row.invSalt ? params.row.invSalt : "-"}`,
      width: 150,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.invSalt}>
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {params.row.invSalt}
          </div>
        </Tooltip>
      ),
    },

    {
      field: "invManufacturer",
      headerName: "Manufacturer",
      width: 140,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.invManufacturer}>
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {params.row.invManufacturer}
          </div>
        </Tooltip>
      ),
    },

    {
      field: "invPrice",
      headerName: "Price",
      type: "number",
      width: 80,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      align: "left",
      sortable: false,
    },
    {
      field: "invArrivalDate",
      headerName: "Arrival Date",
      valueGetter: (params) =>
        `${
          params.row.invArrivalDate
            ? params.row.invArrivalDate.split("T")[0]
            : ""
        }`,
      width: 130,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      sortable: true, //s
    },
    {
      field: "invExpDate",
      headerName: "Expiry Date",
      valueGetter: (params) => `${params.row.invExpDate.split("T")[0]}`,
      width: 120,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      sortable: true, //s
    },
    {
      field: "invQuantity",
      headerName: "Qty.",
      type: "number",
      width: 70,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      align: "left",
      sortable: true, //s
    },
    {
      field: "invRackNo",
      headerName: "Rack",
      width: 100,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      sortable: false,
    },
    {
      field: "invThreshold",
      headerName: "Threshold",
      type: "number",
      width: 100,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      align: "left",
      sortable: false,
    },
    {
      field: "invCategory",
      headerName: "Category",
      width: 130,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      sortable: false,
    },
    {
      field: "invPack",
      headerName: "Pack",
      valueGetter: (params) =>
        `${params.row.invPack ? params.row.invPack : "-"}`,
      width: 100,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      sortable: false,
    },
    {
      field: "invPotency",
      headerName: "Potency",
      valueGetter: (params) =>
        `${params.row.invPotency ? params.row.invPotency : "-"}`,
      width: 130,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      sortable: false,
    },
    {
      field: "invRefrigeration",
      headerName: "Refrigeration",
      valueGetter: (params) => `${params.row.invRefrigeration ? "Yes" : "No"}`,
      width: 100,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      sortable: false,
    },
    {
      field: "invDescription",
      headerName: "Comments",
      valueGetter: (params) =>
        `${params.row.invDescription ? params.row.invDescription : "-"}`,
      width: 180,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.row.invDescription}>
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {params.row.invDescription}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      headerAlign: "center",
      width: 260,
      renderCell: (params) => (
        <UsersActions
          {...{ params }}
          handleOpenModal={handleOpenModal}
          handleAddOpenModal={handleAddOpenModal}
          handleDelete={handleDelete}
          handleEditingModal={handleEditingModal}
          handleDeleteModal={handleDeleteModal}
        />
      ),
    },
  ];
  // -----
  const [inventoryData, setInventoryData] = useState([]);
  const [inventoryDataBackup, setInventoryDataBackup] = useState([]);
  const skeletons = Array.from({ length: 8 }, (_, index) => (
    <SkeletonLoader key={index} />
  ));
  const [loading, setLoading] = useState(false);
  const [showTokenReverificationDialog, setShowTokenReverificationDialog] =
    useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const navigate = useNavigate();

  // description modal
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [description, setDescription] = useState("");
  const handleShowDescription = (description) => {
    setDescription(description);
    setShowDescriptionModal(true);
  };

  // dispatch modal
  const [dispatchRowId, setDispatchRowId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [medicineName, setMedicineName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState(null);

  const [requiredQuantity, setRequiredQuantity] = useState("");
  const [currentDate, setCurrentDate] = useState(generateCurrentDate());
  const handleOpenModal = (params) => {
    console.log(params);
    setRequesterName("");
    setRequiredQuantity("");
    // Fetch the name and manufacturer of the selected medicine
    const selectedMedicine = inventoryData.find(
      (item) => item.id === params.id
    );
    if (selectedMedicine) {
      setMedicineName(selectedMedicine.name);
      setManufacturer(selectedMedicine.manufacturer);
    }
    setDispatchRowId(params.id);
    setIsModalOpen(true);
  };
  //-----------------------------------------------------
  //Edit Modal
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  //const [currentRowData, setCurrentRowData] = useState(null);
  // const [quantity, setQuantity] = useState("");
  // const [price, setPrice] = useState("");
  // const [expiryDate, setExpiryDate] = useState("");
  // const [potency, setPotency] = useState("");
  const [name, setName] = useState("");
  const [rackNumber, setRackNumber] = useState("");
  const [pack, setPack] = useState("");
  const [salt, setSalt] = useState("");
  // const[arrivalDate,setArrivalDate]=useState("")
  const [currentRowId, setCurrentRowId] = useState(null);
  const [arrivalDate, setArrivalDate] = useState("");
  const [loginId, setLoginId] = useState("");
  const [category, setCategory] = useState("");

  const handleEditingModal = (params) => {
    setCurrentRowId(params.id);
    const {
      invName,
      invRackNo,
      invPack,
      invPrice,
      invQuantity,
      invExpDate,
      invPotency,
      invSalt,
      invArrivalDate,
      invManufacturer,
      invDescription,
      invCategory,
      invLoginId,
      invThreshold,
    } = params.row;

    setName(invName);
    setRackNumber(invRackNo);
    setManufacturer(invManufacturer);
    setPack(invPack);
    setPrice(invPrice);
    setQuantity(invQuantity);
    setExpiryDate(invExpDate.split("T")[0]);
    setPotency(invPotency);
    setSalt(invSalt);
    setArrivalDate(invArrivalDate.split("T")[0]);
    setDescription(invDescription);
    setCategory(invCategory);
    setIsEditingModalOpen(true);
    setLoginId(invLoginId);
  };

  const handleDeleteModal = (params) => {
    setDeleteRowId(params.id);
    setShowDeleteModal(true);
  };

  const handleEditSaveModal = () => {
    setLoading(true);
    setIsEditingModalOpen(false);
    const requestData = {
      invName: name,
      invRackNo: rackNumber ? rackNumber.toString() : "", // Ensure it's a string
      invManufacturer: manufacturer,
      invPack: pack ? pack.toString() : "", // Ensure it's a string
      invPrice: price,
      invQuantity: quantity,
      invExpDate: expiryDate,
      invSalt: salt,
      invArrivalDate: arrivalDate,
      invDescription: description,
      invLoginId: loginId,
      invThreshold: Number(threshold),
      invCategory: category,
    };

    if (potency && potency.trim()) {
      requestData.invPotency = potency.toString();
    }

    axios
      .put(
        `${
          import.meta.env.VITE_API_URL
        }/inventorymedicine/updateArticleById/${currentRowId}`,
        requestData,
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
        console.log("Medicine updated successfully:", response.data);
        setSnackbarOpen({
          open: true,
          message: "Medicine updated successfully.",
          type: "success",
        });
        // Refresh inventory data with search filter reapplied
        fetchInventoryData(true);
        setLoading(false);
        setIsEditModalOpen(false);
      })
      .catch((error) => {
        console.error("Error updating medicine:", error);

        if (error.code === "ERR_NETWORK") {
          setSnackbarOpen({
            open: true,
            message: "Error 503: Server is down",
            type: "error",
          });
        } else if (error?.response?.data.message === "jwt expired") {
          setShowTokenReverificationDialog(true);
        } else {
          setSnackbarOpen({
            open: true,
            message: error.response?.data.message,
            type: "error",
          });
        }

        setLoading(false);
      });
  };

  //------------------------------------------------------------
  // Delete the row using the specified endpoint
  const handleDelete = () => {
    axios
      .delete(
        `${
          import.meta.env.VITE_API_URL
        }/inventorymedicine/delete/${deleteRowId}`,
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
        console.log("Medicine deleted successfully:", response.data);
        setSnackbarOpen({
          open: true,
          message: "Medicine deleted successfully.",
          type: "success",
        });
        fetchInventoryData();
        setShowDeleteModal(false); // Close the delete modal
      })
      .catch((error) => {
        console.error("Error deleting medicine:", error);
        if (error.code === "ERR_NETWORK") {
          setSnackbarOpen({
            open: true,
            message: "Error 503: Server is down",
            type: "error",
          });
        } else if (error?.response?.data.message === "jwt expired") {
          setShowTokenReverificationDialog(true);
        } else {
          setSnackbarOpen({
            open: true,
            message: error.response?.data.message,
            type: "error",
          });
        }
      });
  };

  //------------Dispatch modal---------------------------------------------
  const handleSaveModal = () => {
    setLoading(true);
    const requestData = {
      quantity: requiredQuantity,
      allotedPerson: requesterName,
      // currentDate: currentDate,
    };
    axios
      .post(
        `${
          import.meta.env.VITE_API_URL
        }/inventorymedicine/inventory/sell/${dispatchRowId}`,
        requestData,
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
        // Handle success response
        console.log("Medicine Dispatched successfully:", response.data);
        setSnackbarOpen({
          open: true,
          message: "Medicine Dispatched successfully.",
          type: "success",
        });
        setLoading(false);
        fetchInventoryData();
        setIsModalOpen(false);
      })
      .catch((error) => {
        // Handle error response
        console.error("Error Dispatching medicine:", error);
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
            message: error.response.data.message,
            type: "error",
          });
        }
        setLoading(false);
      });
  };
  //---------------------------------------------------------------------------------------
  // add modal
  const [currentRowData, setCurrentRowData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [potency, setPotency] = useState("");
  //const[manufacture,setManufacturer]=useState("")
  //const[salt,Set]

  const handleAddOpenModal = (params) => {
    console.log(params);
    setPrice("");
    setQuantity("");
    setExpiryDate("");
    setPotency("");
    setManufacturer("");
    setName("");
    setThreshold("");
    setCurrentRowData(params);
    setIsEditModalOpen(true);
    setLoginId(params?.row?.invLoginId || "");
    setCategory("");
  };

  const handleAddSaveModal = async () => {
    if (!currentRowData?.id) {
      setSnackbarOpen({
        open: true,
        message: "Invalid data for medicine update.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    const requestData = {
      invQuantity: quantity,
      invPrice: price,
      invExpDate: expiryDate,
      invPotency: potency,
      invLoginId: loginId,
      invManufacturer: manufacturer,
      invName: name,
      invThreshold: threshold,
    };

    try {
      // Fetch the existing medicine details
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/inventorymedicine/${
          currentRowData.id
        }`,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("AFA_user")).token
            }`,
            "Content-Type": "application/json",
          },
        }
      );

      const existingMedicine = response.data;
      console.log("Existing Medicine Data:", existingMedicine);

      const selectedPotency = potency;
      const existingPotency = existingMedicine.invPotency;
      const selectedExpiryDate = new Date(expiryDate).toISOString();
      const existingExpiryDate = new Date(
        existingMedicine.invExpDate
      ).toISOString();

      if (
        selectedExpiryDate !== existingExpiryDate ||
        selectedPotency !== existingPotency
      ) {
        // Proceed to update the medicine
        const putResponse = await axios.put(
          `${import.meta.env.VITE_API_URL}/inventorymedicine/updatearticle`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("AFA_user")).token
              }`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Medicine updated successfully:", putResponse.data);
        setSnackbarOpen({
          open: true,
          message: "Medicine updated successfully.",
          type: "success",
        });
        fetchInventoryData(); // Assuming you fetch the updated inventory list
      } else {
        // Check if required fields are missing and handle accordingly
        if (!existingMedicine?.invName || !existingMedicine?.invManufacturer) {
          setSnackbarOpen({
            open: true,
            message: "Error: Missing required fields.",
            type: "error",
          });
          return;
        }

        const formFieldsData = {
          invQty: quantity,
          invPrice: price,
          invThreshold: threshold,
          invExpDt: expiryDate,
          invPotency: potency,
          invName: existingMedicine?.invName || "", // Fallback to empty string
          invMfr: existingMedicine?.invManufacturer || "", // Fallback to empty string
          invCategoryId: existingMedicine?.invCategory || "",
          invDesc: existingMedicine?.invDescription || "",
          invRackNo: existingMedicine?.invRackNo || "",
          invSalt: existingMedicine?.invSalt || "",
          invRefrigeration: existingMedicine?.invRefrigeration || "",
          invPack: existingMedicine?.invPack || "",
        };

        console.log("Form Fields Data:", formFieldsData);
        navigate("/user/CreateMedicine", { state: formFieldsData });
      }

      // Reset state and close modal
      setLoading(false);
      setIsEditModalOpen(false);
      setQuantity("");
      setPrice("");
      setExpiryDate("");
      setPotency("");
      setManufacturer("");
      setName("");
      setThreshold("");
      setCategory("");
    } catch (error) {
      console.error("Error fetching or updating medicine:", error);
      setLoading(false);

      if (error.code === "ERR_NETWORK") {
        setSnackbarOpen({
          open: true,
          message: "Error 503: Server is down",
          type: "error",
        });
      } else if (error?.response?.data.message === "jwt expired") {
        setShowTokenReverificationDialog(true);
      } else {
        setSnackbarOpen({
          open: true,
          message: error.response?.data.message || "Something went wrong.",
          type: "error",
        });
      }
    }
  };

  // const categories = [
  //   "ORAL TABLET",
  //   "ORAL LIQUID",
  //   "ORAL SYRUP",
  //   "ORAL SUPPLEMENT",
  //   "EAR DROPS",
  //   "INJECTION",
  //   "Test",
  //   "TOPICAL OIN",
  //   "",
  // ];

  // // Search state variables
  // const [searchQuery, setSearchQuery] = useState("");

  // const fetchInventoryData = (applySearchFilter = false) => {
  //   setLoading(true);
  //   const searchParams = new URLSearchParams({ searchQuery }).toString(); // Add searchQuery as a parameter
  //   const token = JSON.parse(localStorage.getItem("AFA_user"))?.token || "";

  //   axios
  //     .get(
  //       `${import.meta.env.VITE_API_URL}/inventorymedicine?${searchParams}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       const sortedData = sortArrayByUpdatedAt(response.data, true);
  //       setInventoryData(sortedData);
  //       setInventoryDataBackup(sortedData);
  //       setLoading(false);

  const categories = [
    "ORAL TABLET",
    "ORAL LIQUID",
    "ORAL SYRUP",
    "ORAL SUPPLEMENT",
    "EAR DROPS",
    "INJECTION",
    "Test",
    "TOPICAL OIN",
    "",
  ];

  // Search state variables
  const [searchQuery, setSearchQuery] = useState("");

  const fetchInventoryData = (applySearchFilter = false) => {
    setLoading(true);
    const searchParams = new URLSearchParams({ searchQuery }).toString(); // Add searchQuery as a parameter
    const token = JSON.parse(localStorage.getItem("AFA_user"))?.token || "";

    axios
      .get(
        `${import.meta.env.VITE_API_URL}/inventorymedicine?${searchParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const sortedData = sortArrayByUpdatedAt(response.data, true);
        setInventoryData(sortedData);
        setInventoryDataBackup(sortedData);
        setLoading(false);

        // Reapply search filter if flag is set
        if (applySearchFilter && searchQuery) {
          setInventoryData(searchInventoryObjects(sortedData, searchQuery));
        }
      })
      .catch((error) => {
        console.error("inventory catch", error);
        if (error.response?.data.message === "jwt expired") {
          setShowTokenReverificationDialog(true);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  useEffect(() => {
    if (searchQuery !== "") {
      const filteredData = searchInventoryObjects(
        [...inventoryDataBackup],
        searchQuery
      );

      setInventoryData(sortArrayByExpirationDate(filteredData));
    } else {
      setInventoryData(inventoryDataBackup);
    }
  }, [searchQuery]);

  const searchInventoryObjects = (inventoryData, searchQuery) => {
    if (!searchQuery) {
      return inventoryData;
    }
    searchQuery = searchQuery.toLowerCase();
    return inventoryData.filter((item) => {
      return (
        item.invName.toLowerCase().includes(searchQuery) ||
        item.invManufacturer.toLowerCase().includes(searchQuery) ||
        (item.invSalt && item.invSalt.toLowerCase().includes(searchQuery)) ||
        (item.invPrice && item.invPrice.toString().includes(searchQuery))
      );
    });
  };

  return (
    <>
      {loading ? (
        <div className="mt-[65px] w-screen px-5 pt-10 flex flex-col justify-center items-center gap-3">
          {skeletons}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-5 w-screen pt-[80px]">
          <div className="w-full flex items-center justify-end gap-3 px-10">
            <TextField
              type="search"
              label="Search"
              placeholder="Enter to search"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="end">
                    <SearchOutlinedIcon />
                  </InputAdornment>
                ),
                autoComplete: "off",
              }}
              variant="standard"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Tooltip title="Refresh">
              <div
                className="mx-3"
                onClick={() => {
                  fetchInventoryData();
                }}
              >
                <GrRefresh className="mt-5 text-xl font-semibold cursor-pointer" />
              </div>
            </Tooltip>
          </div>
          {inventoryData.length ? (
            <Box
              sx={{
                width: "100%",
                paddingX: "15px",
                "& .super-app-theme--header": {
                  backgroundColor: "#1976D2",
                  color: "white",
                  borderRight: "0.5px solid white",
                },
                "& .super-app-theme--cell": {
                  borderRight: "0.5px solid #e7e7ef",
                },
              }}
            >
              <DataGrid
                sx={{
                  minHeight: 400,
                  maxHeight: 650,
                  border: "0.5px solid gray",
                }}
                rows={inventoryData}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                pageSizeOptions={[5, 10, 15, 20]}
                disableRowSelectionOnClick
                disableColumnFilter
                disableColumnMenu
                getRowId={(row) => row.invId}
                onCellClick={(params) => {
                  console.log(params);
                  if (
                    params.colDef.field === "description" ||
                    (params.colDef.field === "salt" && params.row.salt)
                  )
                    handleShowDescription(
                      params.colDef.field === "description"
                        ? params.row.description
                        : params.row.salt
                    );
                }}
              />
            </Box>
          ) : (
            <InventoryPlaceholder fetchInventoryData={fetchInventoryData} />
          )}
        </div>
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
      <Dialog
        open={showDescriptionModal}
        onClose={() => setShowDescriptionModal(false)}
      >
        <DialogTitle>Medicine Description</DialogTitle>
        <DialogContent>
          <p>{description}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDescriptionModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>
          {currentRowData
            ? `Disptch Quantity - ${currentRowData.row.invName} (${currentRowData.row.invManufacturer})`
            : "Disptch Quantity"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Requester Name"
            value={requesterName}
            onChange={(e) => setRequesterName(e.target.value)}
            fullWidth
            sx={{ marginBottom: 3 }}
          />
          <TextField
            label="Required Quantity"
            value={requiredQuantity}
            onChange={(e) => setRequiredQuantity(e.target.value)}
            fullWidth
            sx={{ marginBottom: 3 }}
          />
          <TextField
            label="Current Date"
            value={currentDate}
            type="date"
            onChange={(e) => setCurrentDate(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveModal} color="primary" disabled={loading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <DialogTitle>{`ADD Quantity - ${currentRowData?.row.invName} (${currentRowData?.row.invManufacturer})`}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={currentRowData?.row.invName}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ marginBottom: 3, marginTop: 3 }}
          />
          <TextField
            label="Threshold"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            fullWidth
            sx={{ marginBottom: 3 }}
          />
          <TextField
            label="Quantity"
            value={quantity}
            type="number"
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
            sx={{ marginBottom: 3 }}
          />
          <TextField
            label="Price"
            value={price}
            type="number"
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            sx={{ marginBottom: 3 }}
          />
          <TextField
            type="date"
            name="expirationDate"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            label="Expiry Date"
            fullWidth
            sx={{ marginBottom: 3 }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Potency"
            value={potency}
            onChange={(e) => setPotency(e.target.value)}
            fullWidth
            sx={{ marginBottom: 3 }}
          />
          <TextField
            label="Manufacturer"
            value={currentRowData?.row.invManufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleAddSaveModal}
            color="primary"
            disabled={loading}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* ------------------------------------------------------------------------------------ */}
      {/* Editing save modal */}
      <Dialog
        open={isEditingModalOpen}
        onClose={() => setIsEditingModalOpen(false)}
      >
        <DialogTitle>{`Edit Articles - ${name} (${manufacturer})`}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ marginBottom: 3, marginTop: 3 }}
          />
          <TextField
            label="Threshold"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            fullWidth
            sx={{ marginBottom: 3 }}
          />
          <TextField
            label="Salt"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
            fullWidth
            sx={{ marginBottom: 3 }}
          />
          <TextField
            label="Manufacturer"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            fullWidth
            sx={{ marginBottom: 3 }}
          />
          <TextField
            label="Rack Number"
            value={rackNumber}
            onChange={(e) => setRackNumber(e.target.value)}
            fullWidth
            sx={{ marginBottom: 3 }}
          />
          <TextField
            label="Quantity"
            value={quantity}
            type="number"
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
            sx={{ marginBottom: 3 }}
          />
          <TextField
            label="Price"
            value={price}
            type="number"
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            sx={{ marginBottom: 3 }}
          />
          <TextField
            type="date"
            name="arrivalDate"
            value={arrivalDate}
            onChange={(e) => setArrivalDate(e.target.value)}
            label="Arrival Date"
            fullWidth
            sx={{ marginBottom: 3 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            type="date"
            name="expirationDate"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            label="Expiry Date"
            fullWidth
            sx={{ marginBottom: 3 }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Category"
            select // Add this to make it a dropdown
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            sx={{ marginBottom: 3 }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Potency"
            value={potency}
            onChange={(e) => setPotency(e.target.value)}
            fullWidth
            sx={{ marginBottom: 3 }}
          />
          <TextField
            label="Comment"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            sx={{ marginBottom: 3 }}
          />
          <TextField
            label="Pack"
            value={pack}
            onChange={(e) => setPack(e.target.value)}
            fullWidth
            sx={{ marginBottom: 3 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditingModalOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSaveModal} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete confirm modal */}
      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this article?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewMedicine;
