import { component$, useContext } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { UiPlayStoreContext } from './layout';
import { Laptop, Music, Smartphone, Trash } from 'lucide-icons-qwik';

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
          <div class="flex-1">
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
          {!device.Connected &&
            <button class="lum-btn lum-bg-transparent p-2 text-red-300 hover:text-red-400"
              onClick$={() => {
                UiPlayStore.Devices = UiPlayStore.Devices.filter(d => d.DeviceID !== device.DeviceID);
              }}>
              <Trash size={20} />
            </button>
          }
        </div>
      ))}
      {UiPlayStore.NowPlaying && UiPlayStore.NowPlaying.Title &&
        <div class="lum-card mt-8 gap-0">
          <h2 class="text-xl font-semibold flex items-center gap-2">
            <Music size={20} />
            {UiPlayStore.NowPlaying.Title}
          </h2>
          {UiPlayStore.NowPlaying.Artist &&
            <p class="text-gray-400">
              by {UiPlayStore.NowPlaying.Artist}
            </p>
          }
          <p class="text-gray-500">
            {UiPlayStore.NowPlaying.Album &&
              <span>
                {UiPlayStore.NowPlaying.Album}
              </span>
            }
            {' - '}
            {UiPlayStore.NowPlaying.Genre &&
              <span>
                {UiPlayStore.NowPlaying.Genre}
              </span>
            }
          </p>
          {UiPlayStore.NowPlaying.Progress && UiPlayStore.NowPlaying.Remaining && UiPlayStore.NowPlaying.Length &&
            <div class="w-full h-2 lum-bg-gray-700 rounded-full mt-2">
              <div class="h-full lum-bg-gray-200" style={{
                width: `${
                  (UiPlayStore.NowPlaying.Progress.min * 60 + UiPlayStore.NowPlaying.Progress.sec)
                  /
                  (UiPlayStore.NowPlaying.Length.min * 60 + UiPlayStore.NowPlaying.Length.sec) * 100
                }%`,
              }} />
            </div>
          }
          {UiPlayStore.NowPlaying.Progress && UiPlayStore.NowPlaying.Length &&
            <div class="flex justify-between text-sm text-gray-500 mt-1">
              <p>
                {UiPlayStore.NowPlaying.Progress.min}:{UiPlayStore.NowPlaying.Progress.sec.toString().padStart(2, '0')}
              </p>
              <p>
                {UiPlayStore.NowPlaying.Length.min}:{UiPlayStore.NowPlaying.Length.sec.toString().padStart(2, '0')}
              </p>
            </div>
          }
        </div>
      }
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
