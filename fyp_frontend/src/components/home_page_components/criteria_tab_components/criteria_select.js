import React, { useEffect } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import { headers, urls } from "../../../global";
// import { setCriteria } from "../../../state/reduxStateSlices/assessmentsDetailsSlice";

export function CriteriaSelect({ ca_items, criteria, ref, disabled }) {
  const [selectedCriteria, setSelectedCriteria] = React.useState(criteria);

  const handleSelectChange = (event) => {
    setSelectedCriteria(event.target.value);
  };

  return (
    <FormControl variant="outlined" style={{ width: "150px" }}>
      <InputLabel
        id="demo-simple-select-outlined-label"
        style={{ backgroundColor: "white", padding: "0 10px" }}
      >
        Criteria
      </InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={selectedCriteria}
        onChange={handleSelectChange}
        ref={ref}
        disabled={disabled === true ? true : false}
      >
        {ca_items.map((criteria, index) => {
          return (
            <MenuItem key={index} value={criteria}>
              {criteria}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
