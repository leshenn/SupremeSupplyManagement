'use client';

import Link from 'next/link';
import { ChevronLeft, ExternalLink, MessageCircle, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ChatbotConfig, ChatbotItem } from '@/lib/cms';

type ChatbotProps = {
  config: ChatbotConfig;
};

function childrenFor(items: ChatbotItem[], parentKey: string) {
  return items.filter((item) => (item.parentKey || '') === parentKey);
}

function isExternal(url: string) {
  return /^https?:\/\//i.test(url);
}

export function Chatbot({ config }: ChatbotProps) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const currentKey = history.length ? history[history.length - 1] : '';
  const currentItem = useMemo(
    () => (currentKey ? config.items.find((item) => item.key === currentKey) || null : null),
    [config.items, currentKey],
  );
  const options = useMemo(
    () => childrenFor(config.items, currentKey),
    [config.items, currentKey],
  );

  const selectItem = (item: ChatbotItem) => {
    setHistory((previous) => [...previous, item.key]);
  };

  const goBack = () => {
    setHistory((previous) => previous.slice(0, -1));
  };

  const resetAndClose = () => {
    setOpen(false);
    window.setTimeout(() => setHistory([]), 220);
  };

  if (!config.items.length) return null;

  return (
    <div className={`ssm-chatbot${open ? ' is-open' : ''}`}>
      {open && (
        <section className="ssm-chatbot-panel" aria-label="Supreme Supply website assistant">
          <div className="ssm-chatbot-head">
            <div>
              <span>Supreme Supply</span>
              <strong>How can we help?</strong>
            </div>
            <button type="button" className="ssm-chatbot-close" onClick={resetAndClose} aria-label="Close chatbot">
              <X size={18} strokeWidth={1.8} />
            </button>
          </div>

          <div className="ssm-chatbot-body">
            {history.length > 0 && (
              <button type="button" className="ssm-chatbot-back" onClick={goBack}>
                <ChevronLeft size={15} /> Back
              </button>
            )}

            {!currentItem ? (
              <div className="ssm-chatbot-message">
                <strong>{config.greeting}</strong>
                {config.intro && <p>{config.intro}</p>}
              </div>
            ) : (
              <div className="ssm-chatbot-message">
                <span className="ssm-chatbot-selected">{currentItem.label}</span>
                {currentItem.responseHtml && (
                  <div
                    className="ssm-chatbot-response"
                    dangerouslySetInnerHTML={{ __html: currentItem.responseHtml }}
                  />
                )}
                {currentItem.actionLabel && currentItem.actionUrl && (
                  isExternal(currentItem.actionUrl) ? (
                    <a className="ssm-chatbot-action" href={currentItem.actionUrl} target="_blank" rel="noreferrer">
                      {currentItem.actionLabel} <ExternalLink size={13} />
                    </a>
                  ) : (
                    <Link className="ssm-chatbot-action" href={currentItem.actionUrl} onClick={() => setOpen(false)}>
                      {currentItem.actionLabel} <ExternalLink size={13} />
                    </Link>
                  )
                )}
              </div>
            )}

            {options.length > 0 && (
              <div className="ssm-chatbot-options" aria-label="Chatbot options">
                {options.map((item) => (
                  <button type="button" key={item.id ?? item.key} onClick={() => selectItem(item)}>
                    <span>{item.label}</span>
                    <span aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
            )}

            {currentItem && options.length === 0 && (
              <button type="button" className="ssm-chatbot-start-over" onClick={() => setHistory([])}>
                Start over
              </button>
            )}
          </div>
        </section>
      )}

      <button
        type="button"
        className="ssm-chatbot-launcher"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Close chatbot' : 'Open chatbot'}
        aria-expanded={open}
      >
        {open ? <X size={21} /> : <MessageCircle size={21} />}
      </button>
    </div>
  );
}
