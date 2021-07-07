import React, { useEffect } from "react";
import { IconButton } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { QuestionsField } from "./questionsfield";
import { CriteriaSelect } from "./criteria_select";
import { Ca_WeightField } from "./ca_weightfield";
import { DatePickerWidget } from "./datepicker";
import axios from "axios";
import { headers, urls } from "../../../global";
import { AddCriteriaSelect } from "./addCriteriaSelect";
import { AddQuestionsField } from "./addQuestionsField";
import { AddContributionField } from "./addWeightField";
import { AddDatePickerWidget } from "./addDatePicker";
import { useSelector, useDispatch } from "react-redux";
import { AddCourse } from "./addCourse";
import { getAssessmentDetails } from "../../../state/reduxStateSlices/assessment_detailsSlice";

export function AddCriteriaButton() {
  const [open, setOpen] = React.useState(false);

  const [selectedCourse, setSelectedCourse] = React.useState("");
  const [selectedCriteria, setSelectedCriteria] = React.useState("");
  const [numberOfQuestions, setNumberOfQuestions] = React.useState(3);
  const [contribution, setContribution] = React.useState(15);
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token.tokenString);
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton aria-label="add criteria" onClick={handleClickOpen}>
        <div style={stylesObjects.iconButton}>
          <AddRoundedIcon />
        </div>
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {"Add assessment criteria"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <PopUpItems
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              selectedCriteria={selectedCriteria}
              setSelectedCriteria={setSelectedCriteria}
              numberOfQuestions={numberOfQuestions}
              setNumberOfQuestions={setNumberOfQuestions}
              contribution={contribution}
              setContribution={setContribution}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              console.log("create button clicked");

              const day = selectedDate.getDate();
              const month = selectedDate.getMonth() + 1;
              const year = selectedDate.getFullYear();
              console.log("obtained date: " + day + "-" + month + "-" + year);
              const dateString = day + "-" + month + "-" + year;

              const academic_year = getAcademicYear(month, year);
              const bodyData = {
                course: selectedCourse,
                criteria: selectedCriteria,
                number_of_questions: numberOfQuestions,
                contribution: contribution,
                academic_year: academic_year,
                date_taken: dateString,
              };

              console.log(bodyData);
              addAssessment(config, bodyData);

              await dispatch(
                getAssessmentDetails({
                  url: urls.getAssessmentDetails,
                  header: config,
                })
              );
              window.location.reload();

              setSelectedCriteria("");
              setNumberOfQuestions(3);
              setContribution(15);
              setSelectedDate(new Date("2014-08-18T21:11:54"));

              handleClose();
            }}
            variant="contained"
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function PopUpItems({
  selectedCriteria,
  setSelectedCriteria,
  numberOfQuestions,
  setNumberOfQuestions,
  contribution,
  setContribution,
  selectedDate,
  setSelectedDate,
  selectedCourse,
  setSelectedCourse,
}) {
  return (
    <div style={stylesObjects.popUpItemsCardStyle}>
      <AddCourse
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
      />
      <AddCriteriaSelect
        selectedCriteria={selectedCriteria}
        setSelectedCriteria={setSelectedCriteria}
      />
      <AddQuestionsField
        width={"200px"}
        numberOfQuestions={numberOfQuestions}
        setNumberOfQuestions={setNumberOfQuestions}
      />
      <AddContributionField
        width={"200px"}
        contribution={contribution}
        setContribution={setContribution}
      />
      <AddDatePickerWidget
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </div>
  );
}

function getAcademicYear(month, year) {
  let academic_year = "";

  if (month >= 11) {
    const end_year = year + 1;
    const start_year = year;
    academic_year = start_year + "/" + end_year;
  } else {
    const end_year = year;
    const start_year = year - 1;
    academic_year = start_year + "/" + end_year;
  }

  return academic_year;
}

function addAssessment(config, bodyData) {
  fetch(urls.assessmentDetails, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify(bodyData),
  })
    .then((response) => response.json())
    .then((json_response) => console.log(json_response))
    .catch((error) => {
      console.log("an error has occurred");
      console.log("the error is: " + error);
    });
}

const stylesObjects = {
  popUpItemsCardStyle: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "whitesmoke",
    padding: "20px 10px",
    borderRadius: "10px",
  },
  iconButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: "50%",
    height: 80,
    width: 80,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow:
      "10px -10px 20px rgba(255, 255, 255, 0.3), -10px 10px 20px rgba(20, 10, 0, 0.1)",
  },
};
