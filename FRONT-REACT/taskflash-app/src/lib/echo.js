import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

let echoInstance = null

export function getEcho() {
  if (!echoInstance) {
    echoInstance = new Echo({
      broadcaster: 'reverb',
      key: import.meta.env.VITE_REVERB_APP_KEY,
      wsHost: import.meta.env.VITE_REVERB_HOST,
      wsPort: 8080, 
      wssPort: 8080,
      forceTLS: false,
      enabledTransports: ['ws'],
      authorizer: (channel) => {
        return {
          authorize: (socketId, callback) => {
            const token = localStorage.getItem('token')
            fetch(`http://${import.meta.env.VITE_REVERB_HOST}:8000/broadcasting/auth`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                socket_id: socketId,
                channel_name: channel.name,
              }),
            })
              .then(res => {
                if (!res.ok) throw new Error('Erreur d\'authentification');
                return res.json();
              })
              .then(data => callback(null, data))
              .catch(err => callback(err))
          }
        }
      },
    })
  }
  return echoInstance
}

export function resetEcho() {
  if (echoInstance) {
    echoInstance.disconnect()
    echoInstance = null
  }
}