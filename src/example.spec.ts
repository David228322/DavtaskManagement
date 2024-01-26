function addNumbers(number1: number, number2: number): number {
  return number1 + number2;
}

describe('addNumbers', () => {
  it('adding good', () => {
    expect(addNumbers(2, 2)).toEqual(4);
  });
});
describe('test', () => {
  it('equals true', () => {
    expect(true).toEqual(true);
    expect('Arial').toEqual('Arial');
  });
});
