#!/bin/bash

BUILD_DIRECTORY_PATH="/Users/wanlok/Files/Projects/wanlok-component-react/build"
GITHUB_PAGES_DIRECTORY_PATH="/Users/wanlok/Files/Projects/wanlok.github.io"

rm -rf "$BUILD_DIRECTORY_PATH"

find "$GITHUB_PAGES_DIRECTORY_PATH" -mindepth 1 -not -path "$GITHUB_PAGES_DIRECTORY_PATH/.git" -not -path "$GITHUB_PAGES_DIRECTORY_PATH/.git/*" -exec rm -rf {} +

npm run build && {
  cp -r "$BUILD_DIRECTORY_PATH/." "$GITHUB_PAGES_DIRECTORY_PATH"
  rm -rf "$BUILD_DIRECTORY_PATH"
  cd $GITHUB_PAGES_DIRECTORY_PATH
  git add .
  git commit -m "commit"
  git push
}
