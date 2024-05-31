import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/mediaobject/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create MediaObject</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
