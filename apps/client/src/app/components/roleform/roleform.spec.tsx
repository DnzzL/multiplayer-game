import { render } from '@testing-library/react';

import Roleform from './roleform';

describe('Roleform', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Roleform />);
    expect(baseElement).toBeTruthy();
  });
});
