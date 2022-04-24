import React from 'react';
import styled, { ThemeProvider } from 'styled-components';

import theme from './theme';

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.colors.background};
  overflow: hidden;
`;

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Wraps our app in a theme provider and put app wide layout elements (like a non existent footer and navbar) here
 *
 * @param {*} { children }
 * @return {*}
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Container>{children}</Container>
    </ThemeProvider>
  );
};

export default Layout;
