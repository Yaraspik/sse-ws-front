export default class VisualConstructor {
  static createDate() {
    const date = new Date();

    let dateHours = date.getHours();
    let dateMinutes = date.getMinutes();
    let dateDay = date.getDate();
    let dateMonth = date.getMonth() + 1;

    dateHours = (dateHours < 10) ? `0${dateHours}` : dateHours;
    dateMinutes = (dateMinutes < 10) ? `0${dateMinutes}` : dateMinutes;
    dateDay = (dateDay < 10) ? `0${dateDay}` : dateDay;
    dateMonth = (dateMonth < 10) ? `0${dateMonth}` : dateMonth;

    return `${dateHours}:${dateMinutes} ${dateDay}.${dateMonth}.${date.getFullYear()}`;
  }

  static createUserCard(item) {
    const container = document.createElement('div');
    container.classList.add('chat__user');
    container.dataset.userId = item.id;

    const name = document.createElement('span');
    name.textContent = item.name;

    container.append(name);
    return container;
  }

  static createMessageCard(item) {
    const container = document.createElement('div');
    container.classList.add('message__container');

    if (item.yourself) {
      container.classList.add('message__container-yourself');
    } else {
      container.classList.add('message__container-interlocutor');
    }

    const headerEl = document.createElement('div');
    headerEl.classList.add('message__header');
    const headerContentEl = document.createElement('span');

    const date = VisualConstructor.createDate();
    const headerText = `${item.userName}, ${date}`;
    headerContentEl.textContent = headerText;

    const message = document.createElement('div');
    message.textContent = item.message;

    headerEl.append(headerContentEl);
    container.append(headerEl, message);
    return container;
  }
}
