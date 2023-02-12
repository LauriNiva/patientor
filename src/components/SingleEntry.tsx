import { Box, Divider, Typography } from '@material-ui/core';
import { useStateValue } from '../state';
import {
  Entry,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from '../types';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import TodayIcon from '@material-ui/icons/Today';
import FavoriteBorderTwoToneIcon from '@material-ui/icons/FavoriteBorderTwoTone';
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone';

const renderHealthRating = (rating: number) => {
  const health: Array<boolean> = [];
  for (let i = 0; i < 4; i++) {
    if (rating <= i) {
      health.push(true);
    } else {
      health.push(false);
    }
  }
  console.log(health);
  return health.reverse().map((h, i) =>
    h ? (
      <FavoriteTwoToneIcon key={i} htmlColor="red" />
    ) : (
      <FavoriteBorderTwoToneIcon key={i} htmlColor="red" />
    )
  );
};

const SingleHospitalEntry = ({ entry }: { entry: HospitalEntry }) => {
  const [{ diagnoses }] = useStateValue();
  return (
    <Box mb={2} p={2} border={2} borderRadius={4}>
      <Typography variant="body1">
        {entry.date}
        <LocalHospitalIcon />
      </Typography>
      <Divider />
      <Typography variant="body1">
        <i>{entry.description}</i>
      </Typography>
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map((code) => (
            <li key={entry.id + code}>
              {code} {diagnoses[code]?.name}
            </li>
          ))}
        </ul>
      )}
      <Typography variant="body1">
        {entry.discharge.date} {entry.discharge.criteria}
      </Typography>
      <Divider />
      <Typography variant="body1">
        <br />
        Diagnosis by <i>{entry.specialist}</i>
      </Typography>
    </Box>
  );
};

const SingleHealthCheckEntry = ({ entry }: { entry: HealthCheckEntry }) => {
  const [{ diagnoses }] = useStateValue();
  return (
    <Box mb={2} p={2} border={2} borderRadius={4}>
      <Typography variant="body1">
        {entry.date}
        <TodayIcon />
      </Typography>
      <Divider />
      <Typography variant="body1">
        {renderHealthRating(entry.healthCheckRating)}
      </Typography>
      <Typography variant="body1">
        <i>{entry.description}</i>
      </Typography>
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map((code) => (
            <li key={entry.id + code}>
              {code} {diagnoses[code]?.name}
            </li>
          ))}
        </ul>
      )}
      <Divider />
      <Typography variant="body1">
        <br />
        Diagnosis by <i>{entry.specialist}</i>
      </Typography>
    </Box>
  );
};

const SingleOccupationalHealthcareEntry = ({
  entry,
}: {
  entry: OccupationalHealthcareEntry;
}) => {
  const [{ diagnoses }] = useStateValue();
  return (
    <Box mb={2} p={2} border={2} borderRadius={4}>
      <Typography variant="body1">
        {entry.date} <BusinessCenterIcon />
        {entry.employerName}
      </Typography>
      <Divider />
      <Typography variant="body1">
        <i>{entry.description}</i>
      </Typography>

      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map((code) => (
            <li key={entry.id + code}>
              {code} {diagnoses[code]?.name}
            </li>
          ))}
        </ul>
      )}
      <Typography variant="body1">
        {entry.sickLeave &&
          `Sickleave: 
        ${entry.sickLeave.startDate} - 
        ${entry.sickLeave.endDate} `}
      </Typography>
      <Divider />
      <Typography variant="body1">
        <br />
        Diagnosis by <i>{entry.specialist}</i>
      </Typography>
    </Box>
  );
};

const SingleEntry = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case 'Hospital':
      return <SingleHospitalEntry entry={entry} />;
    case 'HealthCheck':
      return <SingleHealthCheckEntry entry={entry} />;
    case 'OccupationalHealthcare':
      return <SingleOccupationalHealthcareEntry entry={entry} />;
    default:
      const _exhaustiveCheck: never = entry;
      return _exhaustiveCheck;
  }
};

export default SingleEntry;
