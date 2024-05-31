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

import { Show } from "../../../components/playlist/Show";
import { PagedCollection } from "../../../types/collection";
import { Playlist } from "../../../types/Playlist";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getPlaylist = async (id: string | string[] | undefined) =>
  id ? await fetch<Playlist>(`/playlists/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: { data: playlist, hubURL, text } = { hubURL: null, text: "" },
  } = useQuery<FetchResponse<Playlist> | undefined>(["playlist", id], () =>
    getPlaylist(id)
  );
  const playlistData = useMercure(playlist, hubURL);

  if (!playlistData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Playlist ${playlistData["@id"]}`}</title>
        </Head>
      </div>
      <Show playlist={playlistData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["playlist", id], () => getPlaylist(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Playlist>>("/playlists");
  const paths = await getItemPaths(response, "playlists", "/playlists/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
