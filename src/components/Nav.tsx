import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { Window } from '@tauri-apps/api/window';
import { Airplay, Minus, Square, X } from 'lucide-icons-qwik';

export default component$(() => {
  return (
    <div data-tauri-drag-region class="flex justify-between fixed top-0 w-full lum-bg-gray-900/80 backdrop-blur-lg z-20 border-0 border-b p-2">
      <div>
        <Link href="/" class="lum-btn lum-bg-transparent fill-[#f0ccfb] font-semibold text-[#f0ccfb]!"
          style="filter: drop-shadow(0 0 1rem #CB6CE6);">
          <Airplay size={20} strokeWidth={3} />
          UiPlay
        </Link>
      </div>
      <div class="flex items-center gap-2">
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