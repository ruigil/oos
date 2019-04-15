import { MonthNamesPipe } from './month-names.pipe';

describe('MonthNamesPipe', () => {
  it('create an instance', () => {
    const pipe = new MonthNamesPipe();
    expect(pipe).toBeTruthy();
  });
});
