import React from "react";
import ReactDOM from "react-dom";
import { Router, RouteComponentProps } from "@reach/router";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import "index.css";
import App from "App";
import reportWebVitals from "./reportWebVitals";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 520,
      md: 750,
      lg: 1200,
      xl: 1450,
    },
  },
});

interface ShareProps extends RouteComponentProps {
  shareHash?: string;
}

const Home = (props: RouteComponentProps) => <App />;
const Share = (props: ShareProps) => <App urlShareHash={props.shareHash} />;

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <Router>
        <Home path="/" />
        <Share path="share/:shareHash" />
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
