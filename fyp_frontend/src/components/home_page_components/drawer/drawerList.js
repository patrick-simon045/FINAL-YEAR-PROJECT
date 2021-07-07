import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import FormatListBulletedRoundedIcon from "@material-ui/icons/FormatListBulletedRounded";
import CreateRoundedIcon from "@material-ui/icons/CreateRounded";
import AssessmentRoundedIcon from "@material-ui/icons/AssessmentRounded";

export const drawerList = [
  {
    name: "Home",
    icon: <HomeRoundedIcon style={{ color: "#202020" }} />,
    route: "/home",
  },
  {
    name: "Criteria",
    icon: <FormatListBulletedRoundedIcon style={{ color: "#202020" }} />,
    route: "/home/criteriatab",
  },
  {
    name: "Score Tallying",
    icon: <CreateRoundedIcon style={{ color: "#202020" }} />,
    route: "/home/scorestab",
  },
  {
    name: "Reports",
    icon: <AssessmentRoundedIcon style={{ color: "#202020" }} />,
    route: "/home/reportstab",
  },
];
