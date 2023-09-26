import ChatAPI from './api/ChatAPI';
import VisualConstructor from './VisualConstructor';

export default class Chat {
  constructor(container) {
    this.container = container;
    this.api = new ChatAPI();
    this.websocket = null;
    this.userId = null;
    this.userName = null;

    this.registerPopup = this.container.querySelector('.register-popup');
    this.registerError = this.registerPopup.querySelector('.register-error');

    this.chatContainer = this.container.querySelector('.chat-container');
    this.userList = this.chatContainer.querySelector('.chat__userlist');

    this.messageList = this.container.querySelector('.chat__messages-container');
  }

  init() {
    this.subscribeOnEvents();
    this.registerPopup.showModal();
  }

  subscribeOnEvents() {
    this.registerPopup.addEventListener('submit', (e) => {
      e.preventDefault();

      this.registration(e.target);

      e.target.reset();
    });

    this.chatContainer.addEventListener('submit', (e) => {
      e.preventDefault();

      this.onSendMessage(e.target);

      e.target.reset();
    });

    window.addEventListener('beforeunload', () => {
      this.websocket.send(JSON.stringify({ type: 'exit', user: { name: this.userName } }));
    });
  }

  registration(formEl) {
    const formData = new FormData(formEl);

    const name = formData.get('name');
    const data = { name };

    if (!name) {
      console.log('Введите имя');
      return;
    }

    ChatAPI.register(data, (res) => this.onEnterChatHandler(res));
  }

  onEnterChatHandler(res) {
    if (res.status === 'error') {
      this.registerError.textContent = res.message;
      return;
    }

    this.userId = res.user.id;
    this.userName = res.user.name;

    this.wsInit();
    this.registerPopup.close();
  }

  onSendMessage(formEl) {
    const formData = new FormData(formEl);
    const message = formData.get('message').trim();
    if (!message) return;

    const data = {};
    data.type = 'send';
    data.userId = this.userId;
    data.userName = this.userName;
    data.message = message;

    this.websocket.send(JSON.stringify(data));
  }

  renderMessage(data) {
    const message = data;

    if (data.userId === this.userId) {
      message.userName = 'YOU';
      message.yourself = true;
    }

    const messageEl = VisualConstructor.createMessageCard(message);
    this.messageList.append(messageEl);
  }

  renderUsers(data) {
    this.userList.replaceChildren();
    data.forEach((item) => {
      const user = item;
      const iserId = user.id;

      if (iserId === this.userId) {
        user.name = 'YOU';
      }

      const userCardEl = VisualConstructor.createUserCard(user);
      this.userList.append(userCardEl);
    });
  }

  wsInit() {
    this.websocket = new WebSocket('wss://ws-server-23j4.onrender.com/ws');
    // this.websocket = new WebSocket('ws://localhost:3000/ws');

    this.websocket.addEventListener('open', () => {
      console.log('ws opened');
    });

    this.websocket.addEventListener('close', () => {
      console.log('ws close');
    });

    this.websocket.addEventListener('message', (e) => {
      this.onWsMessage(e);
    });

    this.websocket.addEventListener('error', () => {
      console.log('ws error');
    });
  }

  onWsMessage(e) {
    const data = JSON.parse(e.data);

    if (data instanceof Array) {
      this.renderUsers(data);
    }

    if (data.type === 'send') {
      this.renderMessage(data);
    }
  }
}
