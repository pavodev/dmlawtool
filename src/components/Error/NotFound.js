import React from 'react';

import { Button, Typography } from '@material-ui/core';

import './NotFound.scss';

/*
 * Simple component for the 404 error page
 */
class NotFound extends React.Component {
  render() {
    return (
      <div className="notfound">
        <div className="notfound__container">
          <Typography className="notfound__title" variant="h2">
            404 - Not found
          </Typography>
          <Typography className="notfound__body ">
            The requested page does not exist. Click on the button below to return to the homepage.
          </Typography>
          <Button className="notfound__button" href="/">
            Homepage
          </Button>
        </div>
      </div>
    );
  }
}

export default NotFound;
