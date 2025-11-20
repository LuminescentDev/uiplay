import { component$, useContext } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { Window } from '@tauri-apps/api/window';
import { Airplay, Minus, Settings, Square, Terminal, X } from 'lucide-icons-qwik';
import { UiPlayStoreContext } from '~/routes/layout';

export default component$(() => {
  const UiPlayStore = useContext(UiPlayStoreContext);

  return (
    <div data-tauri-drag-region
      class="flex justify-between fixed top-0 w-full z-20 p-2 border-b border-b-gray-900 rounded-lum rounded-b-none">
      <div>
        <Link href="/" class="lum-btn lum-bg-transparent fill-[#f0ccfb] font-semibold text-[#f0ccfb]! rounded-lum-2 rounded-b-md rounded-r-md hover:lum-bg-luminescent-500">
          <span class="flex items-center gap-2" style="filter: drop-shadow(0 0 1rem #CB6CE6);">
            <Airplay size={20} strokeWidth={3} />
            UiPlay
          </span>
        </Link>
      </div>
      <div class="flex items-center gap-1">
        <Link href="/settings" class="lum-btn lum-bg-transparent p-2 rounded-md">
          <Settings size={20} />
        </Link>
        <button class="lum-btn lum-bg-transparent p-2 rounded-md" onClick$={() => {
          UiPlayStore.TerminalOpen = !UiPlayStore.TerminalOpen;
        }}>
          <Terminal size={20} />
        </button>
        <button class="lum-btn lum-bg-transparent p-2 rounded-md hover:lum-bg-amber-500" onClick$={() => {
          Window.getCurrent().minimize();
        }}>
          <Minus size={20} />
        </button>
        <button class="lum-btn lum-bg-transparent p-2 rounded-md hover:lum-bg-green-500" onClick$={() => {
          Window.getCurrent().toggleMaximize();
        }}>
          <Square size={20} />
        </button>
        <button class="lum-btn lum-bg-transparent p-2 rounded-lum-2 rounded-b-md rounded-l-md hover:lum-bg-red-500" onClick$={() => {
          Window.getCurrent().close();
        }}>
          <X size={20} />
        </button>
      </div>
    </div>
  );
});