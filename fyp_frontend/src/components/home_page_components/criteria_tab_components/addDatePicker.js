import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

export function AddDatePickerWidget({ selectedDate, setSelectedDate }) {
  // const [selectedDate, setSelectedDate] = React.useState(date_taken);
  const handleDateChange = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    console.log("obtained date: " + day + "-" + month + "-" + year);
    const dateString = day + "-" + month + "-" + year;
    console.log(date);
    // console.log(date);
    try {
      setSelectedDate(date);
    } catch (error) {
      console.log("can not show new date");
      console.log("the error is : " + error);
    }
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        // disablePast
        // maxDate={new Date("12/31/" + (new Date().getFullYear + 1)).toString()}
        disableToolbar
        variant="inline"
        format="dd/MM/yyyy"
        margin="normal"
        id="date-picker-inline"
        label="Date of assessment"
        value={selectedDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
      />
    </MuiPickersUtilsProvider>
  );
}
