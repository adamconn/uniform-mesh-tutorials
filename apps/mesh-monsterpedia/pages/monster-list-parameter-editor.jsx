import React, { useEffect, useState } from "react";
import {
  EntrySearch,
  useUniformMeshLocation,
} from "@uniformdev/mesh-sdk-react";
import { LoadingIndicator } from "@uniformdev/design-system";
import { createClient } from "monsterpedia";


// const data = [
//   {
//     id: "some-entry",
//     title: "Some Entry",
//     popoverData: { something: "hello, world" },
//     createdDate: "2000-01-01T00:00:00",
//     metadata: { Updated: "1 month ago" },
//   },
//   { id: "some-other-entry", title: "Some Other Entry" },
//   {
//     id: "and-another-one",
//     title: "And Another One",
//     editLink: "https://uniform.dev",
//   },
// ];

function toResult(monster) {
  const { index, name, url } = monster;
  return { id: index, title: name, metadata: { index, url } };
}

function getSearchResults(filter, monsters) {
  if (!monsters) {
    return [];
  }
  if (!filter) {
    return monsters.map(toResult);
  }
  const regex = new RegExp(filter, "i");
  const filtered = monsters.filter((monster) => {
    return monster.name.match(regex);
  });
  return filtered.map(toResult);
}

export default function MonsterListParameterEditor() {
  const { value, setValue, metadata } = useUniformMeshLocation();
  const filter = metadata?.parameterDefinition?.typeConfig?.filter;

  const [loading, setLoading] = useState(true);

  const [monsters, setMonsters] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchText, setSearchText] = useState();

  useEffect(() => {
    async function getMonsters() {
      const client = createClient();
      const monsters = await client.getMonsters(filter);
      setMonsters(monsters);
      const results = getSearchResults(searchText, monsters);
      setResults(results);
      if (value) {
        const selected = results.filter((result) => result.id == value);
        setSelectedItems(selected);
      }
      setLoading(false);
    }
    getMonsters();
  }, []);

  useEffect(() => {
    if (value) {
      const selected = results.filter((result) => result.id == value);
      setSelectedItems(selected);
      return;
    }
    setSelectedItems();
  }, [value]);

  useEffect(() => {
    const results = getSearchResults(searchText, monsters);
    setResults(results);
  }, [searchText]);

  const onSearch = (text) => setSearchText(text);

  const onSelect = (selected) => {
    if (selected && selected.length == 1) {
      setValue(selected[0].id);
    } else {
      setValue("");
    }
  };

  return (
    <div>
      {loading && <LoadingIndicator />}
      {!loading && (
        <EntrySearch
          logoIcon="/monster-badge.svg"
          multiSelect={false}
          results={results}
          search={onSearch}
          select={onSelect}
          selectedItems={selectedItems}
        />
      )}
    </div>
  );
}
