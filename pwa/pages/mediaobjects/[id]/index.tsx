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

import { Show } from "../../../components/mediaobject/Show";
import { PagedCollection } from "../../../types/collection";
import { MediaObject } from "../../../types/MediaObject";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getMediaObject = async (id: string | string[] | undefined) =>
  id
    ? await fetch<MediaObject>(`/media_objects/${id}`)
    : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: { data: mediaobject, hubURL, text } = { hubURL: null, text: "" },
  } = useQuery<FetchResponse<MediaObject> | undefined>(
    ["mediaobject", id],
    () => getMediaObject(id)
  );
  const mediaobjectData = useMercure(mediaobject, hubURL);

  if (!mediaobjectData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show MediaObject ${mediaobjectData["@id"]}`}</title>
        </Head>
      </div>
      <Show mediaobject={mediaobjectData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["mediaobject", id], () =>
    getMediaObject(id)
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
  const paths = await getItemPaths(
    response,
    "media_objects",
    "/mediaobjects/[id]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default Page;
