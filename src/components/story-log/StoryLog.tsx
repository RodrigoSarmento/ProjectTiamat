import React, { useRef, useState } from 'react';

import { Modal, ScrollView, Text, View } from 'react-native';

import { ImageButton } from '@components/image-button';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './StoryLog.styles';
import type { IStoryLog } from './StoryLog.types';

const logIcon = require('@assets/icons/icon_log.png');

const StoryLog: React.FC<IStoryLog> = ({ entries }) => {
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  return (
    <>
      <ImageButton
        testID="StoryLog-open"
        source={logIcon}
        onPress={() => setIsOpen(true)}
        style={styles.icon}
        containerStyle={styles.iconButton}
      />
      <Modal
        testID="StoryLog"
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modal}>
          <SafeAreaView style={styles.modalSafe}>
            <ImageButton
              testID="StoryLog-close"
              source={logIcon}
              onPress={() => setIsOpen(false)}
              style={styles.icon}
              containerStyle={styles.iconButton}
            />
            <ScrollView
              ref={scrollRef}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              onContentSizeChange={() =>
                scrollRef.current?.scrollToEnd({ animated: false })
              }
            >
              {entries.map((entry) => (
                <View
                  key={entry.key}
                  testID={`StoryLog-${entry.key}`}
                  style={styles.entry}
                >
                  {entry.speaker ? (
                    <Text style={styles.speaker}>{entry.speaker}</Text>
                  ) : null}
                  {entry.title ? (
                    <Text style={styles.title}>{entry.title}</Text>
                  ) : null}
                  <Text style={styles.text}>{entry.text}</Text>
                </View>
              ))}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
};

export default StoryLog;
