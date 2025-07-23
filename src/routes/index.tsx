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
  title: 'UiPlay',
  meta: [
    {
      name: 'description',
      content: 'A UxPlay wrapper.',
    },
  ],
};
