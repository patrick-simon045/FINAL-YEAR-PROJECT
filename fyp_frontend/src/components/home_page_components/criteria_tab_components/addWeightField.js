import React from "react";
import TextField from "@material-ui/core/TextField";

export function AddContributionField({ width, contribution, setContribution }) {
  return (
    <TextField
      InputProps={{ inputProps: { min: 0, max: 40 } }}
      id="outlined-question-field"
      label="Contribution"
      type="number"
      defaultValue={contribution}
      onChange={(event) => {
        console.log("new value: " + event.target.value);
        setContribution(event.target.value);
      }}
      variant="outlined"
      style={{ width: width === null ? "100px" : width }}
      onClick={() => console.log("number field")}
    />
  );
}
