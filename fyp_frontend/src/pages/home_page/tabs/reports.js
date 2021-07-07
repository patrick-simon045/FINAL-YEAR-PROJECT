import React, { useState, useEffect } from "react";

import Button from "@material-ui/core/Button";
import { useSelector } from "react-redux";

import { ca_Styles } from "../../../components/home_page_components/reports_tab_component/styles";
import {
  download_report,
  get_ca_report,
} from "../../../adapters/home_adapters/reports_tab_adapters";
import { CATable } from "../../../components/home_page_components/reports_tab_component/ca_table";

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
    setRows(rows_from_data);
  }, [data]);

  return (
    <div style={ca_Styles.courseContainer}>
      {/* <h5>Reports</h5> */}
      {coursesList.map((course, index) => {
        let list = rows.filter((row_item) => row_item.course === course);
        return (
          <div>
            <h1 style={ca_Styles.courseText}>{course}</h1>
            <CATable data={list} course={course} />
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
