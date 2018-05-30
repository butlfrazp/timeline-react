import React from 'react';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

import {
  RadioContainer
} from './index';

const TimelineModal = props => {
  const {
    ids,
    open,
    self,
    onBackdropClick,
    onRadioCheck,
    onButtonClick,
    pickedId,
    value
  } = props;
  const renderRadioButtons = () => {
    var jsxArr = [];
    var i = 0;
    for (let id of ids) {
      const jsx = (
        <RadioContainer
          onChange={onRadioCheck}
          pickedId={value}
          id={id}
          self={self}
        />
      )
      jsxArr.push(jsx);
      i++;
    }
    return jsxArr;
  }

  const {
    modal
  } = styles;
  return (
    <Modal
      open={open}
      onBackdropClick={() => onBackdropClick(self)}
    >
      <div style={modal}>
        <div>
          <h2 style={{textAlign: 'center', fontFamily: 'Avenir Next'}}>Choose a New Student By ID:</h2>
        </div>
        <Grid
          container
          spacing={16}
          style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}
        >
            {renderRadioButtons()}
        </Grid>
        <div style={{margin: "25px", textAlign: 'center'}}>
          <Button
            onClick={() => onButtonClick(self)}
            variant="raised"
            className="primary"
            style={{fontSize: "18px", fontFamily: "Avenir Next"}}
          >
            Change Student
          </Button>
        </div>
      </div>
    </Modal>
  )
}


const styles = {
  modal: {
    margin: "auto",
    postition: "absolute",
    backgroundColor: "white",
    padding: "20px",
  }
}

export {TimelineModal};
