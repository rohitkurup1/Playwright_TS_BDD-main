import AdmZip from 'adm-zip';
import type { ConsoleEntry, NetworkEntry, ActionStep, ExtractedTraceData } from './types';

interface RawEvent {
  type?: string;
  method?: string;
  [key: string]: unknown;
}

function readJsonLinesFromZip(zip: AdmZip): RawEvent[] {
  const events: RawEvent[] = [];
  for (const entry of zip.getEntries()) {
    const name = entry.entryName;
    if (name.endsWith('.trace') || name.endsWith('.network') || name.endsWith('.stacks')) {
      const content = entry.getData().toString('utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
          events.push(JSON.parse(trimmed));
        } catch {
          // skip malformed lines
        }
      }
    }
  }
  return events;
}

function classifyConsoleErrors(events: RawEvent[]): ConsoleEntry[] {
  return events
    .filter((e) => e.type === 'console' || e.method === 'console')
    .map((e) => ({
      type: String((e as any).messageType ?? (e as any).level ?? 'log'),
      text: String((e as any).text ?? (e as any).message ?? ''),
    }))
    .filter((c) => c.type === 'error' || /error|exception/i.test(c.text));
}

function classifyNetworkFailures(events: RawEvent[]): NetworkEntry[] {
  return events
    .filter((e) => {
      const status = (e as any).status ?? (e as any).response?.status;
      return e.type === 'resource' || e.type === 'network' || typeof status === 'number';
    })
    .map((e) => ({
      url: String((e as any).url ?? (e as any).request?.url ?? ''),
      method: String((e as any).method ?? (e as any).request?.method ?? 'GET'),
      status: Number((e as any).status ?? (e as any).response?.status ?? 0),
      statusText: (e as any).statusText,
      responseBody: (e as any).responseBody ? String((e as any).responseBody).slice(0, 2000) : undefined,
    }))
    .filter((n) => n.status >= 400);
}

function classifyActionLog(events: RawEvent[]): ActionStep[] {
  return events
    .filter((e) => e.type === 'before' || e.type === 'action' || e.type === 'after')
    .map((e) => ({
      apiName: String((e as any).apiName ?? (e as any).method ?? 'unknown'),
      error: (e as any).error?.message,
    }))
    .filter((a) => a.error)
    .slice(-5);
}

export interface ParseTraceOptions {
  traceZipPath: string;
  testTitle: string;
  testFile: string;
  errorMessage: string;
}

export function parseTraceZip(opts: ParseTraceOptions): ExtractedTraceData {
  const zip = new AdmZip(opts.traceZipPath);
  const events = readJsonLinesFromZip(zip);

  return {
    testTitle: opts.testTitle,
    testFile: opts.testFile,
    errorMessage: opts.errorMessage,
    consoleErrors: classifyConsoleErrors(events),
    failedNetworkCalls: classifyNetworkFailures(events),
    actionLog: classifyActionLog(events),
  };
}

/** Run once against a real trace.zip from your repo if console/network come
 * back empty — prints the real event schema so you can adjust the classify*
 * functions above to match your Playwright version. */
export function dumpTraceStructure(traceZipPath: string): void {
  const zip = new AdmZip(traceZipPath);
  const events = readJsonLinesFromZip(zip);
  const types = new Set(events.map((e) => e.type ?? e.method ?? 'unknown'));
  console.log('Distinct event types found in trace:', [...types]);
  console.log('Sample event:', JSON.stringify(events[0], null, 2));
}
