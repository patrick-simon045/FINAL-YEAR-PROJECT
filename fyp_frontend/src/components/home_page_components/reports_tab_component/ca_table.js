import MaterialTable from "material-table";
import { useState } from "react";
import { ca_Styles } from "./styles";
import { tableIcons } from "./tableicons";

export function CATable({ data, course }) {
  const [columns, setColumns] = useState(CA_TABLE_COLUMNS);
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

const CA_TABLE_COLUMNS = [
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
];
