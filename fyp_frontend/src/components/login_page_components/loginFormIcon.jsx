import React from "react";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { useStyles } from "../../styles/material_styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import "../../styles/App.css";

function LoginFormIcon() {
  const classes = useStyles();

  return (
    <div className="login_form_icon">
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Login
      </Typography>
    </div>
  );
}

export default LoginFormIcon;
