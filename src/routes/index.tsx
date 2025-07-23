import { component$, useSignal } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Hand } from 'lucide-icons-qwik';

export default component$(() => {
  const count = useSignal(0);
  return (
    <div class="flex flex-col items-center justify-center min-h-screen">
      <div class="lum-card p-24 shadow-xl">
        <h1 class="flex gap-4 items-center text-5xl font-bold">
          <span class="dark:text-luminescent-200" style={{
            filter: 'drop-shadow(0 0 30px var(--color-luminescent-400))',
          }}>
            Welcome to Qwik!
          </span>
          <button class="lum-btn p-5" onClick$={() => count.value++}>
            <Hand size={48} class="rotate-45" />
          </button>
        </h1>
        <p class="text-xl">
          You waved back {count} times!
          <br />
          Can't wait to see what you build with qwik!
          Happy coding.
        </p>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
