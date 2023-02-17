import React from 'react';
import { Grid, Button, Box, FormControlLabel, Checkbox } from '@material-ui/core';
import { Field, Formik, Form } from 'formik';

import { DiagnosisSelection, SelectField, TextField } from './FormField';
import {
  Entry,
  EntryWithoutId,
  HealthCheckRating,
  // HospitalEntry
} from '../types';
import { useStateValue } from '../state';
import HealthRatingBar from '../components/HealthRatingBar';

export type EntryFormValues = EntryWithoutId;
//export type EntryFormValues = Omit<HospitalEntry, 'id'>;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

export const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();

  const typesOfEntries: Array<Entry['type']> = [
    'Hospital',
    'HealthCheck',
    'OccupationalHealthcare',
  ];
  
  const currentDateForDatePicker = new Date()
    .toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .split('/')
    .reverse()
    .join('-');

  type SubmitValues = {
    type: EntryFormValues['type'];
    description: string;
    date: string;
    specialist: string;
    diagnosisCodes: string[];
    dischargeDate: string;
    dischargeCriteria: string;
    healthCheckRating: HealthCheckRating;
    sickLeave: boolean;
    startDate: string;
    endDate: string;
    employerName: string;
  };

  const handleSubmit = (values: SubmitValues) => {
    console.log('bloop', values);
    switch (values.type) {
      case 'Hospital':
        onSubmit({
          ...values,
          type: 'Hospital',
          discharge: {
            date: values.dischargeDate,
            criteria: values.dischargeCriteria,
          },
        });
        break;
      case 'HealthCheck':
         onSubmit({
           ...values,
           type: 'HealthCheck',
         });
        break;
      case 'OccupationalHealthcare':
        onSubmit({
          ...values,
          type: 'OccupationalHealthcare',
          sickLeave: values.sickLeave ? {
            startDate: values.startDate,
            endDate: values.endDate,
          } : undefined,
        });
        break;
      default:
        break;
    }
  };

  return (
    <Formik
      initialValues={{
        type: typesOfEntries[0],
        description: '',
        date: currentDateForDatePicker,
        specialist: '',
        diagnosisCodes: [],
        dischargeDate: currentDateForDatePicker,
        dischargeCriteria: '',
        healthCheckRating: 0,
        employerName: '',
        sickLeave: false,
        startDate: currentDateForDatePicker,
        endDate: currentDateForDatePicker,
      }}
      onSubmit={handleSubmit}
      validate={(values) => {
        const requiredError = 'Field is required';
        const errors: { [field: string]: string } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (values.date) {
          if (!Date.parse(values.date)) {
            errors.date = 'Not a date';
          }
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        switch (values.type) {
          case 'Hospital':
            if (!values.dischargeDate) {
              errors.dischargeDate = requiredError;
            }
            if (!values.dischargeCriteria) {
              errors.dischargeCriteria = requiredError;
            }
            break;
          case 'HealthCheck':
            break;
          case 'OccupationalHealthcare':
            if (!values.employerName) {
              errors.employerName = requiredError;
            }
            break;
        }

        return errors;
      }}
    >
      {({
        isValid,
        dirty,
        values,
        handleChange,
        setFieldValue,
        setFieldTouched,
      }) => {
        return (
          <Form className="form ui">
            <SelectField
              label="Type"
              name="type"
              options={typesOfEntries.map((entry) => {
                return { value: entry };
              })}
            />
            <Field label="Date" name="date" type="date" component={TextField} />
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            {values.type === 'Hospital' && (
              <>
                <Field
                  label="Discharge Date"
                  placeholder="Discharge Date"
                  name="dischargeDate"
                  type="date"
                  component={TextField}
                />
                <Field
                  label="Discharge Criteria"
                  placeholder="Discharge Criteria"
                  name="dischargeCriteria"
                  component={TextField}
                />
              </>
            )}
            {values.type === 'OccupationalHealthcare' && (
              <>
                <Field
                  label="Employer Name"
                  placeholder="Employer Name"
                  name="employerName"
                  component={TextField}
                />
                <Box p={2}>
                  <FormControlLabel
                    label="Sick Leave"
                    name="sickLeave"
                    onChange={handleChange}
                    control={<Checkbox />}
                  />
                  <Field
                    disabled={!values.sickLeave}
                    label="Start Date"
                    name="startDate"
                    type="date"
                    component={TextField}
                  />
                  <Field
                    disabled={!values.sickLeave}
                    label="End Date"
                    name="endDate"
                    type="date"
                    component={TextField}
                  />
                </Box>
              </>
            )}
            {values.type === 'HealthCheck' && (
              <>
                <Box p={2}>
                  <HealthRatingBar showText rating={values.healthCheckRating} />
                  <Button
                    disabled={!(values.healthCheckRating < 3)}
                    onClick={() =>
                      setFieldValue(
                        'healthCheckRating',
                        values.healthCheckRating + 1
                      )
                    }
                  >
                    -
                  </Button>
                  <Button
                    disabled={!(values.healthCheckRating > 0)}
                    onClick={() =>
                      setFieldValue(
                        'healthCheckRating',
                        values.healthCheckRating - 1
                      )
                    }
                  >
                    +
                  </Button>
                </Box>
              </>
            )}
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: 'left' }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: 'right',
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
