import { component$, useContext } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { UiPlayStoreContext } from '../layout';

export default component$(() => {
  const UiPlayStore = useContext(UiPlayStoreContext);

  return (
    <>
      <h1 class="text-2xl font-bold">Settings</h1>
      <p class="text-lg mb-4">Configure your preferences here.</p>

      <label for="name" class="font-medium text-gray-400 mb-1">Name</label>
      <input
        id="name"
        type="text"
        class="lum-input"
        placeholder="Enter the name of the UxPlay instance"
        value={UiPlayStore.Name}
        onInput$={(e, el) => UiPlayStore.Name = el.value }
      />

      {/* Add settings components or forms here */}
      <p class="text-sm text-gray-500 mt-8">
        More settings will be added soon.
      </p>
    </>
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
