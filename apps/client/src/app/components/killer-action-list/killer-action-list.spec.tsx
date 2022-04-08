import { render } from '@testing-library/react';
import { KillerActionList } from './killer-action-list';

describe('WerewolfActionList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<KillerActionList />);
    expect(baseElement).toBeTruthy();
  });
});
