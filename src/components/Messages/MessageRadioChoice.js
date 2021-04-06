import React from 'react';

// MaterialUI
import {
  Card,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@material-ui/core';

/**
 * This component renders a message with a radio selector.
 */
class MessageRadioChoice extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      choices: [],
    };
  }

  componentDidMount() {
    this.setState({
      choices: this.props.choices,
    });
  }

  render() {
    return (
      <Card className="message__body">
        <FormControl component="fieldset">
          <FormLabel component="legend">Chose one:</FormLabel>
          <RadioGroup aria-label="Choice" name="Choice" onChange={this.onRadioChange}>
            {this.state.choices.map((choice) => {
              return (
                <FormControlLabel
                  key={choice.label}
                  value={choice.label}
                  control={<Radio />}
                  label={choice.label}
                />
              );
            })}
          </RadioGroup>
        </FormControl>
      </Card>
    );
  }
}

export default MessageRadioChoice;
