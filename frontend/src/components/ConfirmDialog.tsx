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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xl" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-black/40 backdrop-blur-3xl text-left align-middle shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-all border border-white/10 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                <div className="p-6 relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${isDestructive ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/10 text-white border border-white/20'}`}>
                        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-white">
                        {title}
                      </Dialog.Title>
                    </div>
                    <button
                      type="button"
                      className="rounded-full bg-white/5 p-1 text-white/50 hover:bg-white/10 hover:text-white transition-colors focus:outline-none"
                      onClick={onCancel}
                    >
                      <span className="sr-only">Close</span>
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-4 sm:ml-13">
                    <p className="text-sm text-white/60">{message}</p>
                  </div>
                </div>
                <div className="bg-black/40 px-6 py-5 flex flex-row-reverse gap-3 rounded-b-3xl border-t border-white/10 relative z-10 backdrop-blur-md">
                  <button
                    type="button"
                    className={`inline-flex w-full justify-center rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-sm sm:w-auto transition-colors border border-transparent ${
                      isDestructive 
                        ? 'bg-red-500/80 hover:bg-red-500 hover:border-red-400' 
                        : 'bg-white/20 hover:bg-white/30 hover:border-white/40'
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
                    className="inline-flex w-full justify-center rounded-xl bg-white/5 px-5 py-2.5 text-sm font-medium text-white/80 shadow-sm border border-white/10 hover:bg-white/10 hover:text-white sm:w-auto transition-colors"
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
