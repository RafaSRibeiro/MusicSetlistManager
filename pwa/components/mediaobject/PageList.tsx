import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { MediaObject } from "../../types/MediaObject";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getMediaObjectsPath = (page?: string | string[] | undefined) =>
  `/media_objects${typeof page === "string" ? `?page=${page}` : ""}`;
export const getMediaObjects =
  (page?: string | string[] | undefined) => async () =>
    await fetch<PagedCollection<MediaObject>>(getMediaObjectsPath(page));
const getPagePath = (path: string) =>
  `/mediaobjects/page/${parsePage("media_objects", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: mediaobjects, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<MediaObject>> | undefined
  >(getMediaObjectsPath(page), getMediaObjects(page));
  const collection = useMercure(mediaobjects, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>MediaObject List</title>
        </Head>
      </div>
      <List mediaobjects={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
