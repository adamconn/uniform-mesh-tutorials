import React, { useEffect, useState } from "react";
import { useUniformMeshLocation } from "@uniformdev/mesh-sdk-react";
import {
  Heading,
  Input,
  Button,
  LoadingOverlay,
  Callout,
} from "@uniformdev/design-system";
import { createClient, DEFAULT_BASE_MONSTER_URL } from "monsterpedia";

export default function Settings() {
  const { value, setValue } = useUniformMeshLocation();
  const [isWorking, setIsWorking] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [url, setUrl] = useState(value?.url);
  const [client, setClient] = useState(createClient());

  useEffect(() => {
    const client = createClient(url);
    setClient(client);
  }, [url]);

  async function onTest() {
    try {
      setIsWorking(true);
      if (!isValidUrl(url)) {
        setMessage({ type: "error", text: "URL is not valid." });
        return;
      }
      const monsters = await client.getMonsters();
      if (monsters?.length >= 0) {
        setMessage({
          type: "success",
          text: `This is a valid endpoint (${monsters.length} monsters returned)`,
        });
      } else {
        setMessage({
          type: "error",
          text: "The endpoint did not return the expected output.",
        });
      }
      return;
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsWorking(false);
    }
  }

  function isValidUrl(url) {
    try {
      if (url) new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  async function onSave() {
    if (!isValidUrl(url)) {
      setMessage({ type: "error", text: "URL is not valid." });
      return;
    }
    setIsWorking(true);
    try {
      await setValue({ url });
      setMessage({ type: "success", text: "Settings were saved." });
    } catch (error) {
      setMessage({
        type: "error",
        text: `Unable to save settings: ${error.message}`,
      });
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <>
      <Heading>Monsterpedia settings</Heading>
      <p>These settings are used to establish a connection Monsterpedia.</p>
      <div className="mt-4">
        <LoadingOverlay
          isActive={isWorking}
          statusMessage="Testing settings..."
        />
        {message ? (
          <Callout title={message.title} type={message.type}>
            {message.text}
          </Callout>
        ) : null}
      </div>
      <div className="mt-4">
        <Input
          caption="Specify the URL for the D&amp;D 5th Edition API."
          id="url"
          label="URL (optional)"
          placeholder={DEFAULT_BASE_MONSTER_URL}
          type="text"
          onChange={(e) => setUrl(e?.target?.value)}
        />
      </div>
      <div className="mt-4">
        <Button buttonType="secondary" className="mr-4" onClick={onSave}>
          Save
        </Button>
        <Button buttonType="primary" className="mr-4" onClick={onTest}>
          Test
        </Button>
      </div>
    </>
  );
}
