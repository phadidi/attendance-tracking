import { useState, React } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Avatar, Button, Grid, Paper, TextField } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
// import StudentPortal from './studentPortal';
// import TeacherPortal from './teacherPortal';
import axios from 'axios';
import { useAlert } from 'react-alert';

function Login() {
  const initialData = { Username: '', Password: '', userRole: '', userId: -1 };
  const [data, setData] = useState(initialData);
  let history = useHistory();
  const alert = useAlert();

  const paperStyle = {
    padding: 20,
    height: '70vh',
    width: 280,
    margin: '20px auto'
  };
  const avatarStyle = { backgroundColor: '#029b19' };
  const btstyle = { margin: '8px 0' };

  const handleTextFieldChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const onLogin = async () => {
    const userName = data.Username;
    const password = data.Password;

    const result = await axios.post(
      `https://ku42k1lhrd.execute-api.us-west-2.amazonaws.com/dev/login`,
      {
        userName,
        password
      }
    );
    console.log(result);
    if (result.status === 200) {
      const pageData = {
        firstName: result.data[0].firstName,
        lastName: result.data[0].lastName,
        userRole: result.data[0].userRole,
        userId: result.data[0].userId
      };
      // setData({
      //   ...data,
      //   userRole: pageData.userRole,
      //   userId: pageData.userId
      // });
      // console.log(data);
      if (pageData.userRole === 'student') {
        history.push({ pathname: '/student', state: pageData });
      } else if (pageData.userRole === 'teacher') {
        history.push('/teacher');
      }
    } else {
      console.log(result);
      alert.show(result.body);
    }
  };

  const handleLogin = async () => {
    await onLogin();
  };

  /*const onRedirect = async () => {
    console.log(data);
    if (data.userRole === 'student') {
      history.push('/student');
    } else if (data.userRole === 'teacher') {
      history.push('/teacher');
    } else {
      history.push('/');
    }
  };

  const handleRedirect = async () => {
    await onRedirect();
  };*/

  return (
    <Grid align="center">
      <Paper elevation={10} style={paperStyle}>
        <Avatar style={avatarStyle}>
          <LockOutlinedIcon />
        </Avatar>
        <h2>Sign in to your account</h2>
        <TextField
          value={data.Username}
          name="Username"
          label="Username"
          placeholder="Enter your username"
          fullWidth
          required
          onChange={handleTextFieldChange}
        />
        <TextField
          value={data.Password}
          name="Password"
          label="Password"
          placeholder="Enter your password"
          fullWidth
          required
          type="password"
          onChange={handleTextFieldChange}
        />
        <br />
        <br />
        <Button
          type="submit"
          color="primary"
          variant="contained"
          style={btstyle}
          onClick={() => {
            handleLogin();
          }}
        >
          Login
        </Button>
      </Paper>
    </Grid>
  );
}

export default withRouter(Login);
