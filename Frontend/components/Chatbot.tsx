'use client';

import Link from 'next/link';
import {
  ChevronLeft,
  ExternalLink,
  MessageCircle,
  X,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  ChatbotConfig,
  ChatbotItem,
} from '@/lib/cms';

type ChatbotProps = {
  config: ChatbotConfig;
};

const CLOSE_ANIMATION_MS = 280;

function childrenFor(
  items: ChatbotItem[],
  parentKey: string,
) {
  return items.filter(
    (item) => (item.parentKey || '') === parentKey,
  );
}

function isExternal(url: string) {
  return /^https?:\/\//i.test(url);
}

export function Chatbot({ config }: ChatbotProps) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const closeTimer = useRef<number | null>(null);

  const currentKey = history.length
    ? history[history.length - 1]
    : '';

  const currentItem = useMemo(
    () =>
      currentKey
        ? config.items.find(
            (item) => item.key === currentKey,
          ) || null
        : null,
    [config.items, currentKey],
  );

  const options = useMemo(
    () => childrenFor(config.items, currentKey),
    [config.items, currentKey],
  );

  /* ---------------------------------------------------------
     Open
     --------------------------------------------------------- */

  const openChatbot = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    setClosing(false);
    setOpen(true);
  }, []);

  /* ---------------------------------------------------------
     Close

     We keep the component mounted for 280ms so CSS gets time
     to play the closing animation before React removes it.
     --------------------------------------------------------- */

  const closeChatbot = useCallback(() => {
    if (!open || closing) {
      return;
    }

    setClosing(true);

    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
    }

    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setHistory([]);

      closeTimer.current = null;
    }, CLOSE_ANIMATION_MS);
  }, [open, closing]);

  /* ---------------------------------------------------------
     Launcher
     --------------------------------------------------------- */

  const toggleChatbot = () => {
    if (closing) {
      return;
    }

    if (open) {
      closeChatbot();
    } else {
      openChatbot();
    }
  };

  /* ---------------------------------------------------------
     Navigation
     --------------------------------------------------------- */

  const selectItem = (item: ChatbotItem) => {
    if (closing) {
      return;
    }

    setHistory((previous) => [
      ...previous,
      item.key,
    ]);
  };

  const goBack = () => {
    if (closing) {
      return;
    }

    setHistory((previous) =>
      previous.slice(0, -1),
    );
  };

  const startOver = () => {
    if (closing) {
      return;
    }

    setHistory([]);
  };

  /* ---------------------------------------------------------
     Escape key + timer cleanup
     --------------------------------------------------------- */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === 'Escape' &&
        open &&
        !closing
      ) {
        closeChatbot();
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [open, closing, closeChatbot]);

  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) {
        window.clearTimeout(
          closeTimer.current,
        );
      }
    };
  }, []);

  if (!config.items.length) {
    return null;
  }


  // Lock the background when the chatbot is open
  useEffect(() => {
  if (!open) return;

  const isMobile = window.matchMedia(
    '(max-width: 760px)',
  ).matches;

  if (!isMobile) return;

  const body = document.body;
  const html = document.documentElement;

  const previousBodyOverflow = body.style.overflow;
  const previousHtmlOverflow = html.style.overflow;

  const previousBodyOverscroll =
    body.style.overscrollBehavior;
  const previousHtmlOverscroll =
    html.style.overscrollBehavior;

  /*
   * Lock the page without changing its position.
   * This avoids the up/down jump caused by position: fixed.
   */
  body.style.overflow = 'hidden';
  html.style.overflow = 'hidden';

  body.style.overscrollBehavior = 'none';
  html.style.overscrollBehavior = 'none';

  let touchStartY = 0;

  const handleTouchStart = (
    event: TouchEvent,
  ) => {
    touchStartY =
      event.touches[0]?.clientY ?? 0;
  };

  const handleTouchMove = (
    event: TouchEvent,
  ) => {
    const target =
      event.target instanceof HTMLElement
        ? event.target
        : null;

    const scrollArea =
      target?.closest(
        '.ssm-chatbot-body',
      ) as HTMLElement | null;

    /*
     * If the touch is outside the chatbot's
     * scrollable area, don't allow the page
     * behind it to move.
     */
    if (!scrollArea) {
      event.preventDefault();
      return;
    }

    const currentY =
      event.touches[0]?.clientY ??
      touchStartY;

    const deltaY =
      currentY - touchStartY;

    const atTop =
      scrollArea.scrollTop <= 0;

    const atBottom =
      Math.ceil(
        scrollArea.scrollTop +
          scrollArea.clientHeight,
      ) >= scrollArea.scrollHeight;

    /*
     * Stop the scroll from "escaping"
     * the chatbot when the user reaches
     * the top or bottom.
     */
    if (
      (atTop && deltaY > 0) ||
      (atBottom && deltaY < 0)
    ) {
      event.preventDefault();
    }
  };

  document.addEventListener(
    'touchstart',
    handleTouchStart,
    { passive: true },
  );

  document.addEventListener(
    'touchmove',
    handleTouchMove,
    { passive: false },
  );

  return () => {
    body.style.overflow =
      previousBodyOverflow;

    html.style.overflow =
      previousHtmlOverflow;

    body.style.overscrollBehavior =
      previousBodyOverscroll;

    html.style.overscrollBehavior =
      previousHtmlOverscroll;

    document.removeEventListener(
      'touchstart',
      handleTouchStart,
    );

    document.removeEventListener(
      'touchmove',
      handleTouchMove,
    );
  };
}, [open]);

  /*
   * Changing this key forces the content view to remount.
   *
   * That means the response + option animations replay when:
   * - opening Services
   * - selecting Air Freight
   * - going Back
   * - starting over
   */
  const viewKey = currentKey || 'chatbot-root';

  return (
    <div
      className={`ssm-chatbot${
        open ? ' is-open' : ''
      }${closing ? ' is-closing' : ''}`}
    >
      {open && (
        <section
          id="ssm-chatbot-panel"
          className={`ssm-chatbot-panel${
            closing ? ' is-closing' : ''
          }`}
          aria-label="Supreme Supply website assistant"
        >
          <div className="ssm-chatbot-head">
            <div>
              <span>Supreme Supply</span>

              <strong>
                How can we help?
              </strong>
            </div>

            <button
              type="button"
              className="ssm-chatbot-close"
              onClick={closeChatbot}
              aria-label="Close chatbot"
            >
              <X
                size={18}
                strokeWidth={1.8}
              />
            </button>
          </div>

          <div className="ssm-chatbot-body">
            {history.length > 0 && (
              <button
                type="button"
                className="ssm-chatbot-back"
                onClick={goBack}
              >
                <ChevronLeft size={15} />

                Back
              </button>
            )}

            <div
              key={viewKey}
              className="ssm-chatbot-view"
            >
              {!currentItem ? (
                <div className="ssm-chatbot-message">
                  <strong>
                    {config.greeting}
                  </strong>

                  {config.intro && (
                    <p>{config.intro}</p>
                  )}
                </div>
              ) : (
                <div className="ssm-chatbot-message">
                  <span className="ssm-chatbot-selected">
                    {currentItem.label}
                  </span>

                  {currentItem.responseHtml && (
                    <div
                      className="ssm-chatbot-response"
                      dangerouslySetInnerHTML={{
                        __html:
                          currentItem.responseHtml,
                      }}
                    />
                  )}

                  {currentItem.actionLabel &&
                    currentItem.actionUrl &&
                    (isExternal(
                      currentItem.actionUrl,
                    ) ? (
                      <a
                        className="ssm-chatbot-action"
                        href={
                          currentItem.actionUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        {
                          currentItem.actionLabel
                        }

                        <ExternalLink
                          size={13}
                        />
                      </a>
                    ) : (
                      <Link
                        className="ssm-chatbot-action"
                        href={
                          currentItem.actionUrl
                        }
                        onClick={closeChatbot}
                      >
                        {
                          currentItem.actionLabel
                        }

                        <ExternalLink
                          size={13}
                        />
                      </Link>
                    ))}
                </div>
              )}

              {options.length > 0 && (
                <div
                  className="ssm-chatbot-options"
                  aria-label="Chatbot options"
                >
                  {options.map((item) => (
                    <button
                      type="button"
                      key={
                        item.id ??
                        item.key
                      }
                      onClick={() =>
                        selectItem(item)
                      }
                    >
                      <span>
                        {item.label}
                      </span>

                      <span aria-hidden="true">
                        →
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {currentItem &&
                options.length === 0 && (
                  <button
                    type="button"
                    className="ssm-chatbot-start-over"
                    onClick={startOver}
                  >
                    Start over
                  </button>
                )}
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        className="ssm-chatbot-launcher"
        onClick={toggleChatbot}
        aria-label={
          open
            ? 'Close chatbot'
            : 'Open chatbot'
        }
        aria-expanded={
          open && !closing
        }
        aria-controls="ssm-chatbot-panel"
      >
        {open ? (
          <X size={21} />
        ) : (
          <MessageCircle size={21} />
        )}
      </button>
    </div>
  );
}