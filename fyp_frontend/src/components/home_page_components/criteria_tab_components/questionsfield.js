import React from "react";
import TextField from "@material-ui/core/TextField";

export function QuestionsField({ number_of_questions, disabled, width }) {
  return (
    <TextField
      InputProps={{ inputProps: { min: 0, max: 10 } }}
      id="outlined-question-field"
      label="Questions"
      type="number"
      defaultValue={number_of_questions}
      onChange={(value) => {
        console.log("new value: " + value);
      }}
      variant="outlined"
      style={{ width: width === null ? "100px" : width }}
      disabled={disabled === true ? true : false}
      onClick={() => console.log("number field")}
    />
  );
}
