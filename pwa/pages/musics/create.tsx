import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/music/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Music</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
