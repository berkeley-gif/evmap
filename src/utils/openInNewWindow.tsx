export const openInNewWindow = (url: string, title: string) => {
  const newWindow = window.open('', '_blank', 'width=800,height=600')
  if (newWindow) {
    newWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
        </head>
        <body>
          <iframe src="${url}" style="width: 100%; height: 100%; border: none;"></iframe>
        </body>
      </html>
    `)
    newWindow.document.close()
  }
}
