import React from "react"
import { Checkmark } from "react-checkmark"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react"

const SuccessCheckmark = ({ isOpen }) => {
  return (
    <>
      <AlertDialog motionPreset="slideInBottom" isOpen={isOpen} isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent width="6rem" height="6rem" borderRadius="50%">
          <Checkmark size="xxLarge" />
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default SuccessCheckmark
