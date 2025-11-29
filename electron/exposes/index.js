import electron from './electron/index.js'
import fileApi from './files/index.js'
import path from 'node:path'
import configs from '$electron/configs/index.js'
export default {
  init(expose) {
    expose('configs', {
      ...configs
    });
    expose('nodePath', path);
    expose('electron', {
      ...electron()
    });
    expose('fileApi', {
      ...fileApi
    })
  },
}