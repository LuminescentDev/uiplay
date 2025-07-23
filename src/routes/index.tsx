import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import Terminal from '~/components/Terminal';

export default component$(() => {
  return (
    <div class="flex flex-col px-8 gap-6">
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
