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

import { Form } from "../../../components/playlist/Form";
import { PagedCollection } from "../../../types/collection";
import { Playlist } from "../../../types/Playlist";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getPlaylist = async (id: string | string[] | undefined) =>
  id ? await fetch<Playlist>(`/playlists/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: playlist } = {} } = useQuery<
    FetchResponse<Playlist> | undefined
  >(["playlist", id], () => getPlaylist(id));

  if (!playlist) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{playlist && `Edit Playlist ${playlist["@id"]}`}</title>
        </Head>
      </div>
      <Form playlist={playlist} />
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
  const paths = await getItemPaths(
    response,
    "playlists",
    "/playlists/[id]/edit"
  );

  return {
    paths,
    fallback: true,
  };
};

export default Page;
