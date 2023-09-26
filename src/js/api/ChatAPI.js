import createRequest from './createRequest';

export default class ChatAPI {
  static async register(data, callback) {
    const options = JSON.stringify(data);
    const handle = 'new-user';
    const res = await createRequest({ handle, method: 'POST', body: options });

    callback(res);
  }
}
