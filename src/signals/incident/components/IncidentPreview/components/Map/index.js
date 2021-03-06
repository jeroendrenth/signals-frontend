import React from 'react';
import PropTypes from 'prop-types';

import MAP_OPTIONS from 'shared/services/configuration/map-options';
import Map from 'components/Map';
import styled from 'styled-components';
import { Row, Column, themeSpacing } from '@datapunt/asc-ui';
import { formatAddress } from 'shared/services/map-location';
import { Marker } from '@datapunt/react-maps';
import { markerIcon } from 'shared/services/configuration/map-markers';

const StyledMap = styled(Map)`
  margin-top: ${themeSpacing(4)};
  height: 300px;
`;

const ItemWrapper = styled.div`
  padding: ${themeSpacing(5, 0)};
  width: 100%;
`;

/**
 * Map preview with one or more markers
 */
const MapPreview = ({ label, value }) => {
  const location = value?.geometrie?.coordinates;

  const lat = location && location[1];
  const lng = location && location[0];
  const options = {
    ...MAP_OPTIONS,
    attributionControl: false,
    center: [lat, lng],
  };

  return (
    <Row hasMargin={false}>
      <Column span={{ small: 1, medium: 2, big: 6, large: 10, xLarge: 10 }} wrap>
        <Column span={{ small: 1, medium: 2, big: 2, large: 2, xLarge: 2 }}>
          <ItemWrapper>{label}</ItemWrapper>
        </Column>
        <Column span={{ small: 1, medium: 2, big: 4, large: 6, xLarge: 6 }}>
          {value && (
            <ItemWrapper>
              <div>{value.address ? formatAddress(value.address) : 'Geen adres gevonden'}</div>

              {lat && lng && (
                <StyledMap data-testid="map-preview" mapOptions={options} canBeDragged={false}>
                  <Marker args={[{ lat, lng }]} options={{ icon: markerIcon }} />
                </StyledMap>
              )}
            </ItemWrapper>
          )}
        </Column>
      </Column>
    </Row>
  );
};

MapPreview.propTypes = {
  label: PropTypes.string,
  value: PropTypes.shape({
    address: PropTypes.object,
    geometrie: PropTypes.object,
  }),
  mapOptions: PropTypes.shape({}) /** leaflet options */,
};

export default MapPreview;
