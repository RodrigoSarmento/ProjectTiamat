import type { StoryNodeId } from '@data/story';

export interface IGameDebugJump {
  nodeIds: StoryNodeId[];
  onJump: (nodeId: StoryNodeId) => void;
}

export interface IGameDebugDice {
  onForceSuccess: () => void;
  onForceFailure: () => void;
}
