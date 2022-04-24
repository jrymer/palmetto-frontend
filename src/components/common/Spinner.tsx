import styled, { keyframes } from 'styled-components';

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  animation: ${rotate360} 1s linear infinite;
  transform: translateZ(0);

  border-top: 2px solid ${(props) => props.theme.colors.secondary};
  border-right: 2px solid ${(props) => props.theme.colors.secondary};
  border-bottom: 2px solid ${(props) => props.theme.colors.secondary};
  border-left: 4px solid ${(props) => props.theme.colors.primary};
  background: transparent;
  width: 5em;
  height: 5em;
  border-radius: 50%;
`;

export default Spinner;
