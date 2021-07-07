import React, { useState, useEffect } from "react";

import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { useSelector } from "react-redux";

import { urls } from "../../../global";
import { useStyles } from "../../../styles/material_styles";

import MaterialTable from "material-table";
import { forwardRef } from "react";

import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

function ScoresTab() {
  const classes = useStyles();

  const assessments = useSelector((state) => state.assessments.assessments);
  const courses = useSelector((state) => state.lecturer.courses_teaching);

  const course_list = function () {
    const list = courses.map((course_item) => course_item.course_code);
    return list;
  };
  const coursesList = course_list();

  const assessmentList = function () {
    const list = course_list();
    let course_assessments = [];
    list.forEach((list) => {
      let list_holder = assessments.map((item) => {
        if (item.course === list) {
          return item;
        }
      });
      course_assessments.push(list_holder.filter(Boolean));
    });
    return course_assessments;
  };
  const course_assessmentList = assessmentList();

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    console.log(newValue);
    setValue(newValue);
  };

  const token = useSelector((state) => state.token.tokenString);
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  };

  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getAssessmentResults(
      urls.getAssessmentResults,
      config.headers,
      setData,
      coursesList,
      course_assessmentList
    );
  }, []);

  useEffect(() => {
    const rowsData = data.map((data) => {
      const rowData = data.map((datum) => {
        const row = datum.map((singleDataRow) => {
          let row_details = {
            id: singleDataRow.id,
            student: singleDataRow.student,
            year_of_study: singleDataRow.year_of_study,
            semester: singleDataRow.semester,
            score: singleDataRow.score,
          };
          return row_details;
        });
        return row;
      });
      return rowData;
    });
    setRows(rowsData);
    console.log(data);
    console.log(coursesList);
  }, [data]);

  return (
    <div style={scoresStyles.mainContainer}>
      <div style={scoresStyles.dataGridContainer}>
        <div style={{ height: "48px", backgroundColor: "whitesmoke" }} />
        <React.StrictMode>
          <Paper
            className={classes.criteriatabcontainer}
            elevation={0}
            square={false}
          >
            {/* <h5 style={{ padding: "20px" }}>Score Tallying</h5> */}
            {coursesList.length === 0 ? (
              <h1>There are no courses assigned to you 😢</h1>
            ) : (
              <div>
                {coursesList.map((course, index) => {
                  console.log(data);
                  console.log(rows);
                  return (
                    <div style={scoresStyles.courseContainer}>
                      <h1>{course}</h1>
                      <TableData rows={rows[index]} data={data[index]} />
                    </div>
                  );
                })}
              </div>
            )}
          </Paper>
        </React.StrictMode>
        <div style={{ height: "48px", backgroundColor: "whitesmoke" }} />
      </div>
      <div style={{ height: "48px", backgroundColor: "whitesmoke" }} />
    </div>
  );
}

export default ScoresTab;

function TableData({ rows, data }) {
  return rows
    ? rows.map((row, index) => {
        console.log(row);
        const criteria = data[index][0].assessment.criteria;
        const postData = {
          assessment: data[index][0].assessment,
          course_type: data[index][0].course_type,
          academic_year: data[index][0].academic_year,
        };
        return (
          <div>
            <h4 style={scoresStyles.criteriaText}>{criteria}</h4>
            <StudentScores row={row} postData={postData} />
          </div>
        );
      })
    : "";
}

function StudentScores({ row, postData }) {
  const url = urls.updateAssessmentResult;
  const token = useSelector((state) => state.token.tokenString);
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  };

  const [columns, setColumns] = useState([
    { title: "Student", field: "student", editable: "never" },
    {
      title: "Year of Study",
      field: "year_of_study",
      type: "numeric",
      editable: "never",
    },
    {
      title: "Semester",
      field: "semester",
      type: "numeric",
      editable: "never",
    },
    { title: "Score", field: "score", type: "numeric" },
  ]);

  return (
    <MaterialTable
      style={scoresStyles.materialTable}
      icons={tableIcons}
      title={`Student Results for ${postData.assessment.course} ${postData.assessment.criteria}`}
      columns={columns}
      data={row}
      editable={{
        onBulkUpdate: (changes) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              Object.values(changes).forEach(async (change) => {
                const body = {
                  id: change.newData.id,
                  assessment: postData.assessment,
                  semester: change.newData.semester,
                  course_type: postData.course_type,
                  year_of_study: change.newData.year_of_study,
                  academic_year: postData.academic_year,
                  student: change.newData.student,
                  score: change.newData.score,
                };
                console.log(body);

                await fetch(url + change.newData.id, {
                  method: "PUT",
                  headers: config.headers,
                  body: JSON.stringify(body),
                })
                  .then((response) => response.json())
                  .then((json_response) => console.log(json_response))
                  .catch((error) => {
                    console.log("an error has occurred");
                    console.log("the error is: " + error);
                  });
              });
              resolve();
              window.location.reload();
            }, 1000);
          }),
      }}
      options={{
        exportButton: true,
      }}
    />
  );
}

function getAssessmentResults(
  url,
  headers,
  setData,
  coursesList,
  course_assessmentList
) {
  const courses = coursesList;
  const course_assessments = course_assessmentList;
  fetch(url, {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .then((json_response) => {
      console.log(course_assessments);
      const sortedData = () => {
        let sortedList = courses.map((course, index) => {
          return course_assessments[index].map(
            (assessment, assessmentIndex) => {
              return json_response.filter(
                (record) =>
                  record.assessment.course === assessment.course &&
                  record.assessment.criteria === assessment.criteria
              );
            }
          );
        });
        return sortedList;
      };
      console.log(sortedData());
      setData(sortedData());
    })
    .catch((error) => {
      console.log("an error has occurred");
      console.log("the error is: " + error);
    });
}

function searchArray(idValue, myArray) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i].id === idValue) {
      return { record: myArray[i], index: i };
    }
  }
}

const scoresStyles = {
  materialTable: {
    padding: "10px 20px",
    borderRadius: "20px",
    margin: "10px 0",
    fontWeight: "600",
    boxShadow:
      "10px 10px 20px rgba(255,255,255,0.2), 10px 10px 20px rgba(20,10,0,0.2)",
  },
  courseContainer: {
    backgroundColor: "white",
    padding: "1%",
    margin: "20px 0",
    borderRadius: "20px",
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  dataGridContainer: {
    width: "100%",
    borderRadius: "10px",
    backgroundColor: "whitesmoke",
  },
  criteriaText: {
    marginTop: "50px",
    color: "grey",
  },
};
