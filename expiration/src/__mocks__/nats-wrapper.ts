export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subjest: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};
