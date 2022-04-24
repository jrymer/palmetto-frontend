import React from 'react';
import styled from 'styled-components';

import './autocomplete.css';

import CancelIcon from '../../../assets/cancel.png';
import DownIcon from '../../../assets/down.png';
import { PredictionOption } from '../../../types';

const AutocompleteContainer = styled.div`
  display: flex;
  flex: 2;
  position: relative;
  margin: ${(props) => props.theme.margin};
`;

const InputContainer = styled.div<InputContainerProps>`
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  border: solid;
  border-color: ${(props) =>
    props.isOpen ? props.theme.colors.secondary : props.theme.colors.offsetGrey};
  border-width: medium;
  background-color: ${(props) => props.theme.colors.background};
  padding: ${(props) => props.theme.padding};
  width: 100%;

  &:hover {
    border-color: ${(props) => (props.isOpen ? props.theme.colors.secondary : '#000')};
  }
`;

const Input = styled.input`
  font-size: var(--fs-400);
  padding: ${(props) => props.theme.padding};
  outline: none;
  border: none;
`;

// monster z-index to go over leaflet
const OptionsContainer = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px 0;
  background-color: ${(props) => props.theme.colors.background};
  border: solid thin #ccc;
  position: absolute;
  top: 105px;
  z-index: 10000;
`;

const Option = styled.li<OptionProps>`
  position: relative;
  padding: 10px;
  list-style: none;
  cursor: ${(props) => (props.disableHover ? 'auto' : 'pointer')};

  &:hover {
    background-color: ${(props) => (props.disableHover ? 'none' : props.theme.colors.offsetGrey)};
  }
`;

const IconButton = styled.img`
  cursor: pointer;
  margin: 0px 10px;
  padding: 4px;
  height: var(--icon-size);
  width: var(--icon-size);

  &:hover {
    background-color: #ededed;
    border: none;
    border-radius: 50%;
  }
`;

interface OptionProps {
  disableHover: boolean;
}

interface InputContainerProps {
  isOpen: boolean;
}

interface AutocompleteFieldProps {
  searchDisabled?: boolean;
  options: PredictionOption[] | null;
  value: string;
  onSearch: () => void;
  onChange: (value: string) => void;
  onSelect: (id: string) => void;
}
/**
 * Autocomplete inpput field with options list
 *
 * @param {boolean} searchDisabled Defaults to true, controls if pressing <enter> will
 *  fire the onSearch()
 * @param {PredictionOption[] | null} options List of prediction options
 * @param {string} value Selected value
 * @param {() => void} onSearch Fires the weather API search
 * @param {(value: string) => void} onChange Onchange to catch typing changes to the search value
 * @param {(id: string) => void} onSelect Fires when an option is selected
 * @return {React.FC<AutocompleteFieldProps>} An autocomplete field
 */
const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  searchDisabled = true,
  options,
  value,
  onChange,
  onSelect,
  onSearch,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  /**
   * Catch keyboard input, if we catch an <enter> check if we can submit the search
   *
   * @param {KeyboardEvent} e Event to catch the code on
   */
  const onKeyPress = (e: KeyboardEvent) => {
    if ((e.code === 'Enter' || e.code === 'NumpadEnter') && !searchDisabled) {
      e.preventDefault();
      onSearch();
    }
  };

  /**
   * Handle adding and removing our event listeners.
   * Add searchDisabled as dependency to refresh the onKeyPress listener
   */
  React.useEffect(() => {
    window.addEventListener('keydown', onKeyPress);

    return () => {
      window.removeEventListener('keydown', onKeyPress);
    };
  }, [searchDisabled]);

  /**
   * Catch to open the options list when we finally get a valid options list
   * from our props
   */
  React.useEffect(() => {
    if (options) {
      setIsOpen(true);
    }
  }, [options]);

  /**
   * Reset the search field and close the options picker
   */
  const clearInput = () => {
    onChange('');
    setIsOpen(false);
  };
  /**
   * React to typing
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e Change event to capture the input of
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  /**
   * React to selecting an option from the option picker
   *
   * @param {PredictionOption} option The option that was chosen
   */
  const handleSelect = (option: PredictionOption) => {
    onSelect(option.id);
    setIsOpen(false);
  };

  return (
    <AutocompleteContainer>
      <InputContainer isOpen={isOpen}>
        <Input
          onChange={handleChange}
          placeholder="Search for a cities weather by typing the cities name."
          value={value}
        />
        <IconButton
          className={isOpen ? 'arrow-down' : 'arrow-up'}
          onClick={() => setIsOpen(!isOpen)}
          src={DownIcon}
        />
        <IconButton onClick={clearInput} src={CancelIcon} />
      </InputContainer>
      {options && isOpen ? (
        <OptionsContainer>
          {options.map((option, index) => (
            <Option
              disableHover={false}
              key={`${option.value}-${index}`}
              onClick={() => handleSelect(option)}
            >
              {option.display}
            </Option>
          ))}
        </OptionsContainer>
      ) : (
        isOpen && (
          <OptionsContainer>
            <Option disableHover={true}>
              Begin typing a valid Cities name to populate suggestions.
            </Option>
          </OptionsContainer>
        )
      )}
    </AutocompleteContainer>
  );
};

export default AutocompleteField;
