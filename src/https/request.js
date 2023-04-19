import axios from 'axios';
import store from '@/store';
import { message } from '@u/resetMessage';
import { MessageBox } from 'element-ui';
// 记录请求的状态码
const isDdevelopment = process.env.NODE_ENV === 'development';
const baseURL = `${process.env.VUE_APP_BASE_API}`;
const service = axios.create({ baseURL, timeout: 30000 });
let messageBox = null;
// let recordCode = null;
// 请求拦截
service.interceptors.request.use(
  (config) => {
    // 自动携带token
    if (store.getters.token) {
      config.headers.Authorization = `Bearer ${store.getters.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应
service.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      const { code, message: note } = response.data;
      if (code === '10000') {
        return Promise.resolve(response);
      } else {
        if (['20004', '10010'].includes(code)) {
          // 当一个页面调用多个接口的时候 这个地方就会出现多次messageBox
          if (messageBox) MessageBox.close();
          messageBox = MessageBox.alert('登录过期，请重新登录', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            showClose: false,
            type: 'warning',
          }).then(() => {
            messageBox = null;
            store.dispatch('user/resetToken').then(() => {
              location.reload();
            });
          });
        } else if (['10500', '10002'].includes(code)) {
          message.error(note);
        }
        return Promise.reject(response);
      }
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    // 在本地调试的时候新增判断只能本地使用
    if (error.response) {
      if (isDdevelopment) {
        message({
          message: error.message,
          type: 'error',
          duration: 2000,
        });
      }
    } else {
      const isTimeout = error.message.includes('timeout');
      message.error(isTimeout ? '请求超时，请检查网络是否连接正常' : '请求失败');
    }
    return Promise.reject(error.response);
  },
);

// get
export function get(url, params) {
  return new Promise((resolve, reject) => {
    service
      .get(url, { params })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}

export function post(url, params, headers = false) {
  return new Promise((resolve, reject) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, value);
    });
    service
      .post(url, headers ? queryParams : params)
      .then((res) => {
        resolve(res.data.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}
