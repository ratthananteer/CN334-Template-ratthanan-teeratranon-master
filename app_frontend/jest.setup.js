// jest.setup.js
import '@testing-library/jest-dom'; // สำหรับการใช้ jest-dom matchers เช่น `toBeInTheDocument()`

// เพิ่มการ mock global fetch หรืออื่นๆ
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]), // mock ค่า default สำหรับการ fetch
  })
);
