import { useRef } from "react";

export function useStreamRefs() {
  const abortRef = useRef<AbortController | null>(null);
  const accRef = useRef("");        // full accumulated text
  const queueRef = useRef<string[]>([]); // chars waiting to render
  const renderRef = useRef("");     // what has actually been painted
  const flushRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    accRef.current = "";
    queueRef.current = [];
    renderRef.current = "";
  };

  return { abortRef, accRef, queueRef, renderRef, flushRef, reset };
}