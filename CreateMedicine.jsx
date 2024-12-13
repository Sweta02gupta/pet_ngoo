import React, { useEffect, useState } from "react";
import CircularLoader from "../../../components/Loaders/CircularLoader";
import SnackBarAlert from "../../../components/Dialog/SnackBarAlert";
import TokenReverification from "../../../components/Dialog/TokenReverification";
import CreateMedSuccessDialog from "../../../components/Dialog/MedicineDialogs/CreateMedSuccessDialog";
import { Autocomplete, Button, Checkbox, TextField } from "@mui/material";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";
import CreateActionsDialog from "../../../components/Dialog/MedicineDialogs/CreateActionsDialog";
import { useLocation, useNavigate } from "react-router-dom";

const CreateMedicine = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formFieldsData = location.state;

  // dialogs,alerts and loaders
  const [loader, setLoader] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [showCreateMedSuccessDialog, setShowCreateMedSuccessDialog] =
    useState(false);
  const [showTokenReverificationDialog, setShowTokenReverificationDialog] =
    useState(false);
  const [showInvCreateActionsDiag, setShowInvCreateActionsDiag] =
    useState(false);

  const [manufacturerList, setManufacturerList] = useState([]);
  const [articleList, setArticleList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [createArticlePayload, setCreateArticlePayload] = useState({});

  const [formData, setFormData] = useState({
    invName: formFieldsData ? formFieldsData.invName : "",
    invQuantity: formFieldsData ? formFieldsData.invQty : "",
    invPrice: formFieldsData ? formFieldsData.invPrice : "",
    invCategoryId: formFieldsData ? formFieldsData.invCategoryId : "",
    invDescription: formFieldsData ? formFieldsData.invDesc : "",
    invManufacturer: formFieldsData ? formFieldsData.invMfr : "",
    invSalt: formFieldsData ? formFieldsData.invSalt : "",
    invRefrigeration: formFieldsData ? formFieldsData.invRefrigeration : false,
    invRackNo: formFieldsData ? formFieldsData.invRackNo : "",
    invPotency: formFieldsData ? formFieldsData.invPotency : "",
    invArrivalDate: "",
    invExpDate: formFieldsData ? formFieldsData.invExpDt : "",
    invPack: formFieldsData ? formFieldsData.invPack : " ",
  });

  const fetchArticles = () => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/inventorymedicine/search/manufacturer?manufacturer=${
          formData.invManufacturer
        }`,
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
        console.log("article then", response);
        if (response.status === 200)
          setArticleList(response.data.uniArticleNameForManufacturer);
      })
      .catch((error) => {
        console.error("article then", error);
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
      });
  };

  const fetchManufacturers = () => {
    setLoader(true);
    axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/inventorymedicine/search/manufacturer?manufacturer=`,
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
        console.log("manufacture then", response);
        if (response.status === 200)
          setManufacturerList(response.data.uniManufacturer);
        setLoader(false);
      })
      .catch((error) => {
        console.error("manufacture then", error);
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
        setLoader(false);
      });
  };

  const fetchCategories = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/InventoryCategory`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("AFA_user"))?.token
          }`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("category then", response);
        if (response.status === 200) setCategoryList(response.data);
      })
      .catch((error) => {
        console.error("category then", error);
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
      });
  };

  const findCategoryIdByCategName = async (categoryName) => {
    console.log("executes when mounts");
    const filteredCategories = categoryList.filter(
      (categ) => categ.invCategory === categoryName
    );

    if (filteredCategories.length) {
      console.log("category already found");
      return filteredCategories[0].invCategoryId;
    } else {
      console.log("category not found");
      try {
        // Define the request body
        const requestBody = {
          invCategory: categoryName,
        };

        // Make the POST request and wait for the response
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/InventoryCategory/create`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("AFA_user"))?.token
              }`,
              "Content-Type": "application/json",
            },
          }
        );

        // Proceed with the response after the API has completed its work
        console.log("API Response:", response.data);

        if (
          response.status === 200 &&
          response.data?.message === "Category is created"
        ) {
          fetchCategories(); // Update the category list
          const newCategories = await axios.get(
            `${import.meta.env.VITE_API_URL}/InventoryCategory`,
            {
              headers: {
                Authorization: `Bearer ${
                  JSON.parse(localStorage.getItem("AFA_user"))?.token
                }`,
                "Content-Type": "application/json",
              },
            }
          );

          const filteredNewCategories = newCategories.data.filter(
            (categ) => categ.invCategory === categoryName
          );

          if (filteredNewCategories.length > 0) {
            return filteredNewCategories[0].invCategoryId;
          }
        }

        // Handle the case where category creation fails
        throw new Error("Category creation failed");
      } catch (error) {
        // Handle any errors that might occur during the API call
        console.error("Error making API call:", error.message);
        setSnackbarOpen({
          open: true,
          message: error.message,
          type: "error",
        });
      }
    }
  };

  const createArticles = (data) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/inventorymedicine/create`, data, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("AFA_user")).token
          }`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("inv create then", response);
        if (response.data?.action) {
          setShowInvCreateActionsDiag(true);
        } else if (
          response.data?.message === "Articles has been updated." ||
          response.data?.message === "Articles created successfully."
        ) {
          setShowCreateMedSuccessDialog(true);
        }
        setLoader(false);
      })
      .catch((error) => {
        console.error("inv create catch", error);
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
        setLoader(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    findCategoryIdByCategName(formData.invCategoryId)
      .then((categId) => {
        console.log(categId);
        setCreateArticlePayload({});
        const data = {
          ...formData,
          invCategoryId: categId,
          invLoginId: JSON.parse(localStorage.getItem("AFA_user")).userId,
        };
        console.log(data);
        setCreateArticlePayload(data);
        createArticles(data);
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteCategory = (categoryName) => {
    setLoader(true);
    const categoryIdToBeDeleted = categoryList.filter(
      (categ) => categ.invCategory === categoryName
    )[0]?.invCategoryId;
    console.log(categoryIdToBeDeleted);
    axios
      .delete(
        `${
          import.meta.env.VITE_API_URL
        }/InventoryCategory/delete/${categoryIdToBeDeleted}`,
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
        console.log("category delete then", response);
        setFormData({
          ...formData,
          invCategoryId: "",
        });
        fetchCategories();
        setSnackbarOpen({
          open: true,
          message: `${categoryName} successfully removed from category list`,
          type: "success",
        });
        setLoader(false);
      })
      .catch((error) => {
        console.error("category delete then", error);
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
        setLoader(false);
      });
  };

  useEffect(() => {
    console.log("data passed from view", formData);
    fetchManufacturers();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [formData.invManufacturer]);

  return (
    <>
      {loader && <CircularLoader />}
      <div className="w-screen min-h-screen pt-[70px] flex justify-center items-center">
        <div className="max-w-4xl w-full mx-auto">
          <div className="w-full overflow-y-auto p-[1rem] box-border flex flex-col items-center justify-center bg-slate-100 rounded-lg shadow-lg">
            <span className="w-full text-start text-2xl font-semibold uppercase">
              Create Articles
            </span>
            <form onSubmit={handleSubmit} className="p-4 md:p-8 w-full">
              <div className="flex flex-col justify-center items-center gap-4">
                <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4">
                  <Autocomplete
                    freeSolo
                    fullWidth
                    value={formData.invManufacturer}
                    onChange={(event, newValue) => {
                      setFormData({ ...formData, invManufacturer: newValue });
                    }}
                    onInputChange={(event, newValue) => {
                      setFormData({ ...formData, invManufacturer: newValue });
                    }}
                    options={manufacturerList}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Manufacturer"
                        name="manufacturer"
                        required
                      />
                    )}
                    disableClearable
                  />

                  <TextField
                    label="Generic Name(Salt)"
                    name="salt"
                    fullWidth
                    value={formData.invSalt}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        invSalt: e.target.value,
                      })
                    }
                  />
                  <Autocomplete
                    freeSolo
                    fullWidth
                    value={formData.invName}
                    onChange={(event, newValue) => {
                      setFormData({ ...formData, invName: newValue });
                    }}
                    onInputChange={(event, newValue) => {
                      setFormData({ ...formData, invName: newValue });
                    }}
                    options={articleList}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Article Name"
                        name="article"
                        required
                      />
                    )}
                    disableClearable
                  />
                </div>
                <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4">
                  <TextField
                    label="Rack"
                    name="rackNumber"
                    fullWidth
                    value={formData.invRackNo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        invRackNo: e.target.value,
                      })
                    }
                  />
                  <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4">
                    <Autocomplete
                      freeSolo
                      fullWidth
                      options={categoryList.map((option) => option.invCategory)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Category"
                          name="category"
                          required
                        />
                      )}
                      value={formData.invCategoryId}
                      onChange={(event, newValue) => {
                        setFormData({ ...formData, invCategoryId: newValue });
                      }}
                      onInputChange={(event, newValue) => {
                        setFormData({ ...formData, invCategoryId: newValue });
                      }}
                      renderOption={(props, option) => (
                        <li
                          {...props}
                          className="w-full flex items-center justify-between py-4 px-4 cursor-pointer hover:bg-gray-100 active:bg-gray-100 transition"
                        >
                          <span>{option}</span>
                          <AiFillDelete
                            className="text-2xl text-gray-400 cursor-pointer hover:text-gray-600 active:text-gray-600 transition"
                            onClick={() => {
                              handleDeleteCategory(option);
                            }}
                          />
                        </li>
                      )}
                      disableClearable
                    />
                  </div>
                </div>
                <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4">
                  <TextField
                    type="date"
                    name="arrivalDate"
                    required
                    label="Arrival Date"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formData.invArrivalDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        invArrivalDate: e.target.value,
                      })
                    }
                  />
                  <TextField
                    type="date"
                    name="expirationDate"
                    required
                    label="Expiry Date"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formData.invExpDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        invExpDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4">
                  <TextField
                    label="Quantity"
                    type="number"
                    name="quantity"
                    required
                    fullWidth
                    value={formData.invQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        invQuantity: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label="Price"
                    type="number"
                    name="price"
                    required
                    fullWidth
                    value={formData.invPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        invPrice: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4">
                  <TextField
                    label="Potency"
                    name="potency"
                    fullWidth
                    value={formData.invPotency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        invPotency: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label="Pack"
                    name="pack"
                    fullWidth
                    value={formData.invPack}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        invPack: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="w-full flex gap-2 items-center">
                  <Checkbox
                    checked={formData.invRefrigeration}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        invRefrigeration: e.target.checked,
                      });
                    }}
                  />
                  <span className="uppercase font-semibold tracking-wider text-xl">
                    Refrigeration
                  </span>
                </div>
                <TextField
                  label="Comments"
                  name="description"
                  required
                  multiline
                  fullWidth
                  rows={4}
                  variant="outlined"
                  placeholder="Enter your description..."
                  value={formData.invDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      invDescription: e.target.value,
                    })
                  }
                />
              </div>
              <Button
                variant="contained"
                type="submit"
                color="warning"
                sx={{
                  marginY: "1rem",
                  fontSize: "1rem",
                }}
                fullWidth
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      </div>
      <SnackBarAlert
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
      />
      {showTokenReverificationDialog && (
        <TokenReverification
          setShowTokenReverificationDialog={setShowTokenReverificationDialog}
        />
      )}
      {showCreateMedSuccessDialog && (
        <CreateMedSuccessDialog
          createMoreFunc={() => {
            setFormData({
              invName: "",
              invQuantity: "",
              invPrice: "",
              invPack: "",
              invCategoryId: "",
              invDescription: "",
              invManufacturer: "",
              invSalt: "",
              invRefrigeration: false,
              invRackNo: "",
              invPotency: "",
              invArrivalDate: "",
              invExpDate: "",
            });
            setShowCreateMedSuccessDialog(false);
          }}
          navigateToViewFun={() => {
            navigate("/user/ViewMedicine");
          }}
        />
      )}
      {showInvCreateActionsDiag && (
        <CreateActionsDialog
          backBtnFunc={() => {
            setShowInvCreateActionsDiag(false);
          }}
          createBtnFunc={() => {
            createArticles({
              ...createArticlePayload,
              action: "create",
            });
            setShowInvCreateActionsDiag(false);
          }}
          updateBtnFunc={() => {
            createArticles({
              ...createArticlePayload,
              action: "update",
            });
            setShowInvCreateActionsDiag(false);
          }}
        />
      )}
    </>
  );
};

export default CreateMedicine;
