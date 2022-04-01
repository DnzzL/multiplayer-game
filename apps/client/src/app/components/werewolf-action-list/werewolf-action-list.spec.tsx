import { render } from '@testing-library/react';
import { WerewolfActionList } from './werewolf-action-list';

describe('WerewolfActionList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WerewolfActionList />);
    expect(baseElement).toBeTruthy();
  });
});
