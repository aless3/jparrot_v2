import { shallow } from "enzyme";
import { SimpleCloud } from "../src/components/SimpleCloud";
import React from "react";
import axios from "axios";

test("check if the component renders correctly using stored blobs", async () => {
  let value = null;
  const setter = (val) => {
    value = val || 1;
  };

  const terms = await axios.get("http://localhost:8000/terms");

  const cloud = shallow(
    <SimpleCloud values={terms.data} setter={setter} className='cloud' />
  );

  expect(cloud).toMatchSnapshot();

  let tagCloud = cloud.find("TagCloud");

  tagCloud.simulate("click", 1);

  expect(value).toBeTruthy();
});
