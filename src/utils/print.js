export function print(content) {
  let iframe = document.body.appendChild(document.createElement('iframe'))
  iframe.style.display = 'none'
  let w = iframe.contentWindow || iframe.contentDocument
  let doc = iframe.contentDocument || iframe.contentWindow.document
  doc.open()
  doc.write(content)
  doc.close()
  w.document.execCommand('print', false, null)
  w.close()
  document.body.removeChild(iframe)
}

export function printTable(config) {
  let { data, columns, title } = config
  let props = columns.map(({ prop }) => prop)
  let rows = data.map(item => props.map(prop => item[prop] || ''))
  let content = `
        <style>${style}</style>
        ${title ? `<title>${title}</title>` : ''}
        <table cellpadding="0" cellspacing="0">
            <thead>
                <tr>
                ${columns.map(({ label }) => `<th>${label || ''}</th>`)?.join('')}
                </tr>
            </thead>
            <tbody>
            ${rows.map(row => `<tr>${row.map(col => `<td>${col}</td>`).join('')}</tr>`).join('')}
            </tbody>
        </table>`
  print(content)
}

const style = `
    table {
        width: 100%;
    }
    th, td {
        text-align: center;
        border-top: 1px solid #888;
        border-left: 1px solid #888;
        padding: 8px 2px;
    }
    th:last-child, td:last-child {
        border-right: 1px solid #888;
    }
    thead th {
        font-size: 13px;
        color: #909099;
    }
    tbody tr td {
        color: #595b5f;
    }
    tbody tr:last-child td {
        border-bottom: 1px solid #888;
    }`
