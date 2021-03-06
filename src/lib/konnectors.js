/* konnector lib ready to be added to cozy-client-js */
const KONNECTORS_DOCTYPE = 'io.cozy.konnectors'
const KONNECTORS_RESULT_DOCTYPE = 'io.cozy.konnectors.result'

const KONNECTOR_STATE_READY = 'ready'

export const JOB_STATE = {
  READY: 'ready',
  ERRORED: 'errored',
  DONE: 'done'
}

export function addAccount (cozy, konnector, account) {
  if (!konnector.accounts) konnector.accounts = []
  konnector.accounts.push(account)
  return Promise.resolve(konnector)
}

export function fetchManifest (cozy, source) {
  return source
    ? cozy.fetchJSON('GET', `/konnectors/manifests?Source=${encodeURIComponent(source)}`)
    : Promise.reject(new Error('Source konnector is unavailable'))
}

let cachedSlugIndex
function getSlugIndex (cozy) {
  return cachedSlugIndex
    ? Promise.resolve(cachedSlugIndex)
      : cozy.data.defineIndex(KONNECTORS_DOCTYPE, ['slug'])
          .then(index => {
            cachedSlugIndex = index
            return index
          })
}

export function findBySlug (cozy, slug) {
  if (!slug) throw new Error('Missing `slug` parameter')

  return getSlugIndex(cozy)
    .then(index => cozy.data.query(index, {selector: {slug: slug}}))
    .then(list => list.length ? list[0] : null)
}

export function unlinkFolder (cozy, konnector, folderId) {
  return !konnector._id
    /**
     * In case of a konnector set in the app and not in the platform,
     * there's no available `_id`. So we should returns an error, but here
     * it's just a warning, that doesn't implies anything, so we `resolve` and
     * not `reject`, because of what the next steps of deleting accounts will
     * fail.
     */
    ? Promise.resolve(new Error("konnector doesn't have available id"))
    : cozy.fetchJSON(
      'DELETE',
      `/data/io.cozy.konnectors/${encodeURIComponent(konnector._id)}/relationships/references`,
      {
        data: [
          {
            type: 'io.cozy.files',
            id: folderId
          }
        ]
      }
    )
    .then(() => deleteFolderPermission(cozy, konnector))
}

export function getAllErrors (cozy) {
  return cozy.data.defineIndex(KONNECTORS_RESULT_DOCTYPE, ['state'])
  .then(index => cozy.data.query(index, {selector: {state: 'errored'}}))
}

export function install (cozy, konnector, timeout = 120000) {
  ['slug', 'source'].forEach(property => {
    if (!konnector[property]) throw new Error(`Missing '${property}' property in konnector`)
  })

  const { slug, source } = konnector

  return findBySlug(cozy, slug)
    .catch(error => {
      if (error.status !== '404') throw error
      return null
    })
    .then(konnector => konnector
      // Need JSONAPI format
      ? cozy.data.find(KONNECTORS_DOCTYPE, konnector._id)
        : cozy.fetchJSON('POST', `/konnectors/${slug}?Source=${encodeURIComponent(source)}`))
    .then(konnector => waitForKonnectorReady(cozy, konnector, timeout))
}

// monitor the status of the connector and resolve when the connector is ready
function waitForKonnectorReady (cozy, konnector, timeout) {
  return new Promise((resolve, reject) => {
    const idTimeout = setTimeout(() => {
      reject(new Error('Konnector installation timed out'))
    }, timeout)

    const idInterval = setInterval(() => {
      cozy.data.find(KONNECTORS_DOCTYPE, konnector._id)
        .then(konnectorResult => {
          if (konnectorResult.state === KONNECTOR_STATE_READY) {
            clearTimeout(idTimeout)
            clearInterval(idInterval)
            resolve(konnector)
          }
        })
        .catch(error => {
          clearTimeout(idTimeout)
          clearInterval(idInterval)
          reject(error)
        })
    }, 1000)
  })
}

function patchFolderPermission (cozy, konnector, folderId = null) {
  const slug = konnector.attributes ? konnector.attributes.slug : konnector.slug
  const saveFolder = folderId ? {type: 'io.cozy.files', values: [folderId]} : {}

  return cozy.fetchJSON('PATCH', `/permissions/konnectors/${encodeURIComponent(slug)}`, {
    data: {
      attributes: {
        permissions: {
          saveFolder: saveFolder
        }
      }
    }
  })
}

export function addFolderPermission (cozy, konnector, folderId) {
  return patchFolderPermission(cozy, konnector, folderId)
}

export function deleteFolderPermission (cozy, konnector) {
  return patchFolderPermission(cozy, konnector)
}

export function run (cozy, konnector, account, disableSuccessTimeout = false, successTimeout = 30 * 1000) {
  const slug = konnector.attributes ? konnector.attributes.slug : konnector.slug
  if (!slug) {
    throw new Error('Missing `slug` parameter for konnector')
  }
  if (!account._id) throw new Error('Missing `_id` parameter for account')
  if (!account.folderId) throw new Error('Missing `folderId` parameter for account')

  return cozy.jobs.create('konnector', {
    konnector: slug,
    account: account._id,
    folder_to_save: account.folderId
  }, {
    priority: 10,
    max_exec_count: 1
  })
  .then(job => waitForJobFinished(cozy, job, account, disableSuccessTimeout, successTimeout))
}

// monitor the status of the connector and resolve when the connector is ready
function waitForJobFinished (cozy, job, account, disableSuccessTimeout, successTimeout) {
  return new Promise((resolve, reject) => {
    let idTimeout
    let idInterval

    if (!disableSuccessTimeout) {
      idTimeout = setTimeout(() => {
        clearInterval(idInterval)
        resolve(job)
      }, successTimeout)
    }

    idInterval = setInterval(() => {
      cozy.fetchJSON('GET', `/jobs/${job._id}`)
        .then(job => {
          if (job.attributes.state === JOB_STATE.ERRORED) {
            if (idTimeout) {
              clearTimeout(idTimeout)
            }

            clearInterval(idInterval)
            reject(new Error(job.attributes.error))
          }

          if (job.attributes.state === JOB_STATE.READY) {
            if (idTimeout) {
              clearTimeout(idTimeout)
            }

            clearInterval(idInterval)
            resolve(job)
          }
        })
        .catch(error => {
          if (idTimeout) {
            clearTimeout(idTimeout)
          }

          clearInterval(idInterval)
          reject(error)
        })
    }, 1000)
  })
}
