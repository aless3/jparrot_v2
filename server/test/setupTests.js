jest.setTimeout(30000);

beforeEach(async () => {
  await new Promise((res) =>
    setTimeout(() => {
      console.log("new test starting");
      res();
    }, 2000)
  );
});
