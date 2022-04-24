import React from 'react';
import styled from 'styled-components';

import { Units } from '../../types';

const UnitPickerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--col-width);
  margin: ${(props) => props.theme.margin};
  border: solid thin #ccc;
`;

const UnitPickerItem = styled.div<UnitPickerItemProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: -webkit-fill-available;
  width: 100%;
  padding: ${(props) => props.theme.padding};
  background-color: ${(props) => (props.active ? props.theme.colors.primary : '#fff')};
  color: ${(props) => (props.active ? '#fff' : '#000')};

  &:hover {
    filter: brightness(85%);
  }
`;

interface UnitPickerItemProps {
  active: boolean;
}

interface UnitPickerProps {
  unit: Units;
  handleSetUnit: (unit: Units) => void;
}
/**
 *
 *
 * @param {Units} unit Unit that is active
 * @param {(unit: Units) => void} handleSetUnit sets new unit
 *
 * @returns A unit picker component
 */
const UnitPicker: React.FC<UnitPickerProps> = ({ unit, handleSetUnit }) => {
  const handleSelect = (u: Units) => {
    handleSetUnit(u);
  };

  return (
    <UnitPickerContainer>
      <UnitPickerItem active={unit === 'imperial'} onClick={() => handleSelect('imperial')}>
        Imperial
      </UnitPickerItem>
      <UnitPickerItem active={unit === 'metric'} onClick={() => handleSelect('metric')}>
        Metric
      </UnitPickerItem>
    </UnitPickerContainer>
  );
};

export default UnitPicker;
