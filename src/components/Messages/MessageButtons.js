import React from 'react';

// MaterialUI
import { Card } from '@material-ui/core';

// Styles
import './MessageButtons.scss';

/**
 * This component renders a message with two buttons clickable by the users.
 * The buttons must be passed as props. The click handlers must be defined outside this component.
 */
class MessageButtons extends React.Component {
  render() {
    return (
      <Card className="message__body message__body--buttons">
        <div className="message__buttons--container">
          {this.props.buttonA}
          {this.props.buttonB}
        </div>
      </Card>
    );
  }
}

export default MessageButtons;
