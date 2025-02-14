import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Button, Divider, Container } from '@material-ui/core';

import { apiBaseUrl } from './constants';
import { setDiagnosesData, setPatientList, useStateValue } from './state';
import { Diagnosis, Patient } from './types';

import PatientListPage from './PatientListPage';
import { Typography } from '@material-ui/core';
import SinglePatientPage from './SinglePatientPage';

const App = () => {
  const [, dispatch] = useStateValue();
  React.useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      try {
        const { data: patientListFromApi } = await axios.get<Patient[]>(
          `${apiBaseUrl}/patients`
        );
        dispatch(setPatientList(patientListFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    const fetchDiagnosesData = async () => {
      try {
        const { data: diagnosesDataFromApi } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnoses`
        );
        dispatch(setDiagnosesData(diagnosesDataFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    void fetchPatientList();
    void fetchDiagnosesData();
  }, [dispatch]);

  return (
    <div className="App">
      <Router>
        <Container>
          <Typography variant="h3" style={{ marginBottom: '0.5em' }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider hidden />
          <Routes>
            <Route path="/" element={<PatientListPage />} />
            <Route path="/patients/" element={<PatientListPage />} />
            <Route path="/patients/:id" element={<SinglePatientPage />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
