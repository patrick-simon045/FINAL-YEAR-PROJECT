import axios from "axios";
import { urls } from "../../global";

export function get_ca_report(config, setData) {
  fetch(urls.get_ca_report, {
    method: "GET",
    headers: config.headers,
  })
    .then((response) => response.json())
    .then((json_response) => {
      setData(json_response);
    })
    .catch((error) => {
      console.log({
        message: "an error has ocurred",
        error: error,
      });
    });
}

export function download_report(config, body, course) {
  axios({
    url: urls.download_ca_report,
    method: "post",
    responseType: "blob", // important
    headers: config.headers,
    data: {
      course: course,
    },
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "CA_REPORT" + 2020 + "/" + 2021 + ".xls"); //or any other extension
    document.body.appendChild(link);
    link.click();
  });
}
