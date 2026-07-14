/**
 * CompanyKhoja - Export Composable
 * Handles CSV, JSON, clipboard, and print exports
 */

import type { Company, ExportOptions } from '~/types'

export function useExport() {
  function exportToCSV(companies: Company[], filename = 'companies.csv'): void {
    const headers = [
      'ID',
      'Registration Number',
      'Name (English)',
      'Name (Nepali)',
      'Registration Date',
      'Company Type',
      'Ownership',
      'Address',
      'Province',
      'District',
      'Municipality',
      'Rokka Status',
      'Category',
    ]

    const rows = companies.map((c) => [
      c.id,
      c.registrationNumber,
      c.nameEnglish,
      c.nameNepali,
      c.registrationDate,
      c.companyType,
      c.ownership,
      c.address,
      c.province,
      c.district,
      c.municipality,
      c.rokkaStatus,
      c.category,
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    downloadFile(csvContent, filename, 'text/csv')
  }

  function exportToJSON(companies: Company[], filename = 'companies.json'): void {
    const jsonContent = JSON.stringify(companies, null, 2)
    downloadFile(jsonContent, filename, 'application/json')
  }

  async function copyToClipboard(companies: Company[]): Promise<boolean> {
    try {
      const text = companies
        .map((c) => `${c.nameEnglish} - Reg: ${c.registrationNumber} - ${c.address}`)
        .join('\n')
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }

  function printCompanies(companies: Company[]): void {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>CompanyKhoja - Print</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #1e3a8a; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #1e3a8a; color: white; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>CompanyKhoja - Company List</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <p>Total: ${companies.length} companies</p>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Reg. No</th>
              <th>Type</th>
              <th>Address</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${companies
              .map(
                (c, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${c.nameEnglish}</td>
                <td>${c.registrationNumber}</td>
                <td>${c.companyType}</td>
                <td>${c.address}</td>
                <td>${c.rokkaStatus}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>Data sourced from Office of Company Registrar (OCR), Nepal</p>
          <p>https://companykhoja.ngp.com.np</p>
        </div>
        <script>window.onload = () => { setTimeout(() => window.print(), 500); };</script>
      </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
  }

  function downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  function exportCompanies(companies: Company[], options: ExportOptions): void {
    switch (options.format) {
      case 'csv':
        exportToCSV(companies, options.filename || 'companies.csv')
        break
      case 'json':
        exportToJSON(companies, options.filename || 'companies.json')
        break
      case 'clipboard':
        copyToClipboard(companies)
        break
      case 'print':
        printCompanies(companies)
        break
    }
  }

  return {
    exportToCSV,
    exportToJSON,
    copyToClipboard,
    printCompanies,
    exportCompanies,
  }
}
