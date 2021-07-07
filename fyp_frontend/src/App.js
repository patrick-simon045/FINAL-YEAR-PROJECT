import Login from "./pages/login_page/login";
import "./styles/App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/home_page/home";

function returnLogin() {
  return (
    <div className="login_container">
      <Login />
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/" component={returnLogin} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
