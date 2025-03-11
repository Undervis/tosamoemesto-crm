import type { Router } from 'vue-router'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toastification'

class gProps {
  private _authToken: string = ""

  set authToken(value: string) {
    this._authToken = value
  }

  getApiUrl(): string {
    return "http://" + document.location.hostname + ":7000/"
  }

  getAuthHeader(): object {
    return { headers: { Authorization: `Token ${this._authToken}` } }
  }

  crud = {
    create: (endPoint: string, data: object) => {
      axios.post(this.getApiUrl() + endPoint, data, this.getAuthHeader()).then(r => {
        return r.data
      }).catch(err => {
        useToast().error(err.message)
      })
    },
    read: (endPoint: string) => {
      axios.get(this.getApiUrl() + endPoint, this.getAuthHeader()).then(r => {
        return r.data
      }).catch(err => {
        useToast().error(err.message)
      })
    },
    update: (endPoint: string, data: object) => {
      axios.patch(this.getApiUrl() + endPoint, data, this.getAuthHeader()).then(r => {
        return r.data
      }).catch(err => {
        useToast().error(err.message)
      })
    },
    delete: (endPoint: string) => {
      axios.delete(this.getApiUrl() + endPoint, this.getAuthHeader()).then(r => {
        return r.data
      }).catch(err => {
        useToast().error(err.message)
      })
    }
  }
}

export default new gProps()
