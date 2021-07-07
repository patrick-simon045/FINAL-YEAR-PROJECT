import React, { useState, useEffect } from "react";

import Button from "@material-ui/core/Button";
import { useSelector } from "react-redux";
import { urls } from "../../../global";

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
import axios from "axios";

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

function ReportsTab() {
  const token = useSelector((state) => state.token.tokenString);

  const courses = useSelector((state) => state.lecturer.courses_teaching);
  const course_list = function () {
    const list = courses.map((course_item) => course_item.course_code);
    return list;
  };
  const coursesList = course_list();

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  };

  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    get_ca_report(config, setData);
  }, []);
  console.log(data);

  useEffect(() => {
    const rows_from_data = data.map((datum) => {
      return {
        student: datum.student,
        course: datum.course,
        year_of_study: datum.year_of_study,
        semester: datum.semester,
        academic_year: datum.academic_year,
        ca: datum.ca,
      };
    });
    console.log(data);
    console.log(rows_from_data);
    setRows(rows_from_data);
  }, [data]);

  return (
    <div style={ca_Styles.courseContainer}>
      {/* <h5>Reports</h5> */}
      {coursesList.map((course, index) => {
        let list = rows.filter((row_item) => row_item.course === course);
        // console.log(list[0].academic_year);
        return (
          <div>
            <h1 style={ca_Styles.courseText}>{course}</h1>
            <CATable
              data={list}
              course={course}
              // academic_year={academic_year}
            />
            <div style={ca_Styles.buttonStyle}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  console.log(list);
                  const body = {
                    rows: list,
                  };
                  download_report(config, body, course);
                }}
              >
                Get {course} CA report
              </Button>
            </div>
          </div>
        );
      })}
      <div style={{ height: "20px" }} />
    </div>
  );
}

export default ReportsTab;

function CATable({ data, course }) {
  const [columns, setColumns] = useState([
    { title: "Student", field: "student", editable: "never" },
    { title: "Course", field: "course", editable: "never" },
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
    { title: "Academic Year", field: "academic_year", editable: "never" },
    { title: "CA", field: "ca", type: "numeric", editable: "never" },
  ]);
  return (
    <MaterialTable
      style={ca_Styles.materialTable}
      icons={tableIcons}
      title={`Student ${course} CA Results`}
      columns={columns}
      data={data}
      options={{
        exportButton: true,
      }}
    />
  );
}

function get_ca_report(config, setData) {
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

function download_report(config, body, course) {
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

const ca_Styles = {
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
    width: "85%",
  },
  courseText: {
    marginTop: "50px",
    color: "grey",
  },
  buttonStyle: {
    marginTop: "50px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
};
