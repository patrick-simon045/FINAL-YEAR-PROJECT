const baseUrl = "http://127.0.0.1:8000/";

export const urls = {
  baseUrl: baseUrl,
  loginUrl: baseUrl + "token_auth/",
  lectureDetailsUrl: baseUrl + "api/lecturers/",
  assessmentCriteria: baseUrl + "api/ca_items/",
  assessmentDetails: baseUrl + "api/assessments/",
  assessmentDelete: baseUrl + "api/assessments_change/",
  getAssessmentResults: baseUrl + "api/assessment_results/",
  updateAssessmentResult: baseUrl + "api/assessment_results_update/",
  getResults: baseUrl + "api/results/",
  updateResultCell: baseUrl + "api/results/",
  get_ca_report: baseUrl + "api/get_ca_report/",
  download_ca_report: baseUrl + "api/download_ca_report/",
};

export const headers = {
  headersWithoutToken: {
    headers: {
      "Content-Type": "application/json",
    },
  },
  headersWithToken: {
    headers: {
      "Content-Type": "application/json",
      Authorization: sessionStorage.getItem("token"),
    },
  },
};

let EMPTY_STRING = "";
let UNKWOWN_STRING = "unknown";
let UNKWOWN_NUMBER = 0;
let UNKWOWN_ARRAY = [];

export const sliceInitialDetails = {
  lectureDetailsSlice: {
    user_name: UNKWOWN_STRING,
    lecturer_name: UNKWOWN_STRING,
    courses_teaching: UNKWOWN_ARRAY,
    course_count: UNKWOWN_NUMBER,
    position: UNKWOWN_STRING,
  },
  assessmentsDetailsSlice: {
    id: UNKWOWN_NUMBER,
    criteria: UNKWOWN_STRING,
    course: UNKWOWN_STRING,
    academic_year: UNKWOWN_STRING,
    date_taken: UNKWOWN_STRING,
    number_of_questions: UNKWOWN_NUMBER,
    contribution: UNKWOWN_NUMBER,
  },
  assessmentChangeSlice: {
    criteria: EMPTY_STRING,
    questions: UNKWOWN_NUMBER,
    ca_weight: UNKWOWN_NUMBER,
    date: EMPTY_STRING,
  },
};
