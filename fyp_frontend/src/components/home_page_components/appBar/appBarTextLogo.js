import React from "react";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";

export default function AppBarTextLogo() {
  const history = useHistory();

  const handleLogoClick = () => {
    console.log("logo clicked");
    history.push("/home");
  };

  return (
    <Button color="inherit" onClick={handleLogoClick}>
      <Typography variant="h6" noWrap style={{ fontWeight: "600" }}>
        SCA<span style={{ fontWeight: "100" }}>MTIS</span>
      </Typography>
    </Button>
  );
}
