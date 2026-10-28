import { getVisits } from '~~/server/utils/visitLog'

export default defineEventHandler(() => getVisits())
