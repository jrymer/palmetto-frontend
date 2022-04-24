import React, { ReactElement } from 'react';
import { QueryClient, QueryClientProvider, setLogger } from 'react-query';
import {
  create as rtrCreate,
  ReactTestRendererJSON,
  TestRendererOptions,
} from 'react-test-renderer';
import { render as rtlRender, RenderOptions, RenderResult } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import theme from '../components/layout/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
setLogger({
  log: () => {
    // log
  },
  warn: () => {
    // warn
  },
  // ✅ no more errors on the console
  error: () => {
    // error
  },
});

function render(
  component: ReactElement,
  wrapInUseQuery = false,
  renderOptions?: RenderOptions
): RenderResult {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return wrapInUseQuery ? (
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>\
      </ThemeProvider>
    ) : (
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    );
  };

  return rtlRender(component, { wrapper: Wrapper, ...renderOptions });
}

function createSnapshot(
  component: ReactElement,
  wrapInUseQuery = false,
  options?: TestRendererOptions
): ReactTestRendererJSON | ReactTestRendererJSON[] | null {
  const Wrapper = wrapInUseQuery ? (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
    </ThemeProvider>
  ) : (
    <ThemeProvider theme={theme}>{component}</ThemeProvider>
  );
  return rtrCreate(Wrapper, options).toJSON();
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { createSnapshot, render };
