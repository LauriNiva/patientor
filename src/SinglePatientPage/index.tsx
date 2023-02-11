import { Box, Typography } from '@material-ui/core';
import axios from 'axios';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiBaseUrl } from '../constants';
import { useStateValue } from '../state';
import { Patient } from '../types';

const SinglePatientPage = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <></>;

  const [{ patients }, dispatch] = useStateValue();

  const patient = patients[id];

  useEffect(() => {
    const fetchSinglePatient = async () => {
      try {
        const { data: patientDataFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch({ type: 'ADD_PATIENT', payload: patientDataFromApi });
      } catch (e) {
        console.error(e);
      }
    };

    if (!patient?.ssn) {
      void fetchSinglePatient();
    }
  }, [dispatch]);

  if (!patient)
    return (
      <Box pt={4}>
        <Typography variant="h3">Patient not found.</Typography>
      </Box>
    );

  return (
    <Box pt={4}>
      <Typography variant="h3">{patient.name}</Typography>
      <Typography variant="body1">({patient.gender})</Typography>
      <Typography variant="body1">SSN: {patient.ssn}</Typography>
      <Typography variant="body1">Occupation: {patient.occupation} </Typography>
    </Box>
  );
};

export default SinglePatientPage;
