import React from 'react';

import { CardContent, Card, Checkbox } from '@material-ui/core';

/**
 * This component renders a message with two checkboxes
 */
class MessageCheckboxChoice extends React.Component {
  render() {
    return (
      <Card className="message__body">
        <CardContent>
          <Checkbox
            defaultChecked
            color="primary"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
          <Checkbox color="secondary" inputProps={{ 'aria-label': 'secondary checkbox' }} />
          <Checkbox
            defaultChecked
            color="primary"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </CardContent>
      </Card>
    );
  }
}

export default MessageCheckboxChoice;
