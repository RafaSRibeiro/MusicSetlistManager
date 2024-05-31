import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/playlist/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Playlist</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
