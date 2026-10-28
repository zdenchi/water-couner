import { addVisit } from '~~/server/utils/visitLog'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ path?: unknown }>(event)

  if (
    typeof body.path !== 'string' ||
    !body.path.startsWith('/') ||
    body.path.length > 2048
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid visit path',
    })
  }

  addVisit({
    ip: getRequestIP(event, { xForwardedFor: true }) ?? 'unknown',
    path: body.path,
    at: new Date().toISOString(),
  })

  setResponseStatus(event, 204)
})
