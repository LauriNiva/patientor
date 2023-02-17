import { Box, Button, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddEntryModal from '../AddEntryModal';
import { EntryFormValues } from '../AddEntryModal/AddEntryForm';
import SingleEntry from '../components/SingleEntry';
import { apiBaseUrl } from '../constants';
import { updatePatient, useStateValue } from '../state';
import { Entry, Patient } from '../types';

const SinglePatientPage = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <></>;

  const [{ patients }, dispatch] = useStateValue();

  const patient = patients[id];

const [modalOpen, setModalOpen] = React.useState<boolean>(false);
const [error, setError] = React.useState<string>();

const openModal = (): void => setModalOpen(true);

const closeModal = (): void => {
  setModalOpen(false);
  setError(undefined);
};

const submitNewEntry = async (values: EntryFormValues) => {
  try {
    const { data: newEntry } = await axios.post<Entry>(
      `${apiBaseUrl}/patients/${id}/entries`,
      values
    );
    const updatedPatient = {...patient};
    updatedPatient.entries
      ? updatedPatient.entries.push(newEntry)
      : (updatedPatient.entries = [newEntry]);
    dispatch(updatePatient(updatedPatient));
    closeModal();
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      console.error(e?.response?.data || 'Unrecognized axios error');
      setError(String(e?.response?.data?.error) || 'Unrecognized axios error');
    } else {
      console.error('Unknown error', e);
      setError('Unknown error');
    }
  }
};


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
        <Typography gutterBottom={true} variant="h4">
          Entries
        </Typography>
        <AddEntryModal
          modalOpen={modalOpen}
          onSubmit={submitNewEntry}
          error={error}
          onClose={closeModal}
        />
        <Button variant="contained" onClick={() => openModal()}>
          Add New Entry
        </Button>
        <br />
        {patient.entries?.map((entry) => (
          <SingleEntry key={entry.id} entry={entry} />
        ))}
      </Box>
    </Box>
  );
};

export default SinglePatientPage;
