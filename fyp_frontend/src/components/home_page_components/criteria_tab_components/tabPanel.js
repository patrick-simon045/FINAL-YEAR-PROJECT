import React from "react";
import { useStyles } from "../../../styles/material_styles";

export function TabPanelComponent(props) {
  const classes = useStyles();
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`centered-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
      style={{ boxShadow: "none" }}
    >
      {value === index && (
        <div className={classes.tabpanelcontainer}>
          <div className={classes.tabpanelcontentscontainer}>{children}</div>
        </div>
      )}
    </div>
  );
}
