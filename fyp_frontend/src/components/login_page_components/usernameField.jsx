import React from "react";
import { TextField } from "@material-ui/core";

function UsernameField({ login_formik }) {
  return (
    <div>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Username"
        name="username"
        // autoFocus
        value={login_formik.formik.values.username}
        onChange={login_formik.formik.handleChange}
        error={
          login_formik.formik.touched.username &&
          Boolean(login_formik.formik.errors.username)
        }
        helperText={
          login_formik.formik.touched.username &&
          login_formik.formik.errors.username
        }
        onBlur={login_formik.formik.handleBlur}
      />
    </div>
  );
}

export default UsernameField;
