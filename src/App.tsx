import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

// Wrap the app into this component so that our custom styles are injected last
import { StylesProvider } from '@material-ui/styles';

// import { Counter } from './features/counter/Counter';
import Home from './components/Home/Home.js';

// Assets
import logo from './images/logo.png';

// Styles
import './App.scss';
import 'semantic-ui-css/semantic.min.css';
import NotFound from './components/Error/NotFound.js';
import About from './components/About/About.js';
import { Box, Button } from '@material-ui/core';
import Disclaimer from './components/Disclaimer/Disclaimer.js';

const useStyles = makeStyles((theme) => ({
  typography: {
    fontFamily: [''].join(','),
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontWeight: 600,
    fontFamily: 'Ropa Sans',
  },
}));

// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.

function App() {
  const classes = useStyles();

  return (
    <Router>
      <StylesProvider injectFirst>
        <AppBar className="app-bar" position="static">
          <Toolbar>
            {/* <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <img className="app-bar__logo" src={logo} alt="logo"></img>
            </IconButton> */}
            <Typography variant="h4" className={classes.title}>
              <Link className="header__title" to="/">
                DMLawTool
              </Link>
            </Typography>
            <Link to="/about" target="_blank">
              <Button className="app-bar__item">About us</Button>
            </Link>
            <Link to="/disclaimer" target="_blank">
              <Button className="app-bar__item">Disclaimer</Button>
            </Link>
          </Toolbar>
        </AppBar>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/about">
            <About />
          </Route>
          <Route exact path="/disclaimer">
            <Disclaimer />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </StylesProvider>
    </Router>
  );
}

export default App;
