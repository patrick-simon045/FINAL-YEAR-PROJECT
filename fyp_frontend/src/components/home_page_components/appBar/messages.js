import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import MailIcon from "@material-ui/icons/Mail";

export default function MessageIcon() {
  return (
    <IconButton aria-label="show 4 new mails" color="inherit">
      <Badge badgeContent={4} color="secondary">
        <MailIcon />
      </Badge>
    </IconButton>
  );
}
