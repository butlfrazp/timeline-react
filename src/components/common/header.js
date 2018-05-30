import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


const Header = props => {
  const {
    header,
    headerTitle,
    modalButton
  } = styles;
  const {
    onNewStudentClicked,
    self
  } = props;
  return (
    <AppBar
      style={header}
      position="relative"
    >
      <Toolbar>
        <Typography variant="title" style={headerTitle}>
          Timeline
        </Typography>
        <Typography style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <h2 style={{fontFamily: "Avenir Next"}}>Student ID: {props.id}</h2>
        </Typography>
        <div style={{flex: 1, textAlign: "right"}}>
        <Button
          onClick={() => onNewStudentClicked(self)}
          style={modalButton}
        >
          Choose Student!
        </Button>
        </div>
      </Toolbar>
    </AppBar>
  )
}

const styles =  {
  header: {
    background: 'white',
    flexGrow: 1
  },
  headerTitle: {
    flex: 1,
    textAlign: "left",
    fontFamily: "Avenir Next",
    fontSize: "36px"
  },
  modalButton: {
    fontFamily: "Avenir Next",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#4a4a4a",
    borderRadius: 10
  }
}

export {Header};
