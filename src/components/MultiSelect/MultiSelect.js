import React, { useEffect } from 'react';

import chroma from 'chroma-js';

// Material UI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import CloseIcon from '@material-ui/icons/Close';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import { CircularProgress, Typography } from '@material-ui/core';

// React-select
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

// Styles
import { makeStyles } from '@material-ui/core/styles';
import './MultiSelect.scss';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > svg': {
      margin: theme.spacing(2),
    },
  },
  top: {
    color: '#1a90ff',
    animationDuration: '550ms',
    position: 'relative',
    left: 0,
    bottom: 0,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const animatedComponents = makeAnimated();

/**
 * The DialogSelect component renders a form that allows to do a multiple selection from an array of objects passed as prop.
 */
export default function DialogSelect(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [tags, setTags] = React.useState([]);
  const [selectedTags, setSelectedTags] = React.useState(props.selectedTags);

  const handleChange = (event) => {
    setTags(event.target.value);
  };

  const handleClickOpen = () => {
    props.closeDrawer();
    setOpen(true);
  };

  const handleReset = () => {
    setTags([]);
  };

  const handleConfirm = async () => {
    setLoading(true);
    await setTags(tags);
    await props.setTags(tags);
    setLoading(false);
    setOpen(false);
  };

  const handleClose = () => {
    setTags(tags);
    setOpen(false);
  };

  useEffect(() => {
    if (props.clear) {
      setTags([]);
    }
  }, [props.clear]); // This will only run when one of those variables change

  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.background_color);
      const textColor = chroma(data.text_color);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? null
          : isSelected
          ? data.background_color
          : isFocused
          ? color.alpha(0.3).css()
          : null,
        color: 'black',
        cursor: isDisabled ? 'not-allowed' : 'default',

        ':active': {
          ...styles[':active'],
          backgroundColor:
            !isDisabled && (isSelected ? data.background_color : color.alpha(0.3).css()),
          color: textColor.alpha(1).css(),
        },
      };
    },
    multiValue: (styles, { data }) => {
      const color = chroma(data.background_color);
      const textColor = chroma(data.text_color);
      return {
        ...styles,
        borderRadius: '20px',
        backgroundColor: color.alpha(1).css(),
        color: textColor.alpha(1).css(),
      };
    },
    multiValueLabel: (styles, { data }) => {
      const textColor = chroma(data.text_color);
      return {
        ...styles,
        color: textColor.alpha(1).css(),
      };
    },
  };

  const onSelectChange = (selectedOptions) => {
    setTags(selectedOptions);
  };

  const sortByLabel = (a, b) => {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <IconButton
        onClick={handleClickOpen}
        aria-label="delete"
        color="primary"
        className={classes.margin + ' ' + 'filter-button'}
      >
        <FilterListIcon />
      </IconButton>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="xs"
      >
        <DialogTitle>
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h5">
            <LocalOfferIcon style={{ padding: '0' }} /> Filter by <strong>Tag</strong>
          </Typography>
          <Typography style={{ paddingTop: '20px', paddingBottom: '20px' }}>
            A <strong>Tag</strong> represents a particular topic or word that describes a given Node
            of the DMLawTool tree.
            <br />
            By selecting a tag you can filter nodes that share the same topic or definition.
          </Typography>
        </DialogContent>
        <Divider />
        <div>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>
              <Select
                isDisabled={loading ? true : false}
                styles={colourStyles}
                maxMenuHeight={170}
                closeMenuOnSelect={true}
                components={animatedComponents}
                onChange={onSelectChange}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.label}
                isMulti
                options={props.options.sort(sortByLabel)}
                value={tags}
                placeholder="Select the tags..."
              />
            </FormControl>
          </form>
        </div>
        <Divider />
        <DialogActions>
          {loading ? <CircularProgress className={classes.top} size={20} /> : null}
          <Button onClick={handleReset} disabled={loading ? true : false} color="primary">
            Reset
          </Button>
          <Button onClick={handleConfirm} disabled={loading ? true : false} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
