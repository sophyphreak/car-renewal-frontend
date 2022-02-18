import React from "react"
import { Checkmark } from "react-checkmark"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react"

interface SuccessCheckmarkProps {
  isOpen: boolean
}

const SuccessCheckmark = ({ isOpen }: SuccessCheckmarkProps) => {
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      isOpen={isOpen}
      isCentered
      leastDestructiveRef={undefined}
      onClose={() => {}}
    >
      <AlertDialogOverlay />
      <AlertDialogContent width="6rem" height="6rem" borderRadius="50%">
        <Checkmark size="xxLarge" />
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default SuccessCheckmark
