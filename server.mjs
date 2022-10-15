import path from 'path'
import express from 'express'
import fs from 'fs'
import { createServer } from 'vite'

const resolve = (p) => path.resolve(p)

const app = express()

const vite = await createServer({
  root: resolve('.'),
  logLevel: 'info',
  server: {
    middlewareMode: 'ssr',
    watch: {
      usePolling: true,
      interval: 100
    }
  }
})

app.use(vite.middlewares)

app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl || req.url
    const template = await vite.transformIndexHtml(url, fs.readFileSync(resolve('index.html'), 'utf-8'))
    const { render } = await vite.ssrLoadModule('/src/entry-server.ts')

    const renderRes = await render(url)

    const html = template.replace(`<!--app-html-->`, renderRes.html)

    // console.log(html)

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e) {
    vite && vite.ssrFixStacktrace(e)
    console.error(e.stack)
    res.status(500).end(e.stack)
  }
})

const port = 3000

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
