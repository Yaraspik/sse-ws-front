const createRequest = async (options = {}) => {
  const url = 'https://ws-server-23j4.onrender.com';
  // const url = 'http://localhost:3000';

  const response = await fetch(`${url}/${options.handle}`, {
    method: options.method,
    body: options.body,
  });

  const json = await response.json().catch(() => null);
  return json;
};

export default createRequest;
