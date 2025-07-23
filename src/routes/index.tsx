import { component$, useContext } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { UiPlayStoreContext } from './layout';
import { Laptop, Smartphone } from 'lucide-icons-qwik';

export default component$(() => {
  const UiPlayStore = useContext(UiPlayStoreContext);

  return (
    <div class="flex flex-col px-8">
      <h1 class="text-2xl font-bold">
        Welcome to UiPlay :3
      </h1>
      <p class="text-lg text-gray-300">
        A UxPlay wrapper that forwards music data to mpris and Discord RPC.
      </p>
      {!UiPlayStore.Devices.length &&
        <p class="mt-10">
          Go ahead and airplay! Info will be displayed here.
        </p>
      }
      {UiPlayStore.Devices.map((device) => (
        <div key={device.DeviceID} class="lum-card flex-row items-center gap-4 mt-4">
          {device.DeviceName.includes('Phone') &&
            <Smartphone size={24} class="text-lum-text" />
          }
          {device.DeviceName.includes('Mac') &&
            <Laptop size={24} class="text-lum-text" />
          }
          <div>
            <p class="font-semibold">
              {device.DeviceName} <div class={{
                'inline-block w-2 h-2 rounded-full ml-2': true,
                'bg-orange-300/20': !device.Connected,
                'bg-green-300/50': device.Connected,
              }}/>
            </p>
            {device.Audio && device.Audio.Format &&
              <p class="text-orange-200 text-sm">
                {device.Audio.Format}
              </p>
            }
            <p class="text-gray-400 text-xs">
              {device.DeviceID}
              { device.UserAgent &&
                <span class="text-gray-400 text-xs ml-1">
                  {device.UserAgent}
                </span>
              }
            </p>
          </div>
        </div>
      ))}
      <p class="whitespace-pre-wrap text-gray-500 mt-4">
        {JSON.stringify(UiPlayStore, null, 2)}
      </p>
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
