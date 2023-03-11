import { PropsWithChildren, useState } from "react";
import { useAudioContext } from "../hooks/useAudioContext";

export const PlayButton = ({ children }: PropsWithChildren) => {
  const [started, setStarted] = useState(false);
  const context = useAudioContext();

  if (!started) {
    return (
      <button
        onClick={async () => {
          await context.resume();
          setStarted(true);
        }}
      >
        Play
      </button>
    );
  }

  return <>{children}</>;
};
