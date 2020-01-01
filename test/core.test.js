import { getNpmInfo } from "../core";

test("teat on getNPMInfo function", () => {
  const depInfo = [
    {
      name: "react",
      version: "16.8.0"
    },
    {
      name: 'redux',
      version: '4.0.5'
    }
  ];

  const info = getNpmInfo(depInfo);
  expect(Array.isArray(info)).toBeTruthy();
});
