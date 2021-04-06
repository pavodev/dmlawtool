import React from 'react';

// MaterialUI
import { Card, Typography } from '@material-ui/core';

/**
 * This component renders a basic message
 */
class MessageBasic extends React.Component {
  render() {
    return (
      <Card className="message__body">
        {this.props.data.message_label ? (
          <Typography gutterBottom variant="h5" component="h2">
            {this.props.data.message_label}
          </Typography>
        ) : null}
        {this.props.data.message ? (
          <div>
            <div dangerouslySetInnerHTML={{ __html: this.props.data.message }}></div>
          </div>
        ) : null}
        <div className="divider"></div>
        {this.props.data.text && this.props.data.message ? (
          <Card className="message__body--darker">
            <div dangerouslySetInnerHTML={{ __html: this.props.data.text }}></div>
          </Card>
        ) : null}
        {this.props.data.text && !this.props.data.message ? (
          <div dangerouslySetInnerHTML={{ __html: this.props.data.text }}></div>
        ) : null}
      </Card>
    );
  }
}

export default MessageBasic;
