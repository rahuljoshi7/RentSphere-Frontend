import { useState } from 'react'
import { Download, BarChart3, Users, Wrench, CreditCard, Building2 } from 'lucide-react'
import { reportService } from '../../services/reportService'
import { useFileDownload } from '../../hooks/useFileDownload'
import toast from 'react-hot-toast'

const REPORTS = [
  { key: 'revenue',       label: 'Revenue Report',        icon: BarChart3,  needsDates: true,  needsMonth: false, color: 'text-success-600 bg-success-50' },
  { key: 'occupancy',     label: 'Occupancy Report',      icon: Building2,  needsDates: false, needsMonth: false, color: 'text-blue-600 bg-blue-50' },
  { key: 'rentCollection',label: 'Rent Collection Report',icon: CreditCard, needsDates: false, needsMonth: true,  color: 'text-purple-600 bg-purple-50' },
  { key: 'tenant',        label: 'Tenant Report',         icon: Users,      needsDates: false, needsMonth: false, color: 'text-orange-600 bg-orange-50' },
  { key: 'maintenance',   label: 'Maintenance Report',    icon: Wrench,     needsDates: true,  needsMonth: false, color: 'text-red-600 bg-red-50' },
]

export default function ReportsPage() {
  const { download } = useFileDownload()
  const [generating, setGenerating] = useState(null)
  const [form, setForm] = useState({
    startDate: '', endDate: '', month: new Date().getMonth() + 1,
    year: new Date().getFullYear(), format: 'PDF'
  })

  const handleGenerate = async (report) => {
    setGenerating(report.key)
    try {
      let params = { format: form.format }
      if (report.needsDates) { params.startDate = form.startDate; params.endDate = form.endDate }
      if (report.needsMonth) { params.month = form.month; params.year = form.year }
      const res = await reportService[report.key](params)
      const ext = form.format === 'PDF' ? 'pdf' : 'xlsx'
      download(res.data, report.key + '_report.' + ext)
    } catch { toast.error('Failed to generate report') }
    finally  { setGenerating(null) }
  }

  return (
    <div className="space-y-6">
      <div className="page-header"><h1 className="page-title">Reports</h1></div>
      <div className="card">
        <h3 className="mb-4">Parameters</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div><label className="label">Start Date</label>
            <input type="date" className="input" value={form.startDate} onChange={e => setForm(f => ({...f, startDate: e.target.value}))} /></div>
          <div><label className="label">End Date</label>
            <input type="date" className="input" value={form.endDate} onChange={e => setForm(f => ({...f, endDate: e.target.value}))} /></div>
          <div><label className="label">Month</label>
            <select className="input" value={form.month} onChange={e => setForm(f => ({...f, month: e.target.value}))}>
              {Array.from({length:12},(_,i)=><option key={i+1} value={i+1}>{new Date(0,i).toLocaleString('default',{month:'long'})}</option>)}
            </select></div>
          <div><label className="label">Year</label>
            <input type="number" className="input" value={form.year} min="2020" onChange={e => setForm(f => ({...f, year: e.target.value}))} /></div>
          <div><label className="label">Format</label>
            <select className="input" value={form.format} onChange={e => setForm(f => ({...f, format: e.target.value}))}>
              <option value="PDF">PDF</option><option value="EXCEL">Excel</option>
            </select></div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORTS.map(report => {
          const Icon = report.icon
          const isGen = generating === report.key
          return (
            <div key={report.key} className="card flex items-start gap-4">
              <div className={"w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 " + report.color}>
                <Icon size={22} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{report.label}</h3>
                <p className="text-xs text-neutral-400 mb-3">
                  {report.needsDates ? 'Uses start & end date' : report.needsMonth ? 'Uses month & year' : 'Current snapshot'}
                </p>
                <button onClick={() => handleGenerate(report)} disabled={isGen} className="btn btn-primary btn-sm w-full justify-center">
                  {isGen ? 'Generating…' : <><Download size={14} /> Download {form.format}</>}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
