import { useSelector } from "react-redux";

function HomeTab() {
  console.log("we are home");

  const lectureDetails = useSelector((state) => {
    const stateVariable = state.lecturer;
    return {
      user_name: stateVariable.user_name,
      lecturer_name: stateVariable.lecturer_name,
      courses_teaching: stateVariable.courses_teaching,
      course_count: stateVariable.course_count,
      position: stateVariable.position,
    };
  });

  return (
    <div
      style={{ width: "85%", height: "100%", backgroundColor: "whitesmoke" }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "flex-start",
        }}
      >
        <div style={homeStyles.spacer} />
        {/* welcome message */}
        <div style={homeStyles.tabSection}>
          <span style={homeStyles.span}>Home</span>
          <p style={{ fontWeight: "600" }}>
            Welcome{" "}
            <span style={homeStyles.span}>{lectureDetails.lecturer_name}</span>{" "}
            to the all new Student Continuous Assessment and Marks Tallying
            Information System <span style={homeStyles.span}>(SCAMTIS)</span>.
            Please follow the following guide on how to use this website.
          </p>
        </div>
        {/* criteria */}
        <div style={homeStyles.tabSection}>
          <span style={homeStyles.span}>Criteria</span>
          <p style={{ fontWeight: "600" }}>
            This is where you can decide how to evaluate your students
            performances and results. Forinstance in a particular course, a
            lecturer may decide to assess the performances of his or her
            students through 3 categories
            <span style={homeStyles.span}>(test 1, test 2 and quizz)</span>.
            These categories are selected by the lecturer and the appropriate
            weights for each criteria is determined and can be updtaed at any
            time.
          </p>
        </div>
        {/* score tallying */}
        <div style={homeStyles.tabSection}>
          <span style={homeStyles.span}>Score Tallying</span>
          <p style={{ fontWeight: "600" }}>
            This is where the student scores are inserted and updated as
            required. One may even be able to download the scores table as an
            excel if needed in some way.
          </p>
        </div>
        {/* reports */}
        <div style={homeStyles.tabSection}>
          <span style={homeStyles.span}>Reports</span>
          <p style={{ fontWeight: "600" }}>
            This is where all the crucial reports namely,{" "}
            <span style={{ fontWeight: "800" }}>Black Sheet and Red Sheet</span>{" "}
            are downloaded.
          </p>
        </div>
        <div style={homeStyles.spacer} />
      </div>
    </div>
  );
}

export default HomeTab;

const homeStyles = {
  tabSection: {
    width: "100%",
    height: "150px",
    backgroundColor: "white",
    padding: "10px 20px",
    borderRadius: "10px",
    boxShadow:
      "10px 10px 20px rgba(255,255,255,0.2), 10px 10px 20px rgba(20,10,0,0.2)",
    margin: "10px 0",
  },
  span: { fontWeight: "800", color: "grey" },
  spacer: { height: "48px" },
};
