import type { APIRoute } from 'astro'
import { Resend } from 'resend'

const resend = new Resend(import.meta.env.SECRET_RESEND_APIKEY)
const to = import.meta.env.SECRET_RESEND_TO

interface Body {
  'first-name': string
  'last-name': string
  email: string
  telephone: string
  adults: number
  children: number
  infants: number
  month: string
}

export const POST: APIRoute = async ({ request, url }) => {
  const origin = request.headers.get('origin')
  if (url.origin !== origin) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = (await request.json()) as Body

  body.month = new Date(body.month).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  })

  const { error } = await resend.emails.send({
    from: 'Contacto Cinemark <contacto-cinemark@enjoyittour.online>',
    to: [to],
    subject: 'Contacto Cinemark',
    html: `
        <h1>Contacto Cinemark</h1>
        <p>Nombre: ${body['first-name']} ${body['last-name']}</p>
        <p>Email: ${body.email}</p>
        <p>Telefono: ${body.telephone}</p>
        <p>Adultos: ${body.adults}</p>
        <p>Niños: ${body.children}</p>
        <p>Infantes: ${body.infants}</p>
        <p>Mes: ${body.month}</p>
    `,
  })

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 })
  }

  return new Response()
}
