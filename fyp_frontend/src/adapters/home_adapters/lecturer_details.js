// import axios from "axios";
// import { urls, headers } from "../../global";
// import { setLecturerDetails } from "../../state/reduxStateSlices/lecturer_detailsSlice";

// export function getLecturerDetails(dispatch) {
//   var res = {};
//   axios
//     .get(urls.lectureDetailsUrl, headers.headersWithToken)
//     .then((response) => {
//       console.log(response.data);
//       res = response.data;
//       console.log(res);
//       dispatch(setLecturerDetails(res));
//     })
//     .catch((error) => console.log("an error has occured"));

//   console.log(res);
//   return res;
// }
