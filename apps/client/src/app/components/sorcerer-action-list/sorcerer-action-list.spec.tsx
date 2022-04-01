import { render } from '@testing-library/react';
import { SorcererActionList } from './sorcerer-action-list';

describe('SorcererActionList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SorcererActionList />);
    expect(baseElement).toBeTruthy();
  });
});
