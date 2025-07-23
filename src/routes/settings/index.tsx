import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="flex flex-col px-8 gap-6">
      <h1 class="text-2xl font-bold">Settings</h1>
      <p class="text-lg">Configure your preferences here.</p>
      {/* Add settings components or forms here */}
      <p class="text-sm text-gray-500">More settings will be added soon.</p>
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
