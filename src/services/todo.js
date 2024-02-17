import axios from "axios";
const API = {
    endpoint: 'http://localhost:4080'
}

async function apiAddTodo(config) {
    return await axios({
      url: API.endpoint + '/api/v1/todo/add',
      method: 'POST',
      data: { ...config.data },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async function apiGetTodos(config) {
    return await axios({
      url: API.endpoint + '/api/v1/todo/get-all',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  async function apiCompleteTask(config) {
    return await axios({
      url: API.endpoint + `/api/v1/todo/complete-task/${config.params.taskId}`,
      method: 'DELETE',
      data: {},
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  export {apiAddTodo,apiGetTodos, apiCompleteTask}