interface ObjectProps {
  [key: string]: string
}

const encode = (data: ObjectProps) => {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&")
}

export const postContact = (data: ObjectProps) => {
  return fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encode({ "form-name": "contact", ...data }),
  })
}
