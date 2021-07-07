import React from "react";
import { Button } from "@material-ui/core";

export function UpdateButton({ onClick }) {
  return (
    <Button
      variant="contained"
      color="primary"
      style={{ textTransform: "none" }}
      onClick={onClick}
    >
      Update
    </Button>
  );
}
