# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Login Page >> navigates to 2FA screen with valid credentials
- Location: tests/auth.spec.js:49:3

# Error details

```
Error: Channel closed
```

# Page snapshot

```yaml
- main [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]: ⬡
      - heading "VaultX" [level=1] [ref=e7]
      - paragraph [ref=e8]: Your crypto command centre
    - generic [ref=e9]:
      - heading "Sign in" [level=2] [ref=e10]
      - generic [ref=e11]:
        - generic [ref=e12]: Email
        - textbox "Email" [ref=e13]:
          - /placeholder: you@vaultx.io
        - generic [ref=e14]: Password
        - textbox "Password" [ref=e15]:
          - /placeholder: ••••••••
        - button "Continue →" [ref=e16] [cursor=pointer]
      - generic [ref=e17]:
        - paragraph [ref=e18]: 🧪 Test Credentials
        - paragraph [ref=e19]: qa@vaultx.io / Test@1234
        - paragraph [ref=e20]: intern@vaultx.io / Intern@99
```