import React from 'react'
import { useForm } from 'react-hook-form'
import { PlayerData } from '../../App'

interface CharacterSelectProps {
  sendMessage: (playerData: PlayerData) => void
}

const CharacterSelect: React.FC<CharacterSelectProps> = ({ sendMessage }) => {
  const { register, handleSubmit } = useForm<PlayerData>()

  const onSubmit = (data: PlayerData) => {
    console.log('FORM: ', data)
    sendMessage({ ...data })
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <div>
            <p>Please select your character</p>
            <label htmlFor="penguin">Penguin</label>
            <input
              type="radio"
              id="penguin"
              value={1}
              {...register('character', { required: true })}
            />
            <label htmlFor="snowman">Snowman</label>
            <input
              type="radio"
              id="snowman"
              value={2}
              {...register('character', { required: true })}
            />
            <label htmlFor="dalek">Dalek</label>
            <input
              type="radio"
              id="dalek"
              value={3}
              {...register('character', { required: true })}
            />
          </div>

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
