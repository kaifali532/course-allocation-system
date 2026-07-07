import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FileText, Download, FileSpreadsheet, FileCode } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { format } from 'date-fns';

export default function Reports() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, studentsRes, coursesRes] = await Promise.all([
          api.get('/analytics'),
          api.get('/students?limit=1000'), // fetching a large chunk for export
          api.get('/courses?limit=1000')
        ]);
        setData({
          stats: statsRes.data.data,
          students: studentsRes.data.data,
          courses: coursesRes.data.data
        });
      } catch (error) {
        toast.error('Failed to load report data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const generatePDF = () => {
    if (!data) return;
    const doc = new jsPDF();
    const dateStr = format(new Date(), 'yyyy-MM-dd HH:mm');

    doc.setFontSize(20);
    doc.text('University Course Allocation Report', 14, 22);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${dateStr}`, 14, 30);
    
    doc.setFontSize(14);
    doc.text('System Overview', 14, 45);

    autoTable(doc, {
      startY: 50,
      head: [['Metric', 'Value']],
      body: [
        ['Total Students', data.stats.totalStudents],
        ['Total Courses', data.stats.totalCourses],
        ['Total Allocations', data.stats.totalAllocations],
        ['Seat Utilization', `${data.stats.seatUtilization}%`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [129, 140, 248] }
    });

    doc.setFontSize(14);
    doc.text('Department Statistics', 14, (doc as any).lastAutoTable.finalY + 15);

    const deptRows = Object.keys(data.stats.departmentStats).map(dept => [
      dept,
      data.stats.departmentStats[dept].courses,
      data.stats.departmentStats[dept].seats
    ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Department', 'Courses', 'Total Seats']],
      body: deptRows,
      theme: 'grid',
      headStyles: { fillColor: [52, 211, 153] }
    });

    doc.save(`Allocation_Report_${format(new Date(), 'yyyyMMdd')}.pdf`);
    toast.success('PDF Report generated');
  };

  const generateExcel = () => {
    if (!data) return;
    const wb = XLSX.utils.book_new();
    
    // Students sheet
    const wsStudents = XLSX.utils.json_to_sheet(data.students);
    XLSX.utils.book_append_sheet(wb, wsStudents, "Students");

    // Courses sheet
    const wsCourses = XLSX.utils.json_to_sheet(data.courses);
    XLSX.utils.book_append_sheet(wb, wsCourses, "Courses");

    XLSX.writeFile(wb, `University_Data_${format(new Date(), 'yyyyMMdd')}.xlsx`);
    toast.success('Excel file generated');
  };

  const generateCSV = () => {
    if (!data) return;
    const csv = Papa.unparse(data.students);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Students_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV file generated');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 rounded-full border-t-2 border-white animate-spin"></div>
      </div>
    );
  }

  const reports = [
    { title: 'Complete System PDF', desc: 'Comprehensive PDF containing metrics, department capacities, and recent trends.', icon: FileText, color: 'text-rose-400', action: generatePDF },
    { title: 'Raw Data Export (Excel)', desc: 'Export all students, courses, and allocations as a multi-sheet Excel file.', icon: FileSpreadsheet, color: 'text-emerald-400', action: generateExcel },
    { title: 'Student Roster (CSV)', desc: 'Generate a raw CSV file containing all student applications and statuses.', icon: FileCode, color: 'text-indigo-400', action: generateCSV },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">System Reports</h1>
        <p className="text-white/50 mt-2">Generate and download official university reports and data exports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((report, idx) => (
          <div key={idx} className="solid-card p-6 flex flex-col items-start group">
            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${report.color}`}>
              <report.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{report.title}</h3>
            <p className="text-white/50 text-sm mb-8 flex-1">{report.desc}</p>
            <button 
              onClick={report.action}
              className="w-full px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-full text-sm font-bold transition-all shadow-[0_10px_20px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 hover:-translate-y-0.5 duration-300"
            >
              <Download className="w-4 h-4" />
              Generate
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
