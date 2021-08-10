import * as zson from '../index.native';

describe('index.native', () => {
  it('should re-export each react native component', () => {
    expect(zson).toMatchInlineSnapshot(`
      Object {
        "ActionSheet": [Function],
        "Badge": [Function],
        "Button": [Function],
        "Cell": [Function],
        "Collapse": [Function],
        "FilePicker": [Function],
        "Mask": [Function],
        "Message": [Function],
        "NavBar": [Function],
        "NoticeBar": [Function],
        "Panel": [Function],
        "Popup": [Function],
        "Stepper": [Function],
        "SwipeAction": [Function],
      }
    `);
  });
});
