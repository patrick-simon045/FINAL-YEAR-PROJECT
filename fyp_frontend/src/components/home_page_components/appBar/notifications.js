import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";

export default function NotificationIcon() {
  return (
    <IconButton aria-label="show 17 new notifications" color="inherit">
      <Badge badgeContent={17} color="secondary">
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
}
