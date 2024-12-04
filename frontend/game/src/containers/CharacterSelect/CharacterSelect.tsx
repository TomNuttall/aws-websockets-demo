import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { PlayerData } from '../../App'

import './CharacterSelect.scss'

interface CharacterSelectProps {
  sendMessage: (playerData: PlayerData) => void
  updatePlayer: (PlayerData: PlayerData) => void
}

const CharacterSelect: React.FC<CharacterSelectProps> = ({
  sendMessage,
  updatePlayer,
}) => {
  const { register, handleSubmit, watch } = useForm<PlayerData>()

  const onSubmit = (data: PlayerData) => {
    sendMessage({ ...data })
  }

  const name = watch('name')
  const character = watch('character')
  const tint = watch('tint')

  useEffect(() => {
    updatePlayer({ name, character, tint })
  }, [name, character, tint])

  return (
    <div className="character-select">
      <form onSubmit={handleSubmit(onSubmit)} className="form panel">
        <h1>Create your racer</h1>
        <div className="form__input">
          <label className="label" htmlFor="name">
            Name
          </label>
          <input id="name" {...register('name', { required: true })} />
        </div>
        <div>
          <div className="character-select__options">
            <div className="form__input-row">
              <input
                type="radio"
                id="penguin"
                value={1}
                defaultChecked={true}
                {...register('character', { required: true })}
              />
              <label htmlFor="penguin">Penguin</label>
            </div>
            <div className="form__input-row">
              <input
                type="radio"
                id="snowman"
                value={2}
                {...register('character', { required: true })}
              />
              <label htmlFor="snowman">Snowman</label>
            </div>
            <div className="form__input-row">
              <input
                type="radio"
                id="dalek"
                value={3}
                {...register('character', { required: true })}
              />
              <label htmlFor="dalek">Dalek</label>
            </div>
          </div>
          <div className="character-select__options">
            <div className="form__input-row">
              <input
                type="radio"
                id="hippo"
                value={4}
                {...register('character', { required: true })}
              />
              <label htmlFor="hippo">Hippo</label>
            </div>
            <div className="form__input-row">
              <input
                type="radio"
                id="reindeer"
                value={5}
                {...register('character', { required: true })}
              />
              <label htmlFor="reindeer">Reindeer</label>
            </div>
            <div className="form__input-row">
              <input
                type="radio"
                id="grinch"
                value={6}
                {...register('character', { required: true })}
              />
              <label htmlFor="grinch">Grinch</label>
            </div>
          </div>
        </div>
        <div className="form__input character-select__tint">
          <label className="label" htmlFor="tint">
            Tint
          </label>
          <input
            type="color"
            id="tint"
            defaultValue={'#ffffff'}
            value={tint}
            {...register('tint', { required: true })}
          />
        </div>
        <button type="submit">Ready</button>
      </form>
    </div>
  )
}

export default CharacterSelect
