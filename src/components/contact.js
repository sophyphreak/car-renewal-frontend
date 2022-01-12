import React from "react"
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  Button,
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const Asterisk = () => <span style={{ color: "red" }}>*</span>

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()
  const onSubmit = data => {
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({ "form-name": "contact", ...data }),
    })
      .then(() => alert("Success!"))
      .catch(error => alert(error))
    reset()
  }
  return (
    <form
      name="contact"
      onSubmit={handleSubmit(onSubmit)}
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      style={{ border: "solid", padding: "1rem", borderRadius: "1rem" }}
    >
      <h3>Contact us</h3>
      <input type="hidden" name="form-name" value="contact" />
      <p>
        <FormControl isInvalid={errors.name}>
          <FormLabel htmlFor="name">
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
      </p>
      <p>
        <FormControl isInvalid={errors.email}>
          <FormLabel htmlFor="email">
            Email: <Asterisk />
          </FormLabel>
          <Input
            {...register("email", {
              required: true,
              pattern: emailRegex,
            })}
          />
          {!errors.email && (
            <FormHelperText>We'll never share your email.</FormHelperText>
          )}
          {errors.email?.type === "required" && (
            <FormErrorMessage>Email is required.</FormErrorMessage>
          )}
          {errors.email?.type === "pattern" && (
            <FormErrorMessage>Must be a valid email.</FormErrorMessage>
          )}
        </FormControl>
      </p>
      <p>
        <FormControl isInvalid={errors.message}>
          <FormLabel htmlFor="message">
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
      </p>
      <p>
        <Button type="submit" colorScheme="blue">
          Send
        </Button>
      </p>
    </form>
  )
}

const encode = data => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&")
}

export default Contact
