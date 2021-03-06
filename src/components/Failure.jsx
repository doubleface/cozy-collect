import React from 'react'
import { translate } from '../plugins/i18n'

const reload = () => {
  window.location.reload()
}

const Failure = ({ t, errorType }) => (
  <div className='con-error'>
    <h2>{ t(`error.${errorType}`) }</h2>
    <p>
      <button
        role='button'
        className='coz-btn coz-btn--regular'
        onClick={reload}
      >
        { t('error.button.reload') }
      </button>
    </p>
  </div>
)

export default translate()(Failure)
