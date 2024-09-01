'use client';

import { Button, Card, Spinner, TextField } from '@radix-ui/themes';
import { MagicWandIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import axios from 'axios';
import Zod from 'zod';
import { toast } from 'sonner';
import getZodError from '@/utils/get-zod-error';
import Image from 'next/image';

const valueSchema = Zod.string().regex(/^\d{17,19}$/, 'Invalid Discord ID');

export default function ShowcasePresence() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [lanternData, setLanternData] = useState(null);

  const API_URL = 'https://lantern.rest/api/v1';
  const instance = axios.create({ baseURL: API_URL, timeout: 2000 });
 
  async function handleGenerate() {
    const error = getZodError(valueSchema, value);
    if (error) return toast.error(error);

    setLoading(true);

    try {
      const { data } = await instance.get(`/users/${value}`);

      setLanternData(data);
    } catch (error) {
      if (error.response && error.response.data?.error) toast.error(error.response.data.error);
      else toast.error(`An error occurred: ${error.message}`);

      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h2 className='text-sm font-mono text-center text-pretty text-[--gray-11]'>
        Showcase your presence
      </h2>

      <div className='flex gap-x-2'>
        <TextField.Root
          placeholder="Your Discord ID"
          color='orange'
          className='[&>input]:pr-2'
          value={value}
          onChange={event => setValue(event.target.value)}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>

        <Button
          color='orange'
          variant='surface'
          onClick={handleGenerate}
        >
          <Spinner loading={loading}>
            <MagicWandIcon height="16" width="16" />
          </Spinner>

          Generate
        </Button>
      </div>

      {lanternData && (
        <Card className='flex items-center justify-center w-full bg-[--gray-3] h-[500px]'>
          <div className='max-w-[300px] w-full bg-[--gray-1] h-max rounded-3xl'>
            <div className='w-full h-[120px] bg-[--gray-2] rounded-t-3xl' />

            <div className='relative w-max'>
              <Image
                src={lanternData.metadata.avatar_url}
                alt={`${lanternData.metadata.username}'s avatar`}
                width={80}
                height={80}
                className='rounded-full -mt-8 ml-2 [border-width:8px] border-[--gray-1]'
              />
              
              <Image
                src={`/status/${lanternData.status}.svg`}
                alt={`Status ${lanternData.status}`}
                width={24}
                height={24}
                className='absolute bottom-1 right-1 bg-[--gray-1] p-1 rounded-full'
              />
            </div>

            <div className='px-4 pb-6 flex flex-col'>
              <h3 className='text-lg font-bold text-[--gray-12]'>
                {lanternData.metadata.global_name || lanternData.metadata.username}
              </h3>

              <h4 className='text-sm font-medium flex items-center text-[--gray-11]'>
                {lanternData.metadata.username}{lanternData.metadata.discriminator !== '0' && `#${lanternData.metadata.discriminator}`}

                {lanternData.metadata.flags.human_readable.length > 0 && (
                  <div className='bg-[--gray-3] gap-x-1 flex items-center py-0.5 px-1 border border-[--gray-5] rounded ml-2'>
                    {lanternData.metadata.flags.human_readable.map(flag => (
                      <Image
                        src={`/flags/${flag}.svg`}
                        alt={`Flag ${flag}`}
                        width={14}
                        height={14}
                        key={flag}
                        className='inline'
                      />
                    ))}
                  </div>
                )}
              </h4>

              <p className='mt-4 text-sm text-[--gray-12] font-medium'>
                This text is a placeholder for the user{'\''}s bio.
              </p>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}