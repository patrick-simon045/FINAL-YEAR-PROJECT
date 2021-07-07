import React from "react";
import TextField from "@material-ui/core/TextField";

export function AddQuestionsField({
  width,
  numberOfQuestions,
  setNumberOfQuestions,
}) {
  return (
    <TextField
      InputProps={{ inputProps: { min: 0, max: 10 } }}
      id="outlined-question-field"
      label="Questions"
      type="number"
      defaultValue={numberOfQuestions}
      onChange={(event) => {
        console.log("new value: " + event.target.value);
        setNumberOfQuestions(event.target.value);
      }}
      variant="outlined"
      style={{ width: width === null ? "100px" : width }}
      onClick={() => console.log("number field")}
    />
  );
}
