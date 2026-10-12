import { StyleSheet } from 'react-native';

import { Colors, Common } from '@styles';
import { bold, regular, semiBold } from '@styles/Font';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: Common.contentPaddingHorizontal,
  },
  list: {
    gap: 14,
  },
  modal: {
    backgroundColor: 'rgba(10, 10, 16, 0.96)',
    borderWidth: 1.5,
    borderColor: Colors.neonMagenta,
    borderRadius: 4,
  },
  modalTitle: {
    ...bold,
    fontSize: 22,
    letterSpacing: 0.5,
    color: Colors.warningRed,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalMessage: {
    ...regular,
    fontSize: 16,
    lineHeight: 22,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 2,
    borderColor: Colors.neonCyan,
  },
  modalButtonDanger: {
    borderColor: Colors.warningRed,
    backgroundColor: 'rgba(233, 56, 56, 0.15)',
  },
  modalButtonPressed: {
    opacity: 0.7,
  },
  modalButtonLabel: {
    ...semiBold,
    fontSize: 16,
    letterSpacing: 0.5,
    color: Colors.neonCyan,
  },
  modalButtonLabelDanger: {
    color: Colors.warningRed,
  },
});
