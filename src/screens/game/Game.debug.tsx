import React, { useState } from 'react';

import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import type { IGameDebugDice, IGameDebugJump } from './Game.debug.types';
import { styles } from './Game.styles';

export const GameDebugDice: React.FC<IGameDebugDice> = ({
  onForceSuccess,
  onForceFailure,
}) => (
  <View style={styles.diceDebugRow}>
    <Pressable
      testID="GameDebugDice-success"
      onPress={onForceSuccess}
      style={styles.diceDebugButton}
    >
      <Text style={styles.debugButtonLabel}>SUCCESS</Text>
    </Pressable>
    <Pressable
      testID="GameDebugDice-failure"
      onPress={onForceFailure}
      style={styles.diceDebugButton}
    >
      <Text style={styles.debugButtonLabel}>FAIL</Text>
    </Pressable>
  </View>
);

const GameDebugJump: React.FC<IGameDebugJump> = ({ nodeIds, onJump }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Pressable
        testID="GameDebugJump"
        onPress={() => setIsOpen(true)}
        style={styles.debugButton}
      >
        <Text style={styles.debugButtonLabel}>DEV</Text>
      </Pressable>
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.debugModal}>
          <Pressable
            testID="GameDebugJump-backdrop"
            style={styles.debugBackdrop}
            onPress={() => setIsOpen(false)}
          />
          <ScrollView style={styles.debugList}>
            {[...nodeIds].map((nodeId) => (
              <Pressable
                key={nodeId}
                testID={`GameDebugJump-${nodeId}`}
                onPress={() => {
                  onJump(nodeId);
                  setIsOpen(false);
                }}
                style={styles.debugRow}
              >
                <Text style={styles.debugRowLabel}>{nodeId}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

export default GameDebugJump;
