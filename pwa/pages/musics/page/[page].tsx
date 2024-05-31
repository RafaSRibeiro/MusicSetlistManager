import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getMusics,
  getMusicsPath,
} from "../../../components/music/PageList";
import { PagedCollection } from "../../../types/collection";
import { Music } from "../../../types/Music";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getMusicsPath(page), getMusics(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Music>>("/musics");
  const paths = await getCollectionPaths(
    response,
    "musics",
    "/musics/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
