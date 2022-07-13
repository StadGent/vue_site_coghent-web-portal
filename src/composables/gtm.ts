export const setScriptTag = (_tag: string) => {
  const tagScript = document.createElement('script')
  tagScript.setAttribute(`async`, `true`)
  tagScript.setAttribute(`src`, `https://www.googletagmanager.com/gtag/js?id=${_tag}`)
  document.head.after(tagScript)
}

export const setDataLayer = (_GATag: string) => {
  const tagScript = document.createElement('script')
  tagScript.setAttribute(`type`, `text/javascript`)
  const content = document.createTextNode(`window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());

  gtag("config", "${_GATag}");`)
  tagScript.appendChild(content)
  document.head.after(tagScript)
}

export const addGmtTaG = (_gtmId: string) => {
  const tagScript = document.createElement('script')
  tagScript.setAttribute(`type`, `text/javascript`)
  const content = document.createTextNode(`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${_gtmId}');`)
  tagScript.appendChild(content)
  document.head.after(tagScript)
}

export const addIframeToBody = (_gtmId: string) => {
  const noScript = document.createElement('no-script')
  const iframe = document.createElement('iframe')
  iframe.setAttribute(`src`, `https://www.googletagmanager.com/ns.html?id=${_gtmId}`)
  iframe.style.height = `0`
  iframe.style.height = `0`
  iframe.style.display = `none`
  iframe.style.visibility = `hidden`
  noScript.appendChild(iframe)
  document.body.appendChild(noScript)
}

export const addGoogleData = (_gtmId: string | undefined, _gaId: string | undefined) => {
  if (_gaId !== undefined && _gaId !== 'false') {
    setDataLayer(_gaId)
    setScriptTag(_gaId)
  }
  if (_gtmId !== undefined && _gtmId !== 'false') {
    addGmtTaG(_gtmId)
    addIframeToBody(_gtmId)
    // setScriptTag(_gtmId)
  }
}
