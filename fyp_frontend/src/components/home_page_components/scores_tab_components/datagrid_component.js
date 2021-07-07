import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@material-ui/data-grid";
import { updateAssessmentResultRecord } from "../../../adapters/home_adapters/update_assessment_record";
import { urls } from "../../../global";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

function DataGridComponent({ rows, data, config, index }) {
  return (
    <div style={{ backgroundColor: "white", borderRadius: "10px" }}>
      <DataGrid
        id={index}
        rows={rows}
        columns={columns}
        autoHeight="true"
        checkboxSelection
        components={{
          Toolbar: CustomToolbar,
        }}
        onEditCellChange={(cell) => {
          const record_id = cell.id;
          const new_score = Number(cell.props.value);

          let dataRecord = searchArray(record_id, data).record;
          dataRecord.score = new_score;

          const url = urls.updateAssessmentResult + dataRecord.id;
          const headers = config.headers;
          const body = {
            id: dataRecord.id,
            assessment: dataRecord.assessment.id,
            semester: dataRecord.semester,
            course_type: dataRecord.course_type,
            year_of_study: dataRecord.year_of_study,
            academic_year: dataRecord.academic_year,
            student: dataRecord.student,
            score: dataRecord.score,
          };
          console.log({ url: url, headers: headers, body: body });
          updateAssessmentResultRecord(url, headers, body);
          window.location.reload();
        }}
      />
    </div>
  );
}

const columns = [
  { field: "student", headerName: "STUDENT", width: 200, editable: false },
  {
    field: "year_of_study",
    headerName: "YEAR OF STUDY",
    width: 200,
    editable: false,
  },
  { field: "semester", headerName: "SEMESTER", width: 200, editable: false },
  { field: "score", headerName: "SCORE", width: 200, editable: true },
];

function searchArray(idValue, myArray) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i].id === idValue) {
      return { record: myArray[i], index: i };
    }
  }
}
