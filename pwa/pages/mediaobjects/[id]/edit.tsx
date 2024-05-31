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

import { Form } from "../../../components/mediaobject/Form";
import { PagedCollection } from "../../../types/collection";
import { MediaObject } from "../../../types/MediaObject";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getMediaObject = async (id: string | string[] | undefined) =>
  id
    ? await fetch<MediaObject>(`/media_objects/${id}`)
    : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: mediaobject } = {} } = useQuery<
    FetchResponse<MediaObject> | undefined
  >(["mediaobject", id], () => getMediaObject(id));

  if (!mediaobject) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>
            {mediaobject && `Edit MediaObject ${mediaobject["@id"]}`}
          </title>
        </Head>
      </div>
      <Form mediaobject={mediaobject} />
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
    "/mediaobjects/[id]/edit"
  );

  return {
    paths,
    fallback: true,
  };
};

export default Page;
