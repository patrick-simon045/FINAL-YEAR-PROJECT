export function updateAssessmentResultRecord(url, headers, body) {
  fetch(url, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((json_response) => console.log(json_response))
    .catch((error) => {
      console.log("an error has occurred");
      console.log("the error is: " + error);
    });
}
