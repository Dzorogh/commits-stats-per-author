#!/bin/sh

# Decrypt the file
#mkdir $HOME/secrets
# --batch to prevent interactive command
# --yes to assume "yes" for questions
gpg --quiet --batch --yes --decrypt --passphrase="$SECRETS_PASSPHRASE" \
--output $HOME/.env $HOME/.github/secrets/.env.gpg

gpg --quiet --batch --yes --decrypt --passphrase="$SECRETS_PASSPHRASE" \
--output $HOME/appconfig.json $HOME/.github/secrets/appconfig.json.gpg
