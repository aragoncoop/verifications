# Aragon Verifications

## What’s this?

A simple crawler to parse all the signatures available in the [aragon membership thread](https://forum.aragon.org/t/aragon-cooperative-membership-thread/463) in order to showcase 
how many people had verified themselves.

## Tech stack

* [create-next-app](https://github.com/segmentio/create-next-app) 
* [yarn](https://yarnpkg.com/lang/en/docs/cli/create/)
* [styled components](https://www.styled-components.com/)
* [nightmare](https://github.com/segmentio/nightmare)
* [aragon-ui](https://github.com/aragon/aragon-ui)
* [keybase-verify](https://github.com/jjperezaguinaga/keybase-verify)

## Run locally

```bash
yarn
yarn dev
```

## Deploy
```bash
now
```

## ToDo

* [X] ~Integrate `keybase-verify` to actually confirm each individual PGP signature.~
* [X] ~Implement scrolling into ~Nightmare~ Puppeteer to fetch all posts or use a more sensible API~
* [X] ~Filter repeated posts.~
* [ ] Ignore poorly parsed posts.
* [X] ~Make it less of an eye-sore.~
* [ ] Only obtained posts that contained armored PGP signatures
* [ ] Identify usernames from keybase compared from forum chat.
* [X] ~Replace nightmare for something that doesn’t syphons out memory.~
* [X] ~Moved server side logic for scrapping into a script-run-once logic since poor-man-servers suck for scrappping.~
* [X] ~Figure it out how to verify signature of non-PGP armored signatures.~
* [X] ~Made button not overflow.~