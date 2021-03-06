import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Paragraph, themeColor, themeSpacing } from '@datapunt/asc-ui';

import { incidentType, attachmentsType } from 'shared/types';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';

import Location from './components/Location';
import Attachments from './components/Attachments';
import ExtraProperties from './components/ExtraProperties';

const DemiParagraph = styled(Paragraph)`
  font-family: Avenir Next LT W01 Demi;
  margin: ${themeSpacing(4)} 0;
`;

const DefinitionList = styled.dl`
  margin: 0;
  display: grid;

  @media (min-width: ${({ theme }) => theme.layouts.medium.max}px) {
    column-gap: ${({ theme }) => theme.layouts.medium.gutter}px;
    grid-template-columns: 2fr 4fr;
  }

  @media (min-width: ${({ theme }) => theme.layouts.large.min}px) {
    column-gap: ${({ theme }) => theme.layouts.large.gutter}px;
    grid-template-columns: 3fr 4fr;
  }

  dt, dd {
    @media (min-width: ${({ theme }) => theme.layouts.medium.max}px) {
      padding: ${themeSpacing(2)} 0;
    }
  }

  dt {
    color: ${themeColor('tint', 'level5')};
    margin: 0;
  }

  dd {
    padding-bottom: ${themeSpacing(2)};
    width: 100%;
  }
`;

const Detail = ({ incident, attachments, onShowLocation, onEditLocation, onShowAttachment }) => (
  <article>
    <DemiParagraph data-testid="detail-title">
      {incident.text}
    </DemiParagraph>

    <DefinitionList>
      <dt>Overlast</dt>
      <dd>
        {string2date(incident.incident_date_start)} {string2time(incident.incident_date_start)}&nbsp;
      </dd>

      <Location incident={incident} onShowLocation={onShowLocation} onEditLocation={onEditLocation} />

      <Attachments attachments={attachments} onShowAttachment={onShowAttachment} />

      {incident.extra_properties && <ExtraProperties items={incident.extra_properties} />}

      <dt data-testid="detail-email-definition">
        E-mail melder
      </dt>
      <dd data-testid="detail-email-value">
        {incident.reporter.email}
      </dd>

      <dt data-testid="detail-phone-definition">
        Telefoon melder
      </dt>
      <dd data-testid="detail-phone-value">
        {incident.reporter.phone}
      </dd>
    </DefinitionList>
  </article>
);

Detail.propTypes = {
  incident: incidentType.isRequired,
  attachments: attachmentsType.isRequired,

  onShowAttachment: PropTypes.func.isRequired,
  onShowLocation: PropTypes.func.isRequired,
  onEditLocation: PropTypes.func.isRequired,
};

export default Detail;
