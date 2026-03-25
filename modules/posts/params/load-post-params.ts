import { parseAsInteger, parseAsString, createLoader } from 'nuqs/server'

const postParams = {
  page: parseAsInteger
    .withDefault(1)
    .withOptions({ clearOnDefault: true, shallow: false }),
  search: parseAsString
    .withDefault('')
    .withOptions({ clearOnDefault: true, shallow: false }),
}

export const loadSearchPostParams = createLoader(postParams)
