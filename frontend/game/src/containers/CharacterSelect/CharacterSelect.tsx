import React from 'react'
import { useForm } from 'react-hook-form'
import { PlayerData } from '../../App'

interface CharacterSelectProps {
  sendMessage: (playerData: PlayerData) => void
}

const CharacterSelect: React.FC<CharacterSelectProps> = ({ sendMessage }) => {
  const { register, handleSubmit } = useForm<PlayerData>()

  const onSubmit = (data: PlayerData) => {
    sendMessage({ ...data, ready: true })
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <label className="label" htmlFor="name">
            Name
          </label>
          <input
            className=""
            id="name"
            {...register('name', { required: true })}
          />
        </div>

        <button type="submit" className="btn-primary">
          Ready
        </button>
      </form>
    </div>
  )
}

export default CharacterSelect
