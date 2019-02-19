import axios from 'axios'

export default axios.create({
  baseURL: 'https://www.mmdb.online/api/v2'
})