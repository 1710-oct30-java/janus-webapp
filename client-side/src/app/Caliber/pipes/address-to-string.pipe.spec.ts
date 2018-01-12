import { AddressToStringPipe } from './address-to-string.pipe';

describe('AddressToStringPipe', () => {
  it('create an instance', () => {
    const pipe = new AddressToStringPipe();
    expect(pipe).toBeTruthy();
  });
});
