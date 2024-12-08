import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { CHARACTER_OPTIONS } from '../../defs'
import type { CharacterSelectData } from '../../types'

import './CharacterSelect.scss'

interface CharacterSelectProps {
  sendMessage: (playerData: CharacterSelectData) => void
  updatePlayer: (PlayerData: CharacterSelectData) => void
}

const CharacterSelect: React.FC<CharacterSelectProps> = ({
  sendMessage,
  updatePlayer,
}) => {
  const { register, handleSubmit, watch } = useForm<CharacterSelectData>()

  const onSubmit = (data: CharacterSelectData) => {
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
        <fieldset>
          <legend>Character</legend>
          <div className="character-select__options">
            {Object.keys(CHARACTER_OPTIONS).map((characterKey, index) => (
              <div className="form__input-row" key={characterKey}>
                <input
                  type="radio"
                  id={characterKey}
                  value={index + 1}
                  defaultChecked={index === 0 ? true : false}
                  {...register('character', { required: true })}
                />
                <label htmlFor={characterKey}>
                  {CHARACTER_OPTIONS[characterKey]}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
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
