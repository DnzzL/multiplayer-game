import { render } from '@testing-library/react';

import Role from './role';

describe('Role', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Role />);
    expect(baseElement).toBeTruthy();
  });
});
