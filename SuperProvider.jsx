import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

// Create the context
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  // state variables
  const [ngoList, setNgoList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [colorList, setColorList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/v2/ngo`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("AFA_user"))?.token
          }`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("ngo then", response);
        if (response.status === 200) {
          setNgoList(
            response.data.map((ngo) => {
              return {
                id: ngo.afaNgoId,
                NgoName: ngo.afaNgoName,
                createdAt: ngo.afaNgoCreatedAt,
                updatedAt: ngo.afaNgoUpdatedAt,
              };
            })
          );
        }
      })
      .catch((error) => {
        console.error("ngo catch", error);
      });
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
          setAreaList(
            response.data.map((area) => {
              return {
                id: area.afaAreaId,
                AreaName: area.afaAreaName,
                createdAt: area.afaAreaCreatedAt,
                updatedAt: area.afaAreaUpdatedAt,
              };
            })
          );
        }
      })
      .catch((error) => {
        console.error("area catch", error);
      });
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/v2/status`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("AFA_user"))?.token
          }`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("status then", response);
        if (response.status === 200) {
          setStatusList(
            response.data.map((status) => {
              return {
                id: status.afaStatusId,
                StatusName: status.afaStatusName,
                createdAt: status.afaStatusCreatedAt,
                updatedAt: status.afaStatusUpdatedAt,
              };
            })
          );
        }
      })
      .catch((error) => {
        console.error("status catch", error);
      });
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/v2/color`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("AFA_user"))?.token
          }`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("color then", response);
        if (response.status === 200) {
          setColorList(
            response.data.map((color) => {
              return {
                id: color.afaColorId,
                ColorName: color.afaColorName,
                ColorCode: color.afaColorCode,
                createdAt: color.afaColorCreatedAt,
                updatedAt: color.afaColorUpdatedAt,
              };
            })
          );
        }
      })
      .catch((error) => {
        console.error("color catch", error);
      });
  }, []);

  return (
    <AppContext.Provider value={{ ngoList, areaList, colorList, statusList }}>
      {children}
    </AppContext.Provider>
  );
};
