import React from "react";
import { TextField } from "@material-ui/core";

function PasswordField({ login_formik }) {
  return (
    <div>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        value={login_formik.formik.values.password}
        onChange={login_formik.formik.handleChange}
        error={
          login_formik.formik.touched.password &&
          Boolean(login_formik.formik.errors.password)
        }
        helperText={
          login_formik.formik.touched.password &&
          login_formik.formik.errors.password
        }
        onBlur={login_formik.formik.handleBlur}
      />
    </div>
  );
}

export default PasswordField;
