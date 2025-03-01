import type { Router } from 'vue-router'
import { useRouter } from 'vue-router'
import axios from 'axios'

class gProps {
  getApiUrl(): string  {
    return import.meta.env.VITE_API_URL;
  }

  getAuthHeader(token: string): object {
    return {headers: {'Authorization': `Token ${token}`}};
  }

  http(method: string = 'GET', router: Router = useRouter(), params: object = {}, query: object = {}, dataToSend: object = {}, authToken: string = ""): object {
    let targetUrl = this.getApiUrl() + router.currentRoute.value.meta.apiEndPoint + params ? params.id.toString() : ""
    axios({method: method, url: targetUrl, params: params, data: dataToSend, headers: this.getAuthHeader(authToken)}).then((response) => {
      console.log('response', response.data)
      return response.data
    }).catch((error) => {
      console.error(error)
    })
    return {}
  }
}

export default new gProps;
