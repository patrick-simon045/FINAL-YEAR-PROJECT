import React from "react";
import { Button } from "@material-ui/core";

export function RemoveButton({ onClick }) {
  return (
    <Button
      variant="contained"
      color="secondary"
      style={{ textTransform: "none" }}
      onClick={onClick}
    >
      Remove
    </Button>
  );
}
