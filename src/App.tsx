import { useEffect, useState } from 'react'
import './App.css'

import io from 'socket.io-client'
const socket = io('https://socket-server-h6q4.onrender.com')

function App() {
  const [message, setMessage] = useState<string>('')

  const [messageReceived, setMessageReceived] = useState<string>('')
  const [userCount, setUserCount] = useState(0)
  const [room, setRoom] = useState<string>()
  const [selectedPokemon, setSelectedPokemon] = useState<string>('')
  const [selections, setSelections] = useState<any>({})
  const sendMessage = () => {
    socket.emit('send_message', { message, room })
  }
  const handlePokemonSelect = (pokemon: string) => {
    setSelectedPokemon(pokemon)
    socket.emit('pokemon selection', pokemon)
  }

  const joinRoom = () => {
    if (room !== null) {
      socket.emit('join_room', room)
    }
  }
  useEffect(() => {
    socket.on('pokemon selection', data => {
      setSelections((prevSelections: any) => ({
        ...prevSelections,
        [data.id]: data.pokemon,
      }))
    })

    socket.on('receive_message', data => {
      setMessageReceived(data.message)
    })
    socket.on('user count', count => {
      setUserCount(count)
    })

    return () => {
      socket.off('user count')
    }
  }, [socket])

  return (
    <>
      <div className='join-room'>
        <h1>Join a Room</h1>
        <div className='input-group'>
          <input
            onChange={e => setRoom(e.target.value)}
            placeholder='Room ID'
          ></input>
          <button onClick={joinRoom}>Join Room</button>
        </div>
      </div>

      <div className='pokemon-selection'>
        <h1>Select your Pokémon</h1>
        <div className='buttons'>
          <button onClick={() => handlePokemonSelect('Pikachu')}>
            Pikachu
          </button>
          <button onClick={() => handlePokemonSelect('Charmander')}>
            Charmander
          </button>
        </div>
        {selectedPokemon && (
          <p className='selection'>You selected: {selectedPokemon}</p>
        )}
      </div>

      <div className='pokemon-selections'>
        <h1>Pokémon Selections</h1>
        {Object.entries(selections).map(([id, pokemon]: any) => (
          <p key={id}>
            {id}: {pokemon}
          </p>
        ))}
      </div>

      <div className='messaging'>
        <h1>Message</h1>
        <div className='input-group'>
          <input
            placeholder='Send a message'
            onChange={e => setMessage(e.target.value)}
          ></input>
          <button onClick={sendMessage}>Send a Message</button>
        </div>
        <div className='messages'>
          <h2>Messages:</h2>
          <p>{messageReceived}</p>
        </div>
        <h4>Connected Users: {userCount}</h4>
      </div>
    </>
  )
}

export default App
