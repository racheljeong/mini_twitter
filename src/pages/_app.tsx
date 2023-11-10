import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';

export default function App({ Component, pageProps }: AppProps) {
  return (
    //max-w-xl 
  <SWRConfig value={{fetcher : (url : string) => fetch(url).then((response) => response.json())}}>
    <div className='w-full max-w-3xl mx-auto'>
      <Component {...pageProps}/>
    </div>
  </SWRConfig>
  )
}
