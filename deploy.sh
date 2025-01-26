#!/bin/bash

REPOSITORY_PATH="/Users/wanlok/Files/Projects/wanlok-component-react"
DEPLOY_PATH="/Users/wanlok/Files/Projects/wanlok.github.io"

BUILD_PATH=$REPOSITORY_PATH/build

cd $DEPLOY_PATH

git pull

find $DEPLOY_PATH -mindepth 1 -not -path $DEPLOY_PATH/.git -not -path "$DEPLOY_PATH/.git/*" -exec rm -rf {} +

cd $REPOSITORY_PATH

rm -rf $BUILD_PATH

npm run build && {
  cp -r $BUILD_PATH/. $DEPLOY_PATH

  cd $DEPLOY_PATH

  git add .
  git commit -m "commit"
  git push

  cd $REPOSITORY_PATH

  rm -rf $BUILD_PATH
}
