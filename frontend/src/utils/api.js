class Api {
  constructor({ baseUrl, headers }) {
    this._headers = headers;
    this._baseUrl = baseUrl;// тело конструктора
  }

  _setHeaders() {
    const headers = {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('jwt')}`
    }
    return headers;
  }

  setToken(token) {
    this._headers.Authorization = `Bearer ${token}`;
  }

  _getResponseData(res) {
    if (!res.ok) {
        return Promise.reject(`Ошибка: ${res.status}`); 
    }
    return res.json();
  } 

  getProfile() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._setHeaders()
    })
    .then(this._getResponseData)
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._setHeaders()
    })
    .then(this._getResponseData)
  }

  editProfile(name, about) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._setHeaders(),
      body: JSON.stringify({
        name,
        about
      })
    })
    .then(this._getResponseData)
  }

  addCard(name, link) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._setHeaders(),
      body: JSON.stringify({
        name,
        link
      })
    })
    .then(this._getResponseData)
  }

  deleteCard(_id) {
    return fetch(`${this._baseUrl}/cards/${_id}`, {
      method: "DELETE",
      headers: this._setHeaders()
    })
    .then(this._getResponseData)
  }

  addLike(_id) {
    return fetch(`${this._baseUrl}/cards/${_id}/likes`, {
      method: "PUT",
      headers: this._setHeaders()
    })
    .then(this._getResponseData)
  }

  deleteLike(_id) {
    return fetch(`${this._baseUrl}/cards/${_id}/likes`, {
      method: "DELETE",
      headers: this._setHeaders()
    })
    .then(this._getResponseData)
  }

  changeLikeCardStatus(_id, isLiked) {
    if (isLiked) {
      return this.addLike(_id);
    } else {
      return this.deleteLike(_id);
    }    
  }

  editAvatar(avatar) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._setHeaders(),
      body: JSON.stringify({
        avatar
      })
    })
    .then(this._getResponseData)
  }
}

export const api = new Api({
  // baseUrl: 'http://localhost:3000',
  baseUrl: 'https://back.mesto.elizaveta-m123.nomoreparties.sbs',
  headers: {
    'Content-Type': 'application/json'
  }
});