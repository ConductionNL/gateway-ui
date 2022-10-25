// "number" "integer" "object"

export const schema = {
  id: "https://example.com/person.schema.json",
  schema: "https://json-schema.org/draft/2020-12/schema",
  title: "Notification Action",
  description: "Lorem ipsum",
  required: ["ServiceDNS", "template", "sender", "reciever", "subject"],
  properties: {
    serviceDNS: {
      type: "string",
      description: "The DNS of the mail provider, see https://symfony.com/doc/6.2/mailer.html for details",
      example: "native://default",
    },
    template: {
      type: "string",
      description: "The actual email template, should be a base64 encoded twig template",
      example: "eyMgdG9kbzogbW92ZSCg==",
    },
    variables: {
      type: "array",
      description: "The variables supported by this template (might contain default vallues)",
      default: {
        token: "123",
      },
    },
    sender: {
      type: "string",
      description: "The sender of the email",
      example: "info@conduction.nl",
    },
    receiver: {
      type: "string",
      description: "The receiver of the email",
      example: "j.do@conduction.nl",
    },
    subject: {
      type: "string",
      description: "The subject of the email",
      example: "Your weekly update",
    },
    cc: {
      type: "string",
      description: "Carbon copy, email boxes that should receive a copy of  this mail",
      example: "archive@conduction.nl",
    },
    bcc: {
      type: "string",
      description: "Blind carbon copy, people that should receive a copy without other recipient knowing",
      example: "b.brother@conduction.nl",
    },
    replyTo: {
      type: "string",
      description: "The address the receiver should reply to, only provide this if it differs from the sender address",
      example: "no-reply@conduction.nl",
    },
    priority: {
      type: "string",
      description: "An optional priority for the email",
      default: "hier default",
      example: "hier placeholder",
    },
    includeObject: {
      type: "boolean",
      description: "Whether to include  the object in the notification",
      default: true,
      example: false,
    },
  },
};
