// __mocks__/ace-builds.js
module.exports = {
  edit: jest.fn(() => ({
    setValue: jest.fn(),
    getValue: jest.fn(),
    session: {
      setMode: jest.fn()
    },
    setTheme: jest.fn(),
    on: jest.fn()
  }))
}
