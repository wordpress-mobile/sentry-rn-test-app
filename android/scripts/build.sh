#!/bin/bash

rm -rf bundle/android
mkdir -p bundle/android

cd android
rm -rf app/build
./gradlew assembleRelease

cp app/build/generated/sourcemaps/react/release/index.android.bundle.map ../bundle/android/index.android.bundle.map
cp app/build/generated/assets/react/release/index.android.bundle ../bundle/android/index.android.bundle.js
cp app/build/outputs/apk/release/app-release.apk ../bundle/android/app.apk

export SENTRY_ORG=a8c
export SENTRY_PROJECT=sentry-testing

RELEASE_ID=$(./gradlew printVersionName | grep -)
sentry-cli releases new $RELEASE_ID
sentry-cli releases files $RELEASE_ID upload-sourcemaps ../bundle/android
sentry-cli releases finalize $RELEASE_ID

echo "$RELEASE_ID has been built and released"
