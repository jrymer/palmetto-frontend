import React from 'react';
import styled from 'styled-components';

const Container = styled.div<ContainerProps>`
  margin: ${(props) => props.theme.margin};
  background-color: ${(props) =>
    props.disabled ? props.theme.colors.offsetGrey : props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.disabled ? 'auto' : 'pointer')};
  width: ${(props) => props.width};

  &:hover {
    background-color: ${(props) =>
      props.disabled ? props.theme.colors.offsetGrey : props.theme.colors.primaryContrast};
  }

  &:active {
    background-color: ${(props) =>
      props.disabled ? props.theme.colors.offsetGrey : props.theme.colors.primaryContrast};
    transform: ${(props) => (props.disabled ? 'none' : 'scale(0.98)')};
  }
`;

const TextContainer = styled.span`
  text-align: center;
  font-size: var(--fs-500);
  padding: 1em 3em;
  color: #fff;
`;

interface ContainerProps {
  disabled: boolean;
  width: string;
}

interface ButtonProps {
  buttonText: string;
  disabled?: boolean;
  onSearch: () => void;
  width?: string;
}

/**
 * Renders a button
 *
 * @param {string} buttonText Text to display on the button
 * @param {boolean} disabled If the button is clickable or not
 * @param {() => void} onSearch Fire the weather API search
 * @param {string} width Optional width override
 * @return A reusable button component
 */
const Button: React.FC<ButtonProps> = ({
  buttonText,
  disabled = false,
  onSearch,
  width = 'var(--col-width)',
}) => {
  const handleClick = () => {
    if (!disabled) {
      onSearch();
    }
  };
  return (
    <Container disabled={disabled} onClick={handleClick} role="button" width={width}>
      <TextContainer>{buttonText}</TextContainer>
    </Container>
  );
};

export default Button;
