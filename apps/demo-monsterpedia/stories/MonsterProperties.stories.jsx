import React, { useEffect, useState } from "react";
import MonsterProperties from "../components/MonsterProperties";

export default {
  title: "Basic Integration/Monster Properties",
  component: MonsterProperties,
  argTypes: {
    host: {
      name: "host",
      type: { required: true },
    },
    index: {
      name: "monster",
      type: { required: true },
    },
  },
  parameters: { controls: { sort: "requiredFirst" } },
};

export const MonsterLookup = Template.bind({});
MonsterLookup.args = {
  index: "adult-black-dragon",
  host: "https://www.dnd5eapi.co",
};

function Template(args) {
  const { index, host } = args;
  const [monster, setMonster] = useState();
  useEffect(() => {
    async function loadMonster() {
      const { index } = args;
      const response = await fetch(`${host}/api/monsters/${index}`);
      const json = await response.json();
      setMonster(json);
    }
    loadMonster();
  }, [index]);
  if (!monster) return <div />;
  return <MonsterProperties {...args} monster={monster} />;
}
