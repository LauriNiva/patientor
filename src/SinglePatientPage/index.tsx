import { Box, Typography } from '@material-ui/core';
import axios from 'axios';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiBaseUrl } from '../constants';
import { updatePatient, useStateValue } from '../state';
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
        dispatch(updatePatient(patientDataFromApi));
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
      <Box mt={4}>
        <Typography variant="h4">Entries</Typography>
        {patient.entries?.map((entry) => (
          <Box mt={2} key={entry.id}>
            <Typography variant="body1">
              {entry.date} <i>{entry.description}</i>
            </Typography>
            {entry.diagnosisCodes && (
              <ul>
                {entry.diagnosisCodes.map((code) => (
                  <li key={entry.id + code}>{code}</li>
                ))}
              </ul>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SinglePatientPage;
