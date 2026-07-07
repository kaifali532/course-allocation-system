import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import type { SortingState, ColumnDef } from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronsUpDown, Search, SlidersHorizontal, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  placeholder?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  placeholder = "Search...",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
  });

  return (
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:max-w-sm group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-white transition-colors">
            <Search className="h-4 w-4" />
          </div>
          <input
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-black/40 backdrop-blur-md border border-white/5 hover:border-white/10 rounded-xl text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 transition-all shadow-lg"
            placeholder={placeholder}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-black/40 backdrop-blur-md border border-white/5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all shadow-lg">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-black/40 backdrop-blur-md border border-white/5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all shadow-lg">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-[24px] overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        <div className="overflow-x-auto custom-scrollbar relative z-10">
          <table className="w-full text-sm text-left">
            <thead className="table-header border-b border-white/10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id} className="px-6 py-5 font-semibold tracking-wider text-white/60 bg-black/40 backdrop-blur-md border-b border-white/5">
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? 'cursor-pointer select-none flex items-center gap-2 hover:text-white transition-colors'
                                : 'flex items-center gap-2',
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: <ChevronUp className="w-4 h-4 text-white" />,
                              desc: <ChevronDown className="w-4 h-4 text-white" />,
                            }[header.column.getIsSorted() as string] ?? (
                              header.column.getCanSort() ? <ChevronsUpDown className="w-4 h-4 text-white/30" /> : null
                            )}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02, duration: 0.2 }}
                      className="table-row-hover group"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-white/80 group-hover:text-white transition-colors">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="h-32 text-center text-white/40">
                      No records found.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-5 border-t border-white/5 bg-black/40 backdrop-blur-md relative z-10">
          <div className="flex-1 flex items-center justify-between sm:hidden">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 border border-white/10 rounded-xl text-sm font-medium text-white/70 bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="ml-3 px-4 py-2 border border-white/10 rounded-xl text-sm font-medium text-white/70 bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-white/50">
                Showing page <span className="font-semibold text-white/90">{table.getState().pagination.pageIndex + 1}</span> of{' '}
                <span className="font-semibold text-white/90">{table.getPageCount()}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-xl shadow-sm overflow-hidden" aria-label="Pagination">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="relative inline-flex items-center px-4 py-2 border-r border-white/5 bg-white/5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-50 transition-colors backdrop-blur-md"
                >
                  Previous
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="relative inline-flex items-center px-4 py-2 bg-white/5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-50 transition-colors backdrop-blur-md"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
