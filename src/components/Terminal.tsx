import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Terminal } from '@xterm/xterm';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { SearchAddon } from '@xterm/addon-search';
import '@xterm/xterm/css/xterm.css';
import { FitAddon } from '@xterm/addon-fit';

export default component$(() => {
  const terminalRef = useSignal<HTMLDivElement>();
  const fitSignal = useSignal<FitAddon>();
  const terminalInstance = useSignal<Terminal>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (!terminalRef.value) return;

    const term = new Terminal({
      cursorBlink: true,
      macOptionIsMeta: true,
      scrollback: 1000,
    });
    const webLinks = new WebLinksAddon();
    const search = new SearchAddon();
    const fitAddon = new FitAddon();

    terminalInstance.value = term;
    fitSignal.value = fitAddon;

    term.loadAddon(fitSignal.value);
    term.loadAddon(webLinks);
    term.loadAddon(search);

    term.open(terminalRef.value);
    requestAnimationFrame(() => {
      fitAddon.fit();
      term.focus();
    });
  });

  return (
    <div class="w-full h-[30dvh] p-2 lum-bg-black border border-lum-border/40 rounded-lum">
      <div ref={terminalRef} class="w-full h-full overflow-hidden" />
    </div>
  );
});