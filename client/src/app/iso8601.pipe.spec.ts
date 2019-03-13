import { Iso8601Pipe } from './iso8601.pipe';

describe('Iso8601Pipe', () => {
  it('create an instance', () => {
    const pipe = new Iso8601Pipe();
    expect(pipe).toBeTruthy();
  });
});
