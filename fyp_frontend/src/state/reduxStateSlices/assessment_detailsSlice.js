import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { sliceInitialDetails } from "../../global";

export const getAssessmentDetails = createAsyncThunk(
  "assessments/assessmentsDetails",
  (endpoint_details, thunkAPI) => {
    return axios
      .get(endpoint_details.url, endpoint_details.header)
      .then((response) => {
        console.log(response);
        return response.data;
      });
  }
);

const assessmentsDetailsSlice = createSlice({
  name: "assessments",
  initialState: {
    assessments: [
      {
        id: sliceInitialDetails.assessmentsDetailsSlice.id,
        criteria: sliceInitialDetails.assessmentsDetailsSlice.criteria,
        course: sliceInitialDetails.assessmentsDetailsSlice.course,
        academic_year:
          sliceInitialDetails.assessmentsDetailsSlice.academic_year,
        date_taken: sliceInitialDetails.assessmentsDetailsSlice.date_taken,
        number_of_questions:
          sliceInitialDetails.assessmentsDetailsSlice.number_of_questions,
        contribution: sliceInitialDetails.assessmentsDetailsSlice.contribution,
      },
    ],
  },
  reducers: {
    setCriteria: (state, action) => {
      state.criteria = action.payload.criteria;
    },
  },
  extraReducers: {
    [getAssessmentDetails.pending]: (state) => {
      console.log("loading assessment details");
    },
    [getAssessmentDetails.fulfilled]: (state, action) => {
      console.log("finished fetching assessment details");
      console.log(action.payload);
      state.assessments = [...action.payload];
    },
    [getAssessmentDetails.rejected]: (state) => {
      console.log("could not fetch assessment details");
    },
  },
});

export const { setCriteria } = assessmentsDetailsSlice.actions;

export default assessmentsDetailsSlice.reducer;
