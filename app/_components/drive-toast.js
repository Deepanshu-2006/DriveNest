"use client";

import React from 'react';
import { toast } from 'react-toastify';
import { AlertCircle, Check, Info, RotateCcw, TriangleAlert } from 'lucide-react';

const toneStyles = {
  success: {
    accent: 'from-emerald-400 via-teal-400 to-cyan-400',
    iconWrap: 'bg-emerald-500/18 text-emerald-300 ring-1 ring-emerald-400/20',
    icon: Check,
  },
  error: {
    accent: 'from-rose-400 via-orange-400 to-amber-300',
    iconWrap: 'bg-rose-500/18 text-rose-200 ring-1 ring-rose-400/20',
    icon: AlertCircle,
  },
  warning: {
    accent: 'from-amber-300 via-orange-300 to-rose-300',
    iconWrap: 'bg-amber-500/18 text-amber-100 ring-1 ring-amber-400/20',
    icon: TriangleAlert,
  },
  info: {
    accent: 'from-sky-300 via-cyan-300 to-teal-300',
    iconWrap: 'bg-sky-500/18 text-sky-100 ring-1 ring-sky-400/20',
    icon: Info,
  },
};

function DriveToast({ title, description, tone = 'success', actions = [], closeToast }) {
  const config = toneStyles[tone] || toneStyles.info;
  const Icon = config.icon;

  return (
    <div className="drivenest-toast group relative overflow-hidden rounded-[22px] border border-white/10 bg-[#090b0f]/96 p-4 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className={`absolute inset-x-0 top-0 h-px bg-linear-to-r ${config.accent} opacity-90`} />
      <div className="flex gap-3.5">
        <div className={`drivenest-toast-check mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${config.iconWrap}`}>
          <Icon className="h-5 w-5" strokeWidth={2.75} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black tracking-tight text-white">{title}</p>
          {description ? (
            <p className="mt-1 text-xs leading-5 text-white/62">{description}</p>
          ) : null}
          {actions.length > 0 ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {actions.map((action) => {
                const isUndo = action.kind === 'undo';
                return (
                  <button
                    key={action.label}
                    onClick={() => {
                      action.onClick?.();
                      closeToast?.();
                    }}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
                      isUndo
                        ? 'bg-white/8 text-white hover:bg-white/14'
                        : 'bg-teal-400/16 text-teal-200 hover:bg-teal-400/24'
                    }`}
                  >
                    {isUndo ? <RotateCcw className="h-3.5 w-3.5" /> : null}
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function showDriveToast({ title, description, tone = 'success', actions = [], options = {} }) {
  return toast(
    ({ closeToast }) => (
      <DriveToast
        title={title}
        description={description}
        tone={tone}
        actions={actions}
        closeToast={closeToast}
      />
    ),
    {
      autoClose: 3600,
      closeButton: false,
      hideProgressBar: true,
      className: '!bg-transparent !p-0 !shadow-none',
      bodyClassName: '!p-0',
      ...options,
    }
  );
}

export function showSuccessToast(title, description, options) {
  return showDriveToast({ title, description, tone: 'success', ...options });
}

export function showErrorToast(title, description, options) {
  return showDriveToast({ title, description, tone: 'error', ...options });
}

export function showWarningToast(title, description, options) {
  return showDriveToast({ title, description, tone: 'warning', ...options });
}

export function showInfoToast(title, description, options) {
  return showDriveToast({ title, description, tone: 'info', ...options });
}
