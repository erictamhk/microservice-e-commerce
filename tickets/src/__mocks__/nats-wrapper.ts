export const natsWrapper = {
  client: {
    publish: (subjest: string, data: string, callback: () => void) => {
      callback();
    },
  },
};
