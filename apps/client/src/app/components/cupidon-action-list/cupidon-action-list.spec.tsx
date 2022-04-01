import { render } from '@testing-library/react';

import CupidonActionList from './cupidon-action-list';

describe('CupidonActionList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CupidonActionList />);
    expect(baseElement).toBeTruthy();
  });
});
