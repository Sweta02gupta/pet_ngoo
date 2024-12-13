import axios from "axios";
import { useEffect, useState } from "react";
import SkeletonLoader from "../../../components/Loaders/SkeletonLoader";
import SnackBarAlert from "../../../components/Dialog/SnackBarAlert";
import TokenReverification from "../../../components/Dialog/TokenReverification";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { DataGrid } from "@mui/x-data-grid";
import CircularLoader from "../../../components/Loaders/CircularLoader";
import AddIcon from "@mui/icons-material/Add";

const columns = [
  {
    field: "sno",
    headerName: "S. No.",
    width: 60,
  },
  {
    field: "AreaName",
    headerName: "Area Name",
    width: 300,
  },
];

const AreaManager = () => {
  // Loaders and Dialog togglers
  const [toggleCreateAreaDialog, setToggleCreateAreaDialog] = useState(false);
  const [showTokenReverificationDialog, setShowTokenReverificationDialog] =
    useState(false);
  const [dialogLoader, setDialogLoader] = useState(false);
  const [skeletonLoader, setSkeletonLoader] = useState(true);
  const skeletons = Array.from({ length: 8 }, (_, index) => (
    <SkeletonLoader key={index} />
  ));
  const [snackbarOpen, setSnackbarOpen] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const [areaList, setAreaList] = useState([]);
  const [newAreaName, setNewAreaName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Function to fetch area details from the API and sort by AreaName alphabetically
  const fetchAreaDetails = () => {
    setSkeletonLoader(true);
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/v2/area`,
        // `${import.meta.env.VITE_JAVA_API_URL}/api/v2/area`,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("AFA_user"))?.token
            }`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("area then", response);
        if (response.status === 200) {
          // Sort the areas by AreaName alphabetically
          const sortedAreas = response.data
            .sort((a, b) => a.afaAreaName.localeCompare(b.afaAreaName))
            .map((area, i) => ({
              sno: i + 1,
              id: area.afaAreaId,
              AreaName: area.afaAreaName,
              createdAt: area.afaAreaCreatedAt,
              updatedAt: area.afaAreaUpdatedAt,
            }));

          setAreaList(sortedAreas);
        }
      })
      .catch((error) => {
        console.error("area catch", error);
      })
      .finally(() => {
        setSkeletonLoader(false);
      });
  };

  const handleCreateAreaDialogOpen = () => {
    setToggleCreateAreaDialog(true);
  };

  const handleCreateAreaDialogClose = () => {
    setToggleCreateAreaDialog(false);
    setNewAreaName(""); // Reset input field when dialog is closed
  };

  const handleCreateArea = () => {
    setDialogLoader(true);
    // Make the API call to create the new area
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/v2/area/create`,
        // `${import.meta.env.VITE_JAVA_API_URL}/api/v2/area/create`,
        {
          afaAreaName: newAreaName,
        },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("AFA_user"))?.token
            }`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          // Area created successfully
          setSnackbarOpen({
            open: true,
            message: "Area created successfully!",
            type: "success",
          });
          fetchAreaDetails(); // Refresh area list
          handleCreateAreaDialogClose(); // Close dialog
        }
      })
      .catch((error) => {
        console.error("Error creating area:", error);
        setSnackbarOpen({
          open: true,
          message:
            error?.response?.data?.message ||
            "Error creating area. Please try again.",
          type: "error",
        });
      })
      .finally(() => {
        setDialogLoader(false);
      });
  };

  // Filtered area list based on search query
  const filteredAreaList = areaList.filter((area) =>
    area.AreaName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchAreaDetails();
  }, []);

  return (
    <>
      {skeletonLoader ? (
        <div className="mt-[65px] w-screen px-5 md:px-20 lg:px-72 pt-10 flex flex-col justify-center items-center gap-3">
          {skeletons}
        </div>
      ) : (
        <div className="mt-[65px] p-5 md:py-10 md:px-16 flex flex-col gap-10 md:gap-5">
          <div className="flex items-center justify-between gap-5">
            <p className="text-xl md:text-3xl">Area Manager</p>
            <Button
              variant="contained"
              onClick={handleCreateAreaDialogOpen}
              startIcon={<AddIcon />}
            >
              Create Area
            </Button>
          </div>
          <div className="w-full flex items-center justify-end">
            {/* Search field */}
            <TextField
              label="Search"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: -2 }}
              placeholder="Search Area"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="">
            <Box sx={{ height: 450, width: "100%" }}>
              <DataGrid
                rows={filteredAreaList}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                pageSizeOptions={[5, 10, 20]}
                checkboxSelection={false}
                disableColumnMenu
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                disableSelectionOnClick
                disableColumnResize
              />
            </Box>
          </div>
        </div>
      )}

      {/* Create Area Dialog */}
      <Dialog
        open={toggleCreateAreaDialog}
        onClose={handleCreateAreaDialogClose}
      >
        <DialogTitle>Create New Area</DialogTitle>
        <DialogContent>
          <p>Enter a new area name</p>
          <TextField
            autoFocus
            margin="dense"
            id="area-name"
            label="Area Name"
            type="text"
            fullWidth
            value={newAreaName}
            onChange={(e) => setNewAreaName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateAreaDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleCreateArea}
            color="primary"
            variant="contained"
          >
            Create
          </Button>
          {dialogLoader && <CircularLoader />}
        </DialogActions>
      </Dialog>
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

export default AreaManager;
