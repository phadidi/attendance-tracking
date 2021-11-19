import { useState, React } from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';
import { useHistory, withRouter } from 'react-router-dom';

function TeacherPortal() {
  const btstyle = { margin: '8px 0' };
  const history = useHistory();

  const onLogout = async () => {
    history.push('/');
  };

  const handleLogout = async () => {
    await onLogout();
  };
  return (
    <div>
      <h2>Teacher</h2>
      <Button
        type="submit"
        color="primary"
        variant="contained"
        style={btstyle}
        onClick={() => {
          handleLogout();
        }}
      >
        Logout
      </Button>
    </div>
  );
}

export default withRouter(TeacherPortal);
