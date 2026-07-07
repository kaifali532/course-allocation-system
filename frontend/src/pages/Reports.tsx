import { useState } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { api } from '../services/api';

export default function Reports() {
  const [loading, setLoading] = useState(false);

  const downloadCSV = async () => {
    setLoading(true);
    try {
      const res = await api.get('/students?limit=10000');
      const students = res.data.data;
      
      const headers = ['Student ID', 'Name', 'Email', 'Marks', 'Category', 'Status'];
      const csvContent = [
        headers.join(','),
        ...students.map((s: any) => 
          [s.studentId, s.fullName, s.email, s.marks, s.category, s.status].join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'allocations_report.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 fade-in max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8 mt-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports & Exports</h2>
          <p className="text-slate-500">Download allocation data in various formats.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">CSV Export</h3>
          <p className="text-sm text-slate-500 mb-6">Download the complete list of students and their allocation status as a CSV file.</p>
          <button 
            onClick={downloadCSV}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-all"
          >
            <Download className="w-4 h-4" /> Download CSV
          </button>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm opacity-60">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Excel Export</h3>
          <p className="text-sm text-slate-500 mb-6">Advanced Excel report with multiple sheets for courses and categories.</p>
          <button disabled className="w-full flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-800 text-slate-500 px-4 py-2.5 rounded-lg font-medium cursor-not-allowed">
            <Download className="w-4 h-4" /> Coming Soon
          </button>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm opacity-60">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 text-red-600 rounded-xl flex items-center justify-center mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">PDF Report</h3>
          <p className="text-sm text-slate-500 mb-6">Generate a printable PDF summary report of the allocation engine results.</p>
          <button disabled className="w-full flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-800 text-slate-500 px-4 py-2.5 rounded-lg font-medium cursor-not-allowed">
            <Download className="w-4 h-4" /> Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
}
