import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs'

const postParams = {
  page: parseAsInteger
    .withDefault(1)
    .withOptions({ clearOnDefault: true, shallow: false }),
  search: parseAsString
    .withDefault('')
    .withOptions({ clearOnDefault: true, shallow: false }),
}

export const usePostParams = () => {
  return useQueryStates(postParams)
}
