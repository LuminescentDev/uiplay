import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import Terminal from '~/components/Terminal';

export default component$(() => {
  return (
    <div class="flex flex-col min-h-screen py-14 px-8 gap-6">
      <h1 class="flex gap-4 items-center text-5xl font-bold">
        <span>
          UiPlay
        </span>
      </h1>
      <Terminal />
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
