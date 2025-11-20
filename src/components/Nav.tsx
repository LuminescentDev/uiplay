import { component$, useContext } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { Window } from '@tauri-apps/api/window';
import { Airplay, Minus, Settings, Square, Terminal, X } from 'lucide-icons-qwik';
import { UiPlayStoreContext } from '~/routes/layout';

export default component$(() => {
  const UiPlayStore = useContext(UiPlayStoreContext);

  return (
    <div data-tauri-drag-region style={{
      '--lum-border-radius': 'var(--radius-xl)',
    }}
    class="flex justify-between fixed top-0 w-full backdrop-blur-lg z-20 p-2 border-b border-b-gray-900">
      <div>
        <Link href="/" class="lum-btn lum-bg-transparent fill-[#f0ccfb] font-semibold text-[#f0ccfb]!">
          <span class="flex items-center gap-2" style="filter: drop-shadow(0 0 1rem #CB6CE6);">
            <Airplay size={20} strokeWidth={3} />
            UiPlay
          </span>
        </Link>
      </div>
      <div class="flex items-center gap-2">
        <Link href="/settings" class="lum-btn lum-bg-transparent p-2">
          <Settings size={20} />
        </Link>
        <button class="lum-btn lum-bg-transparent p-2" onClick$={() => {
          UiPlayStore.TerminalOpen = !UiPlayStore.TerminalOpen;
        }}>
          <Terminal size={20} />
        </button>
        <button class="lum-btn lum-bg-transparent p-2" onClick$={() => {
          Window.getCurrent().minimize();
        }}>
          <Minus size={20} />
        </button>
        <button class="lum-btn lum-bg-transparent p-2" onClick$={() => {
          Window.getCurrent().toggleMaximize();
        }}>
          <Square size={20} />
        </button>
        <button class="lum-btn lum-bg-transparent p-2" onClick$={() => {
          Window.getCurrent().close();
        }}>
          <X size={20} />
        </button>
      </div>
    </div>
  );
});