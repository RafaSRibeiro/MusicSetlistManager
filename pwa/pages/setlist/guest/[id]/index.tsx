import {
  GetStaticPaths,
  GetStaticProps,
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { PagedCollection } from "@/types/collection";
import { Playlist } from "@/types/Playlist";
import { fetch, FetchResponse, getItemPaths } from "@/utils/dataAccess";
import { useMercure } from "@/utils/mercure";
import CustomSlider from "@/components/CustomSlider";
import { useEffect, useRef } from "react";
import Slider from "react-slick";
import MusicSlide from "@/components/MusicSlide";

const getPlaylist = async (id: string | string[] | undefined) =>
  id ? await fetch<Playlist>(`/playlists/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const sliderRef = useRef<Slider>(null);
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    const url = new URL("https://localhost/.well-known/mercure");
    url.searchParams.append("topic", "/slide" + id);

    const eventSource = new EventSource(url.toString());

    eventSource.onmessage = function (event) {
      const data = JSON.parse(event.data);
      const slideIndex = data.slideIndex;
      if (sliderRef.current) {
        sliderRef.current.slickGoTo(slideIndex);
      }
    };

    eventSource.onerror = function (error) {
      console.error("Erro na conexão com o servidor Mercure:", error);
    };

    return () => {
      eventSource.close();
    };
  }, [id]);

  const {
    data: { data: playlist, hubURL, text } = { hubURL: null, text: "" },
  } = useQuery<FetchResponse<Playlist> | undefined>(["playlist", id], () =>
    getPlaylist(id)
  );
  const playlistData = useMercure(playlist, hubURL);

  if (!playlistData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  const settings = {
    dots: true,
    infinite: true,
  };

  return (
    <CustomSlider ref={sliderRef} {...settings}>
      {playlistData.musics?.map((music) => {
        const { image, _id, name } = music;
        return (
          <MusicSlide
            key={_id}
            src={"http://php" + image.contentUrl}
            alt={name}
          />
        );
      })}
    </CustomSlider>
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
    "/setlist/guest/[id]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default Page;
