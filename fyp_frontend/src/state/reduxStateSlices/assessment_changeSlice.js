import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { sliceInitialDetails } from "../../global";

export const change_assessment_details = createAsyncThunk(
  "assessmentChange/assessment_change_details",
  (endpoint_details, thunkAPI) => {
    return axios
      .get(endpoint_details.url, endpoint_details.header)
      .then((response) => {
        return response.data;
      });
  }
);

const assessmentChangeDetails = createSlice({
  name: "assessmentChange",
  initialState: {
    criteria: sliceInitialDetails.assessmentChangeSlice.EMPTY_STRING,
    questions: sliceInitialDetails.assessmentChangeSlice.UNKWOWN_NUMBER,
    ca_weight: sliceInitialDetails.assessmentChangeSlice.UNKWOWN_NUMBER,
    date: sliceInitialDetails.assessmentChangeSlice.EMPTY_STRING,
  },
  reducers: {},
  extraReducers: {
    [change_assessment_details.pending]: (state) => {
      console.log("pending details update");
    },
    [change_assessment_details.fulfilled]: (state, action) => {
      console.log("completed details update");
      console.log(action.payload);
    },
    [change_assessment_details.rejected]: (state) => {
      console.log("could not perform details update");
    },
  },
});
