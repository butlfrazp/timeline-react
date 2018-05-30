import React from 'react';
import Radio from '@material-ui/core/Radio';
import Grid from '@material-ui/core/Grid';

const RadioContainer = props => {
  const {
    id,
    pickedId,
    onChange,
    self
  } = props

  return (
    <Grid item xs={4}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', border: "1px solid #a4a4a4"}}>
        <h3 style={{fontFamily: "Avenir Next"}}>{String(id)}</h3>
        <Radio
          onChange={event => onChange(event, self)}
          checked={pickedId === String(id)}
          value={String(id)}
          name={String(id)}
          key={id}
        />
      </div>
    </Grid>
  )
}

export { RadioContainer };
