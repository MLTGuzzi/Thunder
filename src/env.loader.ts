export const envLoader = {
  provide: 'ENV',
  useFactory: () => {
    return fetch('/assets/env.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load environment variables.');
        }
        return response.json();
      })
      .catch((error) => {
        console.error(error.message);
        return {}; // Return an empty object if loading fails
      });
  },
};