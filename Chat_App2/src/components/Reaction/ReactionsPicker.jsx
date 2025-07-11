import { ReactionBarSelector } from "@charkour/react-reactions";

function ReactionsPicker({ handlePickReaction }) {
  const reactionIcons = {
    satisfaction: "👍",
    love: "❤️",
    surprise: "😮",
    happy: "😆",
    sad: "😢",
    angry: "😡",
  };

  return (
    <div className='flex justify-center items-center gap-4'>
      <ReactionBarSelector
        onSelect={(emoji) => handlePickReaction(reactionIcons[emoji])}
        iconSize={24}
        style={{
          border: "none",
          outline: "none",
        }}
      />
    </div>
  );
}

export default ReactionsPicker;
