/* global cozy, initKonnectors, initFolders */

import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'

import { I18n } from './plugins/i18n'
import CollectStore, { Provider } from './lib/CollectStore'

import IntentService from './containers/IntentService'

import './styles/services.styl'

const lang = document.documentElement.getAttribute('lang') || 'en'
const context = window.context || 'cozy'

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[role=application]')
  const data = root.dataset
  cozy.client.init({
    cozyURL: '//' + data.cozyDomain,
    token: data.cozyToken
  })

  // store
  const store = new CollectStore(initKonnectors, initFolders, context)

  render((
    <Provider store={store}>
      <I18n context={context} lang={lang}>
        <IntentService window={window} data={data} />
      </I18n>
    </Provider>
  ), document.querySelector('[role=application]'))
})
