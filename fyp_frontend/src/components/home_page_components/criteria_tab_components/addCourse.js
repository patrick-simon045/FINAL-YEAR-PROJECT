import React, { useEffect } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import { headers, urls } from "../../../global";
import { useSelector } from "react-redux";

export function AddCourse({ selectedCourse, setSelectedCourse }) {
  const courses = useSelector((state) => state.lecturer.courses_teaching);

  const course_list = function () {
    const list = courses.map((course_item) => course_item.course_code);
    return list;
  };

  const handleSelectChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  return (
    <FormControl variant="outlined" style={{ width: "150px" }}>
      <InputLabel
        id="demo-simple-select-outlined-label"
        style={{ backgroundColor: "white", padding: "0 10px" }}
      >
        Course
      </InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={selectedCourse}
        onChange={handleSelectChange}
      >
        {course_list().map((course, index) => {
          return (
            <MenuItem key={index} value={course}>
              {course}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
