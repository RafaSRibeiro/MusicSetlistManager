import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Playlist } from "../../types/Playlist";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getPlaylistsPath = (page?: string | string[] | undefined) =>
  `/playlists${typeof page === "string" ? `?page=${page}` : ""}`;
export const getPlaylists =
  (page?: string | string[] | undefined) => async () =>
    await fetch<PagedCollection<Playlist>>(getPlaylistsPath(page));
const getPagePath = (path: string) =>
  `/playlists/page/${parsePage("playlists", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: playlists, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Playlist>> | undefined
  >(getPlaylistsPath(page), getPlaylists(page));
  const collection = useMercure(playlists, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Playlist List</title>
        </Head>
      </div>
      <List playlists={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
