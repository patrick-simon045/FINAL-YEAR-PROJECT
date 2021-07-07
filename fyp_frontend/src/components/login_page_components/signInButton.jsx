import React from "react";
import { Button } from "@material-ui/core";
import { useStyles } from "../../styles/material_styles";
import "../../styles/App.css";

function SignInButton() {
  const classes = useStyles();

  return (
    <div className="login_button">
      <Button
        style={{ fontWeight: "600" }}
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Login
      </Button>
    </div>
  );
}

export default SignInButton;
