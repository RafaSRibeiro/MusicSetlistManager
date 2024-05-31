import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getMediaObjects,
  getMediaObjectsPath,
} from "../../../components/mediaobject/PageList";
import { PagedCollection } from "../../../types/collection";
import { MediaObject } from "../../../types/MediaObject";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    getMediaObjectsPath(page),
    getMediaObjects(page)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<MediaObject>>("/media_objects");
  const paths = await getCollectionPaths(
    response,
    "media_objects",
    "/mediaobjects/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
