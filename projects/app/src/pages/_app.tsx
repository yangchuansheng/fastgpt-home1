import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import Head from 'next/head';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import Layout from '@/components/Layout';
import { theme } from '@/web/styles/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NProgress from 'nprogress'; //nprogress module
import Router from 'next/router';
import { appWithTranslation, useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useSystemStore } from '@/web/common/system/useSystemStore';
import { change2DefaultLng, setLngStore } from '@/web/common/utils/i18n';

import 'nprogress/nprogress.css';
import '@/web/styles/reset.scss';

//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 10
    }
  }
});

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { hiId } = router.query as { hiId?: string };
  const { i18n } = useTranslation();
  const { setLastRoute } = useSystemStore();
  // const [scripts, setScripts] = useState<FeConfigsType['scripts']>([]);

  useEffect(() => {
    // get init data
    // (async () => {
    //   const {
    //     feConfigs: { scripts, isPlus }
    //   } = await clientInitData();

    //   // log fastgpt
    //   !isPlus &&
    //     console.log(
    //       '%cWelcome to FastGPT',
    //       'font-family:Arial; color:#3370ff ; font-size:18px; font-weight:bold;',
    //       `GitHub：https://github.com/labring/FastGPT`
    //     );
    //   setScripts(scripts || []);
    // })();

    // add window error track
    window.onerror = function (msg, url) {
      window.umami?.track('windowError', {
        device: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          appName: navigator.appName
        },
        msg,
        url
      });
    };

    return () => {
      window.onerror = null;
    };
  }, []);

  useEffect(() => {
    // get default language
    const targetLng = change2DefaultLng(i18n.language);
    if (targetLng) {
      setLngStore(targetLng);
      router.replace(router.asPath, undefined, { locale: targetLng });
    }
  }, []);

  useEffect(() => {
    hiId && localStorage.setItem('inviterId', hiId);
  }, [hiId]);

  return (
    <>
      <Head>
        {/* <title>{feConfigs?.systemTitle || process.env.SYSTEM_NAME || ''}</title> */}
        <title>{ 'FastGPT'}</title>
        <meta
          name="description"
          content="FastGPT 是一个大模型应用编排系统，提供开箱即用的数据处理、模型调用等能力，可以快速的构建知识库并通过 Flow 可视化进行工作流编排，实现复杂的知识库场景！"
        />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no, viewport-fit=cover"
        />
        {/* <link rel="icon" href={feConfigs.favicon || process.env.SYSTEM_FAVICON} /> */}
        <link rel="icon" href='/favicon.ico' />
      </Head>
      {/* {scripts?.map((item, i) => <Script key={i} strategy="lazyOnload" {...item}></Script>)} */}

      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </QueryClientProvider>
    </>
  );
}

// @ts-ignore
export default appWithTranslation(App);