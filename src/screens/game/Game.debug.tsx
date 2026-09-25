import React, { useState } from 'react';

import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import type { IGameDebugJump } from './Game.debug.types';
import { styles } from './Game.styles';

const GameDebugJump: React.FC<IGameDebugJump> = ({ nodeIds, onJump }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Pressable
        testID="GameDebugJump"
        accessibilityRole="button"
        accessibilityLabel="Jump to story node"
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
