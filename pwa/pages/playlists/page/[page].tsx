import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getPlaylists,
  getPlaylistsPath,
} from "../../../components/playlist/PageList";
import { PagedCollection } from "../../../types/collection";
import { Playlist } from "../../../types/Playlist";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getPlaylistsPath(page), getPlaylists(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Playlist>>("/playlists");
  const paths = await getCollectionPaths(
    response,
    "playlists",
    "/playlists/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
