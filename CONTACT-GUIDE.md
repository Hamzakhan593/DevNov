# DevNov contact form

The public contact section always displays an enquiry form. It sends directly to the existing Web3Forms endpoint from the page; visitors do not need to open an email application. This integration is separate from the existing Supabase/admin functionality.

## Current delivery

Delivery is configured for **hamzakhanpathan593@gmail.com**, the temporary inbox confirmed by the owner. The free Web3Forms form is named **DevNov Website Enquiries**. A real website submission was received in that Gmail inbox on 4 November 2026, and its Reply-To matched the email entered in the form.

The verified public form identifier is included in `contact.accessKey` in `src/data/agencyData.js`, so normal production builds include the working configuration. The optional `VITE_WEB3FORMS_ACCESS_KEY` setting takes precedence when supplied. The temporary environment entry used during setup was removed; other environment settings remain intact.

## Change the recipient later

1. Obtain a Web3Forms public access key verified for the new inbox. The displayed contact email currently comes from `src/data/siteConfig.json`.
2. Update that displayed email and the public `contact.accessKey` value together. Alternatively, override the key with `VITE_WEB3FORMS_ACCESS_KEY` in the development and hosting build environments.
3. Restart the development server or rebuild the site so Vite includes the new public key.
4. With the inbox owner's authorization, submit a real test enquiry and verify it arrives in that inbox, including spam folders.

Changing the displayed contact email does not change the delivery recipient: Web3Forms routes submissions to the inbox associated with its access key. Use a key verified for the correct inbox.

Web3Forms access keys are intended for client-side use. Do not put private credentials in any `VITE_` setting. Provider documentation: [installation](https://docs.web3forms.com/getting-started/installation), [reply-to behavior](https://docs.web3forms.com/getting-started/customizations/custom-reply-to).

## Form behavior

- Name, email and message are required; project type is optional. Inline errors identify invalid fields and focus moves to the first invalid field.
- Submissions include a honeypot and the visitor's email as `replyto` so replies can be addressed to that visitor.
- While sending, inputs and the submit control are disabled to prevent duplicate submissions.
- Success appears only after an HTTP success response with `success: true` from Web3Forms. The form then clears.
- A provider rejection, invalid response, network failure or timeout shows an error and preserves the visitor's message.
- If no usable access key is configured, submitting valid details reports that the form is not connected. It sends no request and never displays a success message or opens an email draft.

Browser checks can intercept the Web3Forms request and return controlled success/failure responses without sending email. Those checks verify interface behavior; only an authorized real inbox test verifies actual delivery.
