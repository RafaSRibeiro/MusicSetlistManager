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

import { Form } from "../../../components/music/Form";
import { PagedCollection } from "../../../types/collection";
import { Music } from "../../../types/Music";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getMusic = async (id: string | string[] | undefined) =>
  id ? await fetch<Music>(`/musics/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: music } = {} } = useQuery<
    FetchResponse<Music> | undefined
  >(["music", id], () => getMusic(id));

  if (!music) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{music && `Edit Music ${music["@id"]}`}</title>
        </Head>
      </div>
      <Form music={music} />
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
  const paths = await getItemPaths(response, "musics", "/musics/[id]/edit");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
