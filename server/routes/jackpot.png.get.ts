export default defineEventHandler(async (event) => {
  const image = await useStorage('assets:server').getItemRaw('jackpot.png')
  if (!image) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Jackpot image not found',
    })
  }

  setHeader(event, 'content-type', 'image/png')
  return image
})
