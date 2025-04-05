import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const pinataApiKey = process.env.PINATA_API_KEY
const pinataSecretApiKey = process.env.PINATA_API_SECRET

export async function uploadJSON(payload) {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`

  const res = await axios.post(url, payload, {
    headers: {
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataSecretApiKey,
    },
  })

  return res.data.IpfsHash
}

