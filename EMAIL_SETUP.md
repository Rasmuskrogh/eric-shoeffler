# Email Setup Instructions

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CONTACT_EMAIL=your-contact-email@gmail.com
```

## Gmail Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `EMAIL_PASS`

## Alternative Email Providers

You can also use other email providers by modifying the transporter configuration in `app/api/contact/route.ts`:

- **Outlook/Hotmail**: Use `service: 'hotmail'`
- **Yahoo**: Use `service: 'yahoo'`
- **Custom SMTP**: Configure with host, port, and auth settings

## Testing

1. Start your development server: `npm run dev`
2. Fill out the contact form
3. Check your email for the message
4. Check the browser console for any errors
