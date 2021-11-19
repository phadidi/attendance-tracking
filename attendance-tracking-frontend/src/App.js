import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './components/login';
import StudentPortal from './components/studentPortal';
import TeacherPortal from './components/teacherPortal';

/*<div>
  <h1 align="center">Login</h1>
  <div className="container"></div>
</div>*/
function App() {
  //TODO: figure out which page needs the redirect switches
  return (
    <Router>
      <div>
        <h1 align="center">Attendance Tracking</h1>
        <div className="container">
          <Route exact path="/" component={Login} />
          <Route exact path="/student" component={StudentPortal} />
          <Route exact path="/teacher" component={TeacherPortal} />
        </div>
      </div>
    </Router>
  );
}

export default App;
