type TemplateProps = {
  body: string;
  title: string;
  production: boolean;
  bundle?: {
    js: string;
    css: string;
  }
  props?: Record<string, unknown>;
}

export default function template({ body, title, production, bundle, props }: TemplateProps) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        ${production ? `<link rel="stylesheet" type="text/css" href="/build/${bundle?.css}"></link>` : ''}
      </head>
      <body>
        <div id="root">${body}</div>
        <script>window.__SERVER_PROPS__ = ${JSON.stringify(props || {})}</script>
        ${production ? `<script src="/build/${bundle?.js}"></script>` : ''}
        ${!production ? 
          `<script type="module">
            import RefreshRuntime from 'http://localhost:5173/@react-refresh'
            RefreshRuntime.injectIntoGlobalHook(window)
            window.$RefreshReg$ = () => {}
            window.$RefreshSig$ = () => (type) => type
            window.__vite_plugin_react_preamble_installed__ = true
          </script>
          <script type="module" src="http://localhost:5173/@vite/client"></script>
          <script type="module" src="http://localhost:5173/src/entry.client.tsx"></script>` : ''}
      </body>
    </html>
  `;
}