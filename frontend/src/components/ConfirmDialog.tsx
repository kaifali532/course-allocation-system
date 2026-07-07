import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = true,
}: ConfirmDialogProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onCancel}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-2xl transition-all border border-slate-100">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${isDestructive ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-slate-900">
                        {title}
                      </Dialog.Title>
                    </div>
                    <button
                      type="button"
                      className="rounded-md bg-white text-slate-400 hover:text-slate-500 focus:outline-none"
                      onClick={onCancel}
                    >
                      <span className="sr-only">Close</span>
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 sm:ml-13">
                    <p className="text-sm text-slate-500">{message}</p>
                  </div>
                </div>
                <div className="bg-slate-50 px-6 py-4 flex flex-row-reverse gap-3 rounded-b-xl border-t border-slate-100">
                  <button
                    type="button"
                    className={`inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm sm:w-auto transition-colors ${
                      isDestructive 
                        ? 'bg-red-600 hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600' 
                        : 'bg-indigo-600 hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    }`}
                    onClick={() => {
                      onConfirm();
                      onCancel();
                    }}
                  >
                    {confirmText}
                  </button>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:w-auto transition-colors"
                    onClick={onCancel}
                  >
                    {cancelText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
