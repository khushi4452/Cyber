// employee-app/src/services/api.js
const BASE_URL = 'http://localhost:5000/api/device'

export async function createEmployeeFolder(employeeName) {
  const res = await fetch(`${BASE_URL}/create-employee-folder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeName })
  })
  return res.json()
}

export async function listFiles(employeeName) {
  const res = await fetch(`${BASE_URL}/files?employeeName=${employeeName}`)
  return res.json()
}

export async function getFileContent(employeeName, file) {
  const res = await fetch(`${BASE_URL}/file-content?employeeName=${employeeName}&file=${file}`)
  return res.json()
}
