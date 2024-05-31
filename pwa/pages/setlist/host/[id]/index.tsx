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
import { useRef } from "react";
import Slider from "react-slick";
import MusicSlide from "@/components/MusicSlide";

const getPlaylist = async (id: string | string[] | undefined) =>
  id ? await fetch<Playlist>(`/playlists/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const sliderRef = useRef<Slider>(null);
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

  const handleSlideChange = (currentSlide: number) => {
    // Envia uma solicitação POST ao servidor Mercure
    fetch("/change-slide", {
      method: "POST",
      body: JSON.stringify({
        topic: "/slide" + id,
        slideIndex: currentSlide,
      }),
    })
      .then((data) => {
        console.log("Slide atualizado com sucesso:", data);
      })
      .catch((error) => {
        console.error("Erro ao atualizar o slide:", error);
      });
  };

  const settings = {
    dots: true,
    infinite: true,
    afterChange: handleSlideChange,
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
  const paths = await getItemPaths(response, "playlists", "/setlist/host/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
