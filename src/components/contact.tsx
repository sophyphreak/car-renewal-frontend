import React from "react"
import {
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

import getErrorMessage from "../utils/getErrorMessage"
import SuccessCheckmark from "./success-checkmark"

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const Asterisk = () => <span style={{ color: "red" }}>*</span>

interface FormData {
  name: string
  email: string
  message: string
  [key: string]: string
}

const encode = (data: FormData): string => {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&")
}

const timeout = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [loading, setLoading] = React.useState(false)
  const onSubmit = async (data: FormData) => {
    // console.log(data)
    setLoading(true)
    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "contact", ...data }),
      })
      if (!response.ok) {
        setLoading(false)
        throw new Error(`HTTP request failed with status ${response.status}`)
      }
      console.log(response.json())
      reset()
      onOpen()
      await timeout(2000)
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
