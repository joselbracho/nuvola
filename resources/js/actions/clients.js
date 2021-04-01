export const getClients = (page, params = {}) => dispatch => {
    return window.axios.get('/api/clients', {
      params: {
        page: page,
        search: params.hasOwnProperty('search') && params.search ? params.search : null,
        order_by: params.hasOwnProperty('order_by') && params.order_by ? params.order_by : 'id',
        order_type: params.hasOwnProperty('order_type') && params.order_type ? params.order_type : 'desc',
        closure: params.hasOwnProperty('closure') && params.closure ? params.closure : null,
      }
    })
    .then(({ data: { data, links, meta } }) => Promise.resolve({ data, links, meta }))
    .catch(error => {
      return Promise.reject(error);
    });
  };
  
  export const createClient = data => dispatch => {
    return window.axios.post('/api/clients/create', data) 
      .then(({ data: { data, meta } }) => {
      return Promise.resolve({ data, meta });
    }).catch(error => {
      return Promise.reject(error);
    });
  };
  
  export const getClient = (id) => dispatch => {
      return window.axios.get(`/api/clients/${id}`)
        .then(({ data: { data, meta } }) => Promise.resolve({ data, meta }))
        .catch(error => {
          return Promise.reject(error);
      });
  };
  
  export const updateClient = (id, data) => dispatch => {
    return window.axios.post(`/api/clients/update/${id}`, data) 
      .then(({ data: { data, meta } }) => {
      return Promise.resolve({ data, meta });
    }).catch(error => {
      return Promise.reject(error);
    });
  };
  
  export const deleteClient = id => dispatch => {
      return window.axios.post(`/api/clients/delete/${id}`)
        .then(({ data: { data, meta } }) => {
        return Promise.resolve({ data, meta });
      }).catch(error => {
        return Promise.reject(error);
      });
  };

  export const getImage = (id) => dispatch => {
    return window.axios.get(`/api/clients/${id}/getImage?base64=true`)
      .then(({ data: { data, meta } }) => Promise.resolve({ data, meta }))
      .catch(error => {
        return Promise.reject(error);
    });
};
  