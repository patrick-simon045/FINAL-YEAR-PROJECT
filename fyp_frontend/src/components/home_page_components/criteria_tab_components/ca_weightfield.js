import React from "react";
import TextField from "@material-ui/core/TextField";

export function Ca_WeightField({ contribution, disabled, width }) {
  return (
    <TextField
      InputProps={{ inputProps: { min: 0, max: 40 } }}
      id="outlined-weight-field"
      label="CA Weight"
      type="number"
      defaultValue={contribution}
      variant="outlined"
      style={{ width: width === null ? "100px" : width }}
      disabled={disabled === true ? true : false}
      onClick={() => console.log("ca weight field")}
    />
  );
}
