import React, { useState, useEffect } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import axios from 'axios';
import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';

// Material Table and its icons
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { forwardRef } from 'react';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const columns = [
  { title: 'Class ID', field: 'classId', editable: false, hidden: true },
  { title: 'Section ID', field: 'sectionId', editable: false, hidden: true },
  { title: 'Class Name', field: 'className', editable: false, hidden: false },
  {
    title: 'Section Name',
    field: 'sectionName',
    editable: false,
    hidden: false
  },
  {
    title: 'Attendance Percentage',
    field: 'attendancePercentage',
    editable: false,
    hidden: false
  },
  {
    title: 'Attending Today',
    field: 'hasAttendedToday',
    editable: (row, rowData) => rowData && rowData.hasAttendedToday === false,
    editComponent: (props) => {
      console.log(props);
      return (
        <input
          type="checkbox"
          checked={props.value}
          onChange={(e) => props.onChange(e.target.checked)}
        />
      );
    },
    render: (rowdata) => (
      <input type="checkbox" checked={rowdata.hasAttendedToday} />
    )
  }
];

function StudentPortal() {
  const btstyle = { margin: '8px 0' };
  const history = useHistory();
  console.log(
    history.location.state.firstName + ' ' + history.location.state.lastName
  );
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const tableRef = React.createRef();

  const onGetStudentAttendance = async () => {
    try {
      const userId = history.location.state.userId;
      const url = `https://ku42k1lhrd.execute-api.us-west-2.amazonaws.com/dev/student/?studentId=${userId}`;
      const result = await axios(url);
      setData(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onAddAttendance = async (updatedRow) => {
    try {
      const { classId, sectionId, hasAttendedToday } = updatedRow;
      const studentId = history.location.state.userId;
      console.log('updatedRow:', updatedRow);
      const headers = {};
      const response = await axios.post(
        `https://ku42k1lhrd.execute-api.us-west-2.amazonaws.com/dev/addAttendance`,
        { studentId, classId, sectionId, hasAttendedToday }
      );
      console.log('response', response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateAndLoadAll = async (updatedRow) => {
    setIsLoading(true);
    await onAddAttendance(updatedRow);
    await onGetStudentAttendance();
    setIsLoading(false);
  };

  const onLogout = async () => {
    history.push('/');
  };

  const handleLogout = async () => {
    await onLogout();
  };

  useEffect(() => {
    (async () => {
      await onGetStudentAttendance();
    })();
  }, []);

  return (
    <div>
      <h1>Student</h1>
      <TextField
        inputProps={{
          readOnly: true,
          disabled: true
        }}
        value={
          history.location.state.firstName +
          ' ' +
          history.location.state.lastName
        }
        name="FullName"
        label="Full Name"
        placeholder="user full name"
        required
      />

      <br />
      <MaterialTable
        title="Attendance List"
        data={data}
        tableRef={tableRef}
        icons={tableIcons}
        columns={columns}
        isLoading={isLoading}
        editable={{
          onRowUpdate: (updatedRow) => handleUpdateAndLoadAll(updatedRow)
        }}
        options={{
          actionsColumnIndex: -1,
          addRowPosition: 'first',
          sorting: true
        }}
      />
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

export default withRouter(StudentPortal);
