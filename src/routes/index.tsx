import { component$, useContext } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { UiPlayStoreContext } from './layout';
import { Airplay, Laptop, Music, Smartphone, Trash } from 'lucide-icons-qwik';

export default component$(() => {
  const UiPlayStore = useContext(UiPlayStoreContext);

  return (
    <>
      <span class="flex items-center gap-2 text-[#f0ccfb]!" style="filter: drop-shadow(0 0 1rem #CB6CE6);">
        <Airplay size={96} strokeWidth={2} />
      </span>
      <h1 class="text-2xl font-bold mt-4">
        Welcome to UiPlay :3
      </h1>
      <p class="text-lg text-gray-300">
        A UxPlay wrapper that forwards music data to mpris and Discord RPC.
      </p>
      {!UiPlayStore.Devices.length && !UiPlayStore.NowPlaying &&
        <p class="mt-10 text-gray-500">
          Go ahead and airplay! Info will be displayed here.
        </p>
      }
      {UiPlayStore.NowPlaying &&
        <div class="lum-card lum-bg-lum-card-bg/80 flex-row items-center mt-8 gap-8 relative overflow-hidden rounded-xl">
          <img
            src={UiPlayStore.NowPlaying.AlbumArt}
            alt="Album Art"
            width={400}
            height={400}
            class="absolute inset-0 w-full h-full object-cover -z-2 blur-xl"
            style={{ clipPath: 'inset(0 round 0.75rem)' }}
          />
          {UiPlayStore.NowPlaying.AlbumArt &&
            <div>
              <img
                src={UiPlayStore.NowPlaying.AlbumArt}
                alt="Album Art"
                width={96}
                height={96}
                class="h-24 rounded-lg object-cover"
              />
            </div>
          }
          <div class="flex-1">
            <h2 class="text-xl font-semibold flex items-center gap-2">
              <Music size={20} />
              {UiPlayStore.NowPlaying.Title && (
                <span>
                  {UiPlayStore.NowPlaying.Title}
                </span>
              )}
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
                <div class="h-full bg-gray-200 rounded-full" style={{
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
        </div>
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
