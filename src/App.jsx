import { useState } from 'react'
import axios from "axios"
import './App.css'

function App() {

  const testTheRequest = async () => {
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${import.meta.env.VITE_SERVER_URL}/api/user`,
        headers: {}
      };

      const response = await axios.request(config)
      console.log("response ", response.data);

    } catch (error) {
      console.error("Error while testing the route ", error);
    }
  }
  return (
    <>
      <div>
        <button onClick={testTheRequest}>Test API</button>
      </div>
    </>
  )
}

export default App
