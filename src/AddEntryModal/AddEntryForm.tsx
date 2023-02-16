import React from 'react';
import { Grid, Button } from '@material-ui/core';
import { Field, Formik, Form } from 'formik';

import { DiagnosisSelection, TextField } from './FormField';
import { HospitalEntry } from '../types';
import { useStateValue } from '../state';

// export type EntryFormValues = EntryWithoutId;
export type EntryFormValues = Omit<HospitalEntry, 'id'>;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

export const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();

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
    type: 'Hospital';
    description: string;
    date: string;
    specialist: string;
    diagnosisCodes?: string[];
    dischargeDate: string;
    dischargeCriteria: string;
  };

  const handleSubmit = (values: SubmitValues) => {
    console.log('bloop', values);
    onSubmit({
      ...values,
      discharge: {
        date: values.dischargeDate,
        criteria: values.dischargeCriteria,
      },
    });
  };

  return (
    <Formik
      initialValues={{
        type: 'Hospital',
        description: '',
        //date: "2017-05-24",
        date: currentDateForDatePicker,
        specialist: '',
        diagnosisCodes: [],
        dischargeDate: currentDateForDatePicker,
        dischargeCriteria: '',
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
        if (!values.dischargeDate) {
          errors.dischargeDate = requiredError;
        }
        if (!values.dischargeCriteria) {
          errors.dischargeCriteria = requiredError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <Field
              label="Type"
              placeholder="Type"
              name="type"
              component={TextField}
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
