import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import BackLink from 'components/BackLink';
import { themeColor, themeSpacing, Button, Heading } from '@datapunt/asc-ui';
import { PATCH_TYPE_THOR } from 'models/incident/constants';

import { incidentType } from 'shared/types';

import DownloadButton from './components/DownloadButton';

const Header = styled.header`
  display: grid;
  padding: ${themeSpacing(2, 0)};
  border-bottom: 1px solid ${themeColor('tint', 'level3')};
  width: 100%;

  @media (min-width: ${({ theme }) => theme.layouts.medium.max}px) {
    column-gap: ${({ theme }) => theme.layouts.medium.gutter}px;
    grid-template-columns: 7fr 4fr;
  }

  @media (min-width: ${({ theme }) => theme.layouts.large.min}px) {
    column-gap: ${({ theme }) => theme.layouts.large.gutter}px;
    grid-template-columns: 7fr 1fr 4fr;
  }
`;

const BackLinkContainer = styled.div`
  grid-column-start: 1;
  grid-column-end: 4;
`;

const StyledBackLink = styled(BackLink)`
  margin: ${themeSpacing(4)} 0;
`;

const ButtonContainer = styled.div`
  grid-column-start: 3;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  & > * {
    margin-left: ${themeSpacing(2)};
  }
`;

const HeadingContainer = styled.div`
  display: flex;

  && > * {
    margin: 0;
  }
`;

const ButtonLink = styled(Link)`
  border: 1px solid ${themeColor('tint', 'level7')};
  background-color: ${themeColor('tint', 'level1')};
  height: 32px;
  padding: ${themeSpacing(1, 2)};
  color: black;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  font-family: system-ui;

  &:hover {
    background-color: ${themeColor('tint', 'level4')};
    color: black;
  }

  &:focus {
    outline-color: ${themeColor('support', 'focus')};
    outline-style: solid;
    outline-offset: 0px;
    outline-width: 3px;
  }
`;

const DetailHeader = ({ incident, baseUrl, onPatchIncident }) => {
  const status = incident?.status?.state;
  const canSplit = status === 'm' && !(incident && (incident._links['sia:children'] || incident._links['sia:parent']));
  const canThor = ['m', 'i', 'b', 'h', 'send failed', 'reopened'].some(value => value === status);
  const downloadLink = incident._links && incident._links['sia:pdf'] && incident._links['sia:pdf'].href;
  const patch = {
    id: incident.id,
    type: PATCH_TYPE_THOR,
    patch: {
      status: {
        state: 'ready to send',
        text: 'Te verzenden naar THOR',
        target_api: 'sigmax',
      },
    },
  };

  return (
    <Header className="detail-header">
      <BackLinkContainer>
        <StyledBackLink to={`${baseUrl}/incidents`}>Terug naar overzicht</StyledBackLink>
      </BackLinkContainer>

      <HeadingContainer>
        <Heading styleAs="h4" data-testid="detail-header-title">
          Melding {incident.id}
        </Heading>
      </HeadingContainer>

      <ButtonContainer>
        {canSplit && (
          <ButtonLink to={`${baseUrl}/incident/${incident.id}/split`} data-testid="detail-header-button-split">
            Splitsen
          </ButtonLink>
        )}

        {canThor && (
          <Button variant="application" onClick={() => onPatchIncident(patch)} data-testid="detail-header-button-thor">
            THOR
          </Button>
        )}

        <DownloadButton
          label="PDF"
          url={downloadLink}
          filename={`SIA melding ${incident.id}.pdf`}
          data-testid="detail-header-button-download"
        />
      </ButtonContainer>
    </Header>
  );
};

DetailHeader.propTypes = {
  incident: incidentType.isRequired,
  baseUrl: PropTypes.string.isRequired,
  onPatchIncident: PropTypes.func.isRequired,
};

export default DetailHeader;
