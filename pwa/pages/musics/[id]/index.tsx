import {
  GetStaticPaths,
  GetStaticProps,
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { Show } from "../../../components/music/Show";
import { PagedCollection } from "../../../types/collection";
import { Music } from "../../../types/Music";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getMusic = async (id: string | string[] | undefined) =>
  id ? await fetch<Music>(`/musics/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: music, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Music> | undefined>(["music", id], () =>
      getMusic(id)
    );
  const musicData = useMercure(music, hubURL);

  if (!musicData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Music ${musicData["@id"]}`}</title>
        </Head>
      </div>
      <Show music={musicData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["music", id], () => getMusic(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Music>>("/musics");
  const paths = await getItemPaths(response, "musics", "/musics/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
