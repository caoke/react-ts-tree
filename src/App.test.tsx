import React from 'react';
import { render } from '@testing-library/react';

import App from './App';

test('renders learn react link', () => {
  const { queryByText } = render(<App compiler="Typescript" framework="React" />);
  const linkElement = queryByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
