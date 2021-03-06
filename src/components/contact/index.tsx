import React from "react"
import {
  Alert,
  AlertTitle,
  AlertDescription,
  CloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  Button,
  Stack,
  Box,
  Heading,
  useDisclosure,
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"

import getErrorMessage from "../../utils/getErrorMessage"
import SuccessCheckmark from "../success-checkmark"
import { postContact } from "./postContact"
import { emailRegex, timeout, delay } from "./utils"

const Asterisk = () => <span style={{ color: "red" }}>*</span>

interface FormData {
  name: string
  email: string
  message: string
  [key: string]: string
}

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [loading, setLoading] = React.useState(false)
  const [isServerError, setIsServerError] = React.useState(false)
  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const response = await postContact(data)

      if (!response.ok) {
        setLoading(false)
        setIsServerError(true)
        throw new Error(`HTTP request failed with status ${response.status}`)
      }

      reset()
      onOpen()
      await timeout(delay)
      onClose()
      setLoading(false)
    } catch (err: unknown) {
      console.error(getErrorMessage(err))
    }
  }
  return (
    <>
      <SuccessCheckmark isOpen={isOpen} />
      <Box
        as="form"
        name="contact"
        onSubmit={handleSubmit(onSubmit)}
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        border="solid"
        p="1rem"
        borderRadius="1rem"
        my={10}
        mx={[0, 0, 10, 10]}
      >
        <Stack spacing={5}>
          <Heading as="h3">Contact us</Heading>
          <input type="hidden" name="form-name" value="contact" />
          <FormControl isInvalid={!!errors.name}>
            <FormLabel>
              Name: <Asterisk />
            </FormLabel>
            <Input {...register("name", { required: true })} />
            {!errors.name && (
              <FormHelperText>So we can call you by name :-)</FormHelperText>
            )}
            {errors.name?.type === "required" && (
              <FormErrorMessage>Name is required.</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel>
              Email: <Asterisk />
            </FormLabel>
            <Input
              {...register("email", {
                required: true,
                pattern: emailRegex,
              })}
            />
            {!errors.email && (
              <FormHelperText>
                We&apos;ll never share your email.
              </FormHelperText>
            )}
            {errors.email?.type === "required" && (
              <FormErrorMessage>Email is required.</FormErrorMessage>
            )}
            {errors.email?.type === "pattern" && (
              <FormErrorMessage>Must be a valid email.</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.message}>
            <FormLabel>
              Message: <Asterisk />
            </FormLabel>
            <Textarea
              {...register("message", {
                minLength: 5,
                maxLength: 10000,
                required: true,
              })}
            />
            {!errors.message && (
              <FormHelperText>What is it you want to say?</FormHelperText>
            )}
            {errors.message?.type === "required" && (
              <FormErrorMessage>Message is required.</FormErrorMessage>
            )}
            {errors.message?.type === "minLength" && (
              <FormErrorMessage>
                Message must be at least 5 characters long.
              </FormErrorMessage>
            )}
            {errors.message?.type === "maxLength" && (
              <FormErrorMessage>
                Message must be 10,000 characters long or shorter.
              </FormErrorMessage>
            )}
          </FormControl>
          <Box>
            {isServerError && (
              <Alert status="error" mb={4}>
                <AlertTitle mr={2}>Server error occurred!</AlertTitle>
                <AlertDescription>
                  Your message was not recieved. Please try again later
                </AlertDescription>
                <CloseButton position="absolute" right="8px" top="8px" />
              </Alert>
            )}
            <Button
              isLoading={loading}
              loadingText="Submitting"
              type="submit"
              colorScheme="teal"
            >
              Send
            </Button>
          </Box>
        </Stack>
      </Box>
    </>
  )
}

export default Contact
