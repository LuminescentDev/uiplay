import { component$, createContextId, Signal, Slot, useContextProvider, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { listen } from '@tauri-apps/api/event';
import { FitAddon } from '@xterm/addon-fit';
import { SearchAddon } from '@xterm/addon-search';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import Nav from '~/components/Nav';

type UiPlayStore = {
  Name: string;
  Socket?: string;
  Devices: {
    Socket?: string;
    DeviceID: string;
    DeviceName: string;
    Connected?: boolean;
    UserAgent?: string;
    Audio?: {
      Format: string;
    }
  }[];
  TerminalOpen?: boolean;
};

export const UiPlayStoreContext = createContextId<UiPlayStore>('UiPlayStoreContext');
export const TerminalRefContext = createContextId<Signal<HTMLDivElement>>('TerminalRefContext');
export default component$(() => {
  const UiPlayStore = useStore<UiPlayStore>({
    Name: 'UiPlay',
    Devices: [],
  });
  useContextProvider(UiPlayStoreContext, UiPlayStore);

  const terminalRef = useSignal<HTMLDivElement>();
  useContextProvider(TerminalRefContext, terminalRef);
  const fitSignal = useSignal<FitAddon>();
  const terminalInstance = useSignal<Terminal>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (!terminalRef.value) return;

    // get current css variable since xterm doesn't support variables directly
    const fgColor = getComputedStyle(document.documentElement).getPropertyValue('--color-lum-text').trim() || '#ffffff';
    const term = new Terminal({
      cursorBlink: true,
      macOptionIsMeta: true,
      scrollback: 1000,
      theme: {
        background: '#00000000',
        foreground: fgColor,
      },
    });
    const webLinks = new WebLinksAddon();
    const search = new SearchAddon();
    const fitAddon = new FitAddon();

    terminalInstance.value = term;
    fitSignal.value = fitAddon;

    let DeviceID = '';
    listen<string>('uxplay-output', (event) => {
      term.write(event.payload + '\r\n');

      if (event.payload.startsWith('Accepted')) {
        const regex = /Accepted (.*) client on socket (.*)/;
        const match = event.payload.match(regex);
        if (!match) return;

        const Socket = match[2];

        UiPlayStore.Socket = Socket;
      }

      if (event.payload.startsWith('connection request')) {
        const regex = /connection request from (.*) with deviceID = (.*)/;
        const match = event.payload.match(regex);
        if (!match) return;

        const DeviceName = match[1];
        DeviceID = match[2];

        if (UiPlayStore.Devices.some(d => d.DeviceID === DeviceID)) {
          // If device already exists, update its name
          const device = UiPlayStore.Devices.find(d => d.DeviceID === DeviceID);
          if (device) {
            device.Socket = UiPlayStore.Socket;
            device.DeviceName = DeviceName;
          }
        }
        else {
          // If device does not exist, add it
          UiPlayStore.Devices.push({
            Socket: UiPlayStore.Socket,
            DeviceName,
            DeviceID,
          });
        }
      }

      if (event.payload.startsWith('Client identified')) {
        const regex = /Client identified as User-Agent: (.*)/;
        const match = event.payload.match(regex);
        if (!match) return;

        const UserAgent = match[1];
        const device = UiPlayStore.Devices.find(d => d.DeviceID === DeviceID);

        if (!device) return;
        device.UserAgent = UserAgent;
        device.Connected = true;
      }

      if (event.payload.startsWith('start audio connection')) {
        const regex = /start audio connection, format (.*)/;
        const match = event.payload.match(regex);
        if (!match) return;

        const Format = match[1];

        const device = UiPlayStore.Devices.find(d => d.DeviceID === DeviceID);
        if (!device) return;

        device.Audio = {
          Format,
        };
      }

      if (event.payload.startsWith('Connection closed')) {
        const regex = /Connection closed for socket (.*)/;
        const match = event.payload.match(regex);
        if (!match) return;

        const Socket = match[1];

        const device = UiPlayStore.Devices.find(d => d.Socket === Socket);
        if (!device) return;
        device.Socket = undefined;
        device.Connected = false;
      }
    });

    term.loadAddon(fitSignal.value);
    term.loadAddon(webLinks);
    term.loadAddon(search);

    term.open(terminalRef.value);
    requestAnimationFrame(() => {
      fitAddon.fit();
      term.focus();
    });

    // Set up resize observer to handle container size changes
    const resizeObserver = new ResizeObserver(() => {
      if (fitSignal.value) {
        fitSignal.value.fit();
      }
    });

    resizeObserver.observe(terminalRef.value);
  });

  return (
    <>
      <Nav />
      <Slot />
      <div id="terminal-container" class={{
        'transition-all duration-300 absolute inset-24 lum-bg-bg/100 border border-lum-border/40 rounded-lum backdrop-blur-lg p-4': true,
        'opacity-0 pointer-events-none -mt-2': !UiPlayStore.TerminalOpen,
      }}>
        <div ref={terminalRef} class="w-full h-full overflow-hidden" />
      </div>
    </>
  );
});