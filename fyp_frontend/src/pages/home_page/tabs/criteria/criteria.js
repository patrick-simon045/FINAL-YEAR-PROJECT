import React, { useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import { useTheme } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import axios from "axios";

import { useStyles } from "../../../../styles/material_styles";
import { DatePickerWidget } from "../../../../components/home_page_components/criteria_tab_components/datepicker";
import { QuestionsField } from "../../../../components/home_page_components/criteria_tab_components/questionsfield";
import { Ca_WeightField as CaWeightField } from "../../../../components/home_page_components/criteria_tab_components/ca_weightfield";
import { CriteriaSelect } from "../../../../components/home_page_components/criteria_tab_components/criteria_select";
import { UpdateButton } from "../../../../components/home_page_components/criteria_tab_components/updatebutton";
import { RemoveButton } from "../../../../components/home_page_components/criteria_tab_components/removebutton";
import { AddCriteriaButton } from "../../../../components/home_page_components/criteria_tab_components/addCriteriaButton";
import { headers, urls } from "../../../../global";
import { getAssessmentDetails } from "../../../../state/reduxStateSlices/assessment_detailsSlice";
import { useEffect } from "react";

function CriteriaTab() {
  const classes = useStyles();

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    console.log(newValue);
    setValue(newValue);
  };

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

  return (
    <>
      <div style={{ height: "48px" }} />
      <AddCriteriaButton />
      <div>
        <Paper
          className={classes.criteriatabcontainer}
          elevation={0}
          square={false}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
            style={{ backgroundColor: "whitesmoke" }}
          >
            {course_list().map((course, index) => {
              return <Tab key={index} label={course} />;
            })}
          </Tabs>

          <div
            style={{
              height: "65vh",
              backgroundColor: "whitesmoke",
              padding: "1%",
            }}
          >
            {coursesList.length === 0 ? (
              <h1>nothing to show</h1>
            ) : (
              <AssessmentsComponent
                courses={coursesList}
                course_assessmentList={course_assessmentList}
                value={value}
              />
            )}
          </div>
        </Paper>
      </div>
    </>
  );
}

export default CriteriaTab;

function AssessmentsComponent({ courses, course_assessmentList, value }) {
  let criteria_select_ref = React.createRef();

  const token = useSelector((state) => state.token.tokenString);
  console.log("token from redux: " + token);

  const dispatch = useDispatch();

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  };

  useEffect(() => {
    dispatch(
      getAssessmentDetails({
        url: urls.assessmentDetails,
        header: config,
      })
    );
  }, []);

  const [ca_items, setCa_items] = React.useState([]);

  useEffect(() => {
    axios
      .get(urls.assessmentCriteria, headers.headersWithToken)
      .then((response) => {
        console.log(response.data);
        const data = response.data.map((criteria) => {
          return criteria.ca_item_name;
        });
        setCa_items(data);
      })
      .catch((error) => console.log("an error has occurred"));
  }, []);

  return (
    <>
      {courses.map((course, index) => {
        console.log(index);
        return course_assessmentList[index].length !== 0 ? (
          course_assessmentList[index].map((assessment, assessment_index) => {
            console.log(index);
            console.log(course_assessmentList[index]);
            return (
              <div hidden={value !== index}>
                <div style={componentStyles.assessmentCard}>
                  <CriteriaSelect
                    criteria={assessment.criteria}
                    disabled={true}
                    ca_items={ca_items}
                  />
                  <QuestionsField
                    number_of_questions={assessment.number_of_questions}
                    disabled={true}
                  />
                  <CaWeightField
                    contribution={assessment.contribution}
                    disabled={true}
                  />
                  <DatePickerWidget
                    date_taken={assessment.date_taken}
                    disabled={true}
                  />
                  <RemoveButton
                    onClick={async () => {
                      console.log({
                        primaryKey: assessment.id,
                        selectedCriteria: assessment.criteria,
                        questions: assessment.number_of_questions,
                        weight: assessment.contribution,
                        date: assessment.date_taken,
                      });
                      deleteAssessment(assessment, config);
                      await dispatch(
                        getAssessmentDetails({
                          url: urls.assessmentDetails,
                          header: config,
                        })
                      );
                      window.location.reload();
                    }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <h2>There is nothing to show</h2>
        );
      })}
    </>
  );
}

function deleteAssessment(assessment, config) {
  fetch(urls.assessmentDelete + assessment.id, {
    method: "DELETE",
    headers: config.headers,
  })
    .then((response) => response.json())
    .then((json_response) => console.log(json_response))
    .catch((error) => {
      console.log("an error has occurred");
      console.log("the error is: " + error);
    });
}

const componentStyles = {
  assessmentCard: {
    margin: "20px 0",
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "white",
    padding: "20px 10px",
    borderRadius: "10px",
    boxShadow:
      "10px 10px 20px rgba(255, 255, 255, 0.5), 10px 10px 20px rgba(20, 10, 0, 0.2)",
  },
};
