#!/bin/sh

# --batch to prevent interactive command
# --yes to assume "yes" for questions
gpg --quiet --batch --yes --decrypt --passphrase="$SECRETS_PASSPHRASE" \
--output $GITHUB_WORKSPACE/.env $GITHUB_WORKSPACE/.github/secrets/.env.gpg

gpg --quiet --batch --yes --decrypt --passphrase="$SECRETS_PASSPHRASE" \
--output $GITHUB_WORKSPACE/appconfig.json $GITHUB_WORKSPACE/.github/secrets/appconfig.json.gpg
