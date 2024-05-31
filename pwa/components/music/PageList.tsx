import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Music } from "../../types/Music";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getMusicsPath = (page?: string | string[] | undefined) =>
  `/musics${typeof page === "string" ? `?page=${page}` : ""}`;
export const getMusics = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Music>>(getMusicsPath(page));
const getPagePath = (path: string) =>
  `/musics/page/${parsePage("musics", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: musics, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Music>> | undefined
  >(getMusicsPath(page), getMusics(page));
  const collection = useMercure(musics, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Music List</title>
        </Head>
      </div>
      <List musics={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
