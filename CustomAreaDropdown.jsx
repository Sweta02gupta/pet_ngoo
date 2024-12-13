import React from "react";
import { Autocomplete, TextField } from "@mui/material";

const CustomAreaDropdown = ({
  areaOptions,
  formObj,
  setFormObj,
  areaDropDown,
  setAreaDropDown,
}) => (
  <Autocomplete
    options={areaOptions}
    getOptionLabel={(option) => option.AreaName}
    disableClearable
    value={areaDropDown}
    onChange={(event, newValue) => {
      setAreaDropDown(newValue);
      setFormObj({
        ...formObj,
        area: newValue?.id,
      });
    }}
    renderInput={(params) => (
      <TextField {...params} label="Select Area" variant="outlined" />
    )}
  />
);

export default CustomAreaDropdown;
