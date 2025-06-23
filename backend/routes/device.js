// routes/device.js
const express = require('express')
const path = require('path')
const fs = require('fs')
const router = express.Router()

// Import your existing utility functions
const { getOSInfo, checkAntivirus } = require('../utils/systemCheck')
const { createSecureFolder, folderPath } = require('../utils/folderControl')

// ===================
// Existing Device Check Endpoint
// ===================
router.post('/check', (req, res) => {
  const osInfo = getOSInfo()

  checkAntivirus((isAntivirusRunning) => {
    if (!isAntivirusRunning) {
      return res.status(403).json({
        success: false,
        reason: 'Antivirus not running. Please enable Windows Defender.',
      })
    }

    createSecureFolder((err) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Failed to create secure folder' })
      }

      res.json({
        success: true,
        message: 'Device check passed. Secure folder created.',
        osInfo,
        antivirus: 'Running',
        folder: folderPath,
      })
    })
  })
})

// ===================
// NEW Employee Folder Endpoints
// ===================

// 1) Create Employee Folder
router.post('/create-employee-folder', (req, res) => {
  const { employeeName } = req.body
  if (!employeeName) return res.status(400).json({ error: 'Employee name is required' })
  
  const companyRoot = path.resolve(__dirname, '../data/CompanyDrive')
  if (!fs.existsSync(companyRoot)) fs.mkdirSync(companyRoot)
  
  const employeeFolder = path.join(companyRoot, employeeName)
  if (!fs.existsSync(employeeFolder)) fs.mkdirSync(employeeFolder)

  return res.status(201).json({ message: 'Employee folder created', path: employeeFolder })
})

// 2) List files in employee folder
router.get('/files', (req, res) => {
  const { employeeName } = req.query
  if (!employeeName) return res.status(400).json({ error: 'Employee name required' })
  
  const employeeFolder = path.resolve(__dirname, '../data/CompanyDrive', employeeName)
  if (!fs.existsSync(employeeFolder)) return res.status(404).json({ error: 'Folder not found' })
  
  const files = fs.readdirSync(employeeFolder)
  res.json({ files })
})

// 3) Get file content
router.get('/file-content', (req, res) => {
  const { employeeName, file } = req.query
  if (!employeeName || !file) return res.status(400).json({ error: 'Missing params' })
  
  const filePath = path.resolve(__dirname, '../data/CompanyDrive', employeeName, file)
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' })
  
  const content = fs.readFileSync(filePath, 'utf-8')
  res.json({ content })
})

module.exports = router
