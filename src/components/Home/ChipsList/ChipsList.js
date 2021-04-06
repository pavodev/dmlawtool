import React from 'react';

// MaterialUI

import { makeStyles, withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import ClearIcon from '@material-ui/icons/Clear';

import './ChipsList.scss';

const useStyles = makeStyles((theme) => ({
  gridList: {
    cursor: 'default',
    flexWrap: 'nowrap',
    overflow: 'hidden',
    overflowX: 'auto',
    maxWidth: '300px',
    height: '50px',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
    backgroundColor: 'white',
    color: 'rgba(49, 51, 49, 0.3)',
    // boxShadow: '0 2px 5px 1px rgba(181, 181, 181, 0.4) !important',
    borderRadius: '10px',
    border: '1px solid rgba(49, 51, 49, 0.3)',
    padding: '5px 0px',
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
}));

/**
 * Chip component with customizable background-color, color and label (passed as props)
 */
class CustomChip extends React.Component {
  render() {
    return (
      <Chip
        key={this.props.item.id}
        className="chip"
        color="primary"
        label={this.props.item.label}
        style={{
          backgroundColor: this.props.item.background_color,
          color: this.props.item.text_color,
        }}
      />
    );
  }
}

const styles = {
  tooltip: {
    marginTop: '5px',
    backgroundColor: 'white',
    border: '1px solid #bdbdbd',
  },
};

/**
 * Apply the styles to the Tooltip component
 */
const CustomTooltip = withStyles(styles)(Tooltip);

/**
 * This component displays an array of objects as a responsive list of chips.
 * The list is generated using the grid layout of the Material UI framework.
 */
export default function ChipsList(props) {
  const classes = useStyles();

  const getGridTiles = (item) => {
    if (item.t_description) {
      return (
        <CustomTooltip
          key={item.id}
          title={
            <p
              style={{
                marginTop: '2px',
                fontSize: '1.3em',
                color: 'black',
              }}
            >
              {item.t_description}
            </p>
          }
          aria-label="add"
        >
          <GridListTile style={{ width: 'auto', marginTop: '2px' }} key={item.id}>
            <CustomChip item={item}></CustomChip>
          </GridListTile>
        </CustomTooltip>
      );
    }
    return (
      <GridListTile style={{ width: 'auto' }} key={item.id}>
        <CustomChip item={item}></CustomChip>
      </GridListTile>
    );
  };

  const renderClearButton = () => {
    if (props.items && props.items.length > 0)
      return (
        <GridListTile style={{ width: 'auto' }}>
          <div
            className="delete-tile delete-tile--button"
            style={{
              cursor: 'pointer',
              color: 'black',
            }}
            onClick={props.clear}
          >
            <ClearIcon />
          </div>
        </GridListTile>
      );
  };

  if (props.items && props.items.length > 0)
    return (
      <div style={{ margin: '0px 20px' }}>
        <GridList className={classes.gridList} cols={2} cellHeight="auto">
          {renderClearButton()}
          {!props.items || !props.items.length ? (
            <GridListTile style={{ width: 'auto' }}>
              <div className="delete-tile">No Tags selected...</div>
            </GridListTile>
          ) : (
            props.items.map((item) => {
              return getGridTiles(item);
            })
          )}
        </GridList>
      </div>
    );

  return null;
}
